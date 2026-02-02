import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CheckboxModule } from "primeng/checkbox";

import { AuthService } from "../../auth/auth.service";
import { UsersService } from "../../data/users.service";
import { MatchesService } from "../../data/matches.service";
import { ResponsesService } from "../../data/responses.service";
import { MatchResponse } from "../../data/models";

type DashboardRow = {
  matchId: string;
  dateTime: number;
  opponent: string;
  isHome: boolean;

  childName: string;
  status: "yes" | "no" | "maybe";
  bringOranges: boolean;
  referee: boolean;
};

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, TagModule, CheckboxModule],
  template: `
    <h2 class="m-0 mb-3">Dashboard</h2>

    <p-table
      [value]="rows"
      [loading]="loading"
      [paginator]="true"
      [rows]="10"
      sortField="dateTime"
      [sortOrder]="1"
    >
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="dateTime">Date <p-sortIcon field="dateTime"></p-sortIcon></th>
          <th>Match</th>
          <th>Domicile</th>
          <th>Enfant</th>
          <th>Statut</th>
          <th>Je peux apporter des oranges</th>
          <th>Je peux arbitrer le match</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-r>
        <tr>
          <td>{{ r.dateTime | date:"EEE d MMM, HH:mm" }}</td>
          <td>vs {{ r.opponent }}</td>

          <td>
            <p-tag
              [value]="r.isHome ? 'Oui' : 'Non'"
              [severity]="r.isHome ? 'success' : 'info'">
            </p-tag>
          </td>

          <td>{{ r.childName }}</td>

          <td>
            {{ statusLabel(r.status) }}
          </td>

          <td class="text-center">
            <p-checkbox
              [binary]="true"
              [ngModel]="r.bringOranges"
              [disabled]="true">
            </p-checkbox>
          </td>

          <td class="text-center">
            <p-checkbox
              [binary]="true"
              [ngModel]="r.referee"
              [disabled]="true">
            </p-checkbox>
          </td>
        </tr>
      </ng-template>
    </p-table>

    <small class="text-red-500" *ngIf="error">{{ error }}</small>
  `,
})
export class DashboardComponent implements OnInit {
  rows: DashboardRow[] = [];
  loading = true;
  error = "";

  constructor(
    private readonly auth: AuthService,
    private readonly cdr: ChangeDetectorRef,
    private readonly users: UsersService,
    private readonly matchesService: MatchesService,
    private readonly responses: ResponsesService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  statusLabel(s: "yes" | "no" | "maybe") {
    switch (s) {
      case "yes": return "Présent";
      case "maybe": return "Incertain";
      case "no": return "Absent";
      default: return s;
    }
  }

  private async loadData() {
    this.loading = true;
    this.error = "";

    try {
      const uid = this.auth.uid();
      if (!uid) throw new Error("Non connecté");

      const user = await this.users.getUser(uid);
      if (!user) throw new Error("Profil utilisateur introuvable.");

      const matches = await this.matchesService.getMatchesByTeam(user.teamId);

      const allRows: DashboardRow[] = [];

      for (const m of matches) {
        const rs: MatchResponse[] = await this.responses.getAllResponses(m.id);

        // ✅ Une ligne par réponse (enfant)
        for (const r of rs) {
          allRows.push({
            matchId: m.id,
            dateTime: m.dateTime,
            opponent: m.opponent,
            isHome: m.isHome,

            childName: r.childName ?? "",
            status: r.status,
            bringOranges: m.isHome ? !!r.bringOranges : false,
            referee: m.isHome ? !!r.referee : false,
          });
        }
      }

      // Optionnel : trier par date puis enfant
      allRows.sort((a, b) => a.dateTime - b.dateTime || a.childName.localeCompare(b.childName));

      this.rows = allRows;
    } catch (e: any) {
      this.error = e?.message ?? "Erreur dashboard";
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}

