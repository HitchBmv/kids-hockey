  import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
  import { CommonModule } from "@angular/common";
  import { Router } from "@angular/router";

  import { TableModule } from "primeng/table";
  import { TagModule } from "primeng/tag";
  import { ButtonModule } from "primeng/button";

  import { AuthService } from "../../auth/auth.service";
  import { UsersService } from "../../data/users.service";
  import { MatchesService } from "../../data/matches.service";
  import { Match } from "../../data/models";

  @Component({
    standalone: true,
    imports: [CommonModule, TableModule, TagModule, ButtonModule],
    template: `
      <h2 class="m-0 mb-3">Matchs</h2>

      <p-table [value]="matches" [paginator]="true" [rows]="10" [loading]="loading">
        <ng-template pTemplate="header">
          <tr>
            <th>Date</th>
            <th>Adversaire</th>
            <th>Lieu</th>
            <th>Domicile</th>
            <th></th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-m>
          <tr>
            <td>{{ m.dateTime | date:"EEE d MMM, HH:mm" }}</td>
            <td>{{ m.opponent }}</td>
            <td>{{ m.location }}</td>
            <td>
              <p-tag [value]="m.isHome ? 'Domicile' : 'Extérieur'" [severity]="m.isHome ? 'success' : 'info'"></p-tag>
            </td>
            <td class="text-right">
              <button pButton label="Répondre" (click)="go(m.id)"></button>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <small class="text-red-500" *ngIf="error">{{ error }}</small>
    `,
  })
  export class MatchesComponent implements OnInit {
    matches: Match[] = [];
    loading = true;
    error = "";

    constructor(
      private readonly auth: AuthService,
      private readonly cdr: ChangeDetectorRef,
      private readonly users: UsersService,
      private readonly matchesService: MatchesService,
      private readonly router: Router
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

        this.matches = await this.matchesService.getMatchesByTeam(user.teamId);
      } catch (e: any) {
        this.error = e?.message ?? "Erreur chargement matchs";
      } finally {
        this.loading = false;
        this.cdr.detectChanges();
      }
    }

    go(matchId: string) {
      this.router.navigate(["/match", matchId]);
    }
  }
