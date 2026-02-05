  import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
  import { CommonModule } from "@angular/common";
  import { Router } from "@angular/router";
  import { FormsModule } from "@angular/forms";

  import { TableModule } from "primeng/table";
  import { TagModule } from "primeng/tag";
  import { ButtonModule } from "primeng/button";

  import { AuthService } from "../../auth/auth.service";
  import { UsersService } from "../../data/users.service";
  import { MatchesService } from "../../data/matches.service";
  import { Match, MatchResponse } from '../../data/models';
import { Checkbox } from "primeng/checkbox";
import { ResponsesService } from '../../data/responses.service';

type MatchWithLineUp = Match & { lineUp: boolean };

  @Component({
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, TagModule, ButtonModule, Checkbox],
    template: `
      <h4 class="m-0 mb-3">Souhaites-tu participer au line-up avec nos Dames ?</h4>

      <p-table [value]="matches" [paginator]="true" [rows]="10" [loading]="loading">
        <ng-template pTemplate="header">
          <tr>
            <th>Date</th>
            <th>Adversaire</th>
            <th>Lieu</th>
            <th>Participe au line-up?</th>
            <th></th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-m>
          <tr>
            <td>{{ m.dateTime | date:"EEE d MMM, HH:mm" }}</td>
            <td>{{ m.opponent }}</td>
            <td>{{ m.location }}</td>
            <td class="text-right">
              <div class="flex align-items-center gap-2">
                <p-checkbox [(ngModel)]="m.lineUp" binary="true" (ngModelChange)="save(m)"></p-checkbox>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <h4 class="m-0 mb-3">Qui participe</h4>
      <div *ngFor="let item of lineupByMatch" class="mb-4">
      <h3>
        {{ item.match.dateTime | date:"EEE d MMM, HH:mm" }} —
        vs {{ item.match.opponent }}
      </h3>

      <ul>
        <li *ngFor="let c of item.children">
          {{ c.childName }}
        </li>
      </ul>

      <p *ngIf="item.children.length === 0">
        Aucun enfant inscrit pour ce lineup.
      </p>
    </div>


      <small class="text-red-500" *ngIf="error">{{ error }}</small>
    `,
  })
  export class LineUpComponent implements OnInit {
    matches: MatchWithLineUp[] = [];
    loading = true;
    error = "";

    lineupByMatch: {
      match: Match;
      children: MatchResponse[];
    }[] = [];


    lineUp = false;

    constructor(
      private readonly auth: AuthService,
      private readonly cdr: ChangeDetectorRef,
      private readonly users: UsersService,
      private readonly matchesService: MatchesService,
      private readonly router: Router,
      private readonly responses: ResponsesService
    ) {}

    ngOnInit() {
      this.loadData();
    }

    private async loadData(): Promise<void> {
      this.loading = true;
      this.error = "";

      try {
        const uid = this.auth.uid();
        if (!uid) throw new Error("Non connecté");

        const user = await this.users.getUser(uid);
        if (!user) throw new Error("Profil utilisateur introuvable (users/{uid})");

        // 1. Charger les matchs et injecter lineUp pour l'utilisateur courant
        this.matches = (await this.matchesService.getMatchesByTeam("DH-Dames"))
          .map(m => ({ ...m, lineUp: false }));

        for (const m of this.matches) {
          const resp = await this.responses.getMyResponse(m.id, uid);
          m.lineUp = resp?.lineup ?? false;
        }

        // 2. Construire lineupByMatch (liste des enfants participants par match)
        const result: {
          match: Match;
          children: MatchResponse[];
        }[] = [];

        for (const m of this.matches) {
          const responses = await this.responses.getAllResponses(m.id);
          const lineupChildren = responses.filter(r => r.lineup === true);

          result.push({
            match: m,
            children: lineupChildren
          });
        }

        this.lineupByMatch = result;

      } catch (e: any) {
        this.error = e?.message ?? "Erreur chargement matchs";
      } finally {
        this.loading = false;
        this.cdr.detectChanges();
      }
    }

    async save(m: MatchWithLineUp) {

    try {
      const uid = this.auth.uid();
      if (!uid) throw new Error("Non connecté");

      const user = await this.users.getUser(uid);
      if (!user) throw new Error("Profil utilisateur introuvable.");

      await this.responses.saveMyResponse(m.id, uid, {
        childName: user.childName,
        status: "maybe",
        bringOranges: false,
        referee: false,
        goalkeeper: false,
        lineup: m.lineUp,
        updatedAt: Date.now(),
      });

    } catch (e: any) {
      this.error = e?.message ?? "Erreur sauvegarde";
    }
    finally{
      this.loadData();
    }
  }

    go(matchId: string) {
      this.router.navigate(["/match", matchId]);
    }
  }
