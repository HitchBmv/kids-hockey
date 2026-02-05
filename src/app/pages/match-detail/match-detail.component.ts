import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

import { CardModule } from "primeng/card";
import { SelectButtonModule } from "primeng/selectbutton";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";

import { AuthService } from "../../auth/auth.service";
import { UsersService } from "../../data/users.service";
import { MatchesService } from "../../data/matches.service";
import { ResponsesService } from "../../data/responses.service";
import { Match, PresenceStatus } from "../../data/models";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    SelectButtonModule,
    CheckboxModule,
    ButtonModule,
  ],
  template: `
    <button pButton label="Retour" severity="secondary" (click)="back()" class="mb-3"></button>

    <p-card header="Réponse au match" *ngIf="match; else loadingTpl">
      <div class="flex flex-column gap-3">
        <div class="text-lg font-semibold">
          {{ match.dateTime | date:"EEE d MMM, HH:mm" }} — vs {{ match.opponent }}
        </div>
        <div class="opacity-80">
          {{ match.location }} • {{ match.isHome ? "Domicile" : "Extérieur" }}
        </div>
        <div class="opacity-80">
          Rendez-vous à {{ getTimeMinus30(match.dateTime) | date:"HH:mm" }}
        </div>

        <div>
          <label class="block mb-2 font-medium">Présence</label>
          <p-selectButton
            [options]="presenceOptions"
            optionLabel="label"
            optionValue="value"
            [(ngModel)]="status">
          </p-selectButton>
        </div>

        @if (match.isHome) {
          <div class="mt-2">
            <div class="flex align-items-center gap-2 mb-2">
              <p-checkbox [(ngModel)]="bringOranges" binary="true"></p-checkbox>
              <label>OK pour amener des oranges</label>
            </div>
            <div class="flex align-items-center gap-2">
              <p-checkbox [(ngModel)]="referee" binary="true"></p-checkbox>
              <label>OK pour arbitrer</label>
            </div>
          </div>
        }
        <div class="mt-2">
          <div class="flex align-items-center gap-2">
            <p-checkbox [(ngModel)]="goalkeeper" binary="true"></p-checkbox>
            <label>OK pour jouer gardienne</label>
          </div>
        </div>


        <button pButton label="Enregistrer" (click)="save()" [disabled]="saving"></button>

        <small class="text-green-600" *ngIf="saved">Enregistré ✔</small>
        <small class="text-red-500" *ngIf="error">{{ error }}</small>
      </div>
    </p-card>

    <ng-template #loadingTpl>
      <p-card header="Chargement..."></p-card>
    </ng-template>
  `,
})
export class MatchDetailComponent implements OnInit {
  match: Match | null = null;

  status: PresenceStatus = "maybe";
  bringOranges = false;
  referee = false;
  goalkeeper = false;

  saving = false;
  saved = false;
  error = "";

  presenceOptions = [
    { label: "Présent", value: "yes" },
    { label: "Absent", value: "no" },
    { label: "Incertain", value: "maybe" },
  ];

  private matchId = "";

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly users: UsersService,
    private readonly matchesService: MatchesService,
    private readonly responses: ResponsesService
  ) {}

  ngOnInit() {
    this.LoadData();
  }

  private async LoadData(){
    this.matchId = this.route.snapshot.paramMap.get("id") ?? "";
    this.error = "";

    try {
      const uid = this.auth.uid();
      if (!uid) throw new Error("Non connecté");

      const user = await this.users.getUser(uid);
      if (!user) throw new Error("Profil utilisateur introuvable.");

      // MVP simple : on recharge la liste des matchs et on retrouve le match
      const matches = await this.matchesService.getMatchesByTeam(user.teamId);
      this.match = matches.find((m) => m.id === this.matchId) ?? null;
      if (!this.match) throw new Error("Match introuvable.");

      // Charger réponse existante
      const existing = await this.responses.getMyResponse(this.matchId, uid);
      if (existing) {
        this.status = existing.status;
        this.bringOranges = existing.bringOranges;
        this.referee = existing.referee;
        this.goalkeeper = existing.goalkeeper;
      }
    } catch (e: any) {
      this.error = e?.message ?? "Erreur chargement match";
    }
    finally {
      this.cdr.detectChanges();
    }
  }

  back() {
    this.router.navigateByUrl("/matches");
  }

  async save() {
    this.saved = false;
    this.error = "";
    this.saving = true;

    try {
      const uid = this.auth.uid();
      if (!uid) throw new Error("Non connecté");

      const user = await this.users.getUser(uid);
      if (!user) throw new Error("Profil utilisateur introuvable.");

      const isHome = !!this.match?.isHome;

      await this.responses.saveMyResponse(this.matchId, uid, {
        childName: user.childName,
        status: this.status,
        bringOranges: isHome ? this.bringOranges : false,
        referee: isHome ? this.referee : false,
        goalkeeper: this.goalkeeper,
        lineup: this.goalkeeper,
        updatedAt: Date.now(),
      });

      this.saved = true;
    } catch (e: any) {
      this.error = e?.message ?? "Erreur sauvegarde";
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  getTimeMinus30(timestamp: number): Date {
    const d = new Date(timestamp);
    d.setMinutes(d.getMinutes() - 30);
    return d;
  }

}
