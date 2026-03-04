import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CheckboxModule } from "primeng/checkbox";
import { SelectModule } from 'primeng/select';

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
  goalkeeper: boolean;
};

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, TagModule, CheckboxModule, SelectModule],
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
          <!-- Date -->
          <th pSortableColumn="dateTime">Date <p-sortIcon field="dateTime"></p-sortIcon></th>
          <!-- Match (opponent) -->
          <th>
            Match
            <p-columnFilter field="opponent" matchMode="contains" display="menu">
            </p-columnFilter>
          </th>

          <!-- Domicile (boolean) -->
          <th>
            Domicile
            <p-columnFilter field="isHome" matchMode="equals" display="menu">
              <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                <p-select
                  [options]="booleanOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="value"
                  (onChange)="filter($event.value)">
                </p-select>
              </ng-template>
            </p-columnFilter>
          </th>

          <!-- Enfant -->
          <th>
            Enfant
            <p-columnFilter field="childName" matchMode="contains" display="menu">
            </p-columnFilter>
          </th>

          <th>Statut
            <p-columnFilter field="status" matchMode="equals" display="menu">
              <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                <p-select
                  [options]="presenceOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="value"
                  (onChange)="filter($event.value)">
                </p-select>
              </ng-template>
            </p-columnFilter>
          </th>

          <!-- Oranges -->
          <th>
            Apporte les oranges
            <p-columnFilter field="bringOranges" matchMode="equals" display="menu">
              <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                <p-select
                  [options]="booleanOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="value"
                  (onChange)="filter($event.value)">
                </p-select>
              </ng-template>
            </p-columnFilter>
          </th>

          <!-- Arbitre -->
          <th>
            Parent arbitre
            <p-columnFilter field="referee" matchMode="equals" display="menu">
              <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                <p-select
                  [options]="booleanOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="value"
                  (onChange)="filter($event.value)">
                </p-select>
              </ng-template>
            </p-columnFilter>
          </th>

          <!-- Goalkeeper -->
          <th>
            Joue au goal
            <p-columnFilter field="goalkeeper" matchMode="equals" display="menu">
              <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                <p-select
                  [options]="booleanOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="value"
                  (onChange)="filter($event.value)">
                </p-select>
              </ng-template>
            </p-columnFilter>
          </th>

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
            <p-tag
              [value]="getStatusValue(r.status)"
              [severity]="getStatusSeverity(r.status)">
            </p-tag>
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
          <td class="text-center">
            <p-checkbox
              [binary]="true"
              [ngModel]="r.goalkeeper"
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

  booleanOptions = [ { label: 'Oui', value: 'true' }, { label: 'Non', value: 'false' },]
  presenceOptions = [
    { label: 'Présent', value: 'yes' },
    { label: 'Incertain', value: 'maybe' },
    { label: 'Absent', value: 'no' }
  ];

  getStatusValue(status: string): string {
    return {
      yes: 'Présent',
      maybe: 'Incertain',
      no: 'Absent'
    }[status] ?? 'Absent';
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'danger' {
    return {
      yes: 'success',
      maybe: 'info',
      no: 'danger'
    }[status] as 'success' | 'info' | 'danger' ?? 'danger';
  }

  private async loadData() {
    this.loading = true;
    this.error = "";

    try {
      const uid = this.auth.uid(); // peut être null pour invité
      let user = null;
      if (uid) {
        user = await this.users.getUser(uid);
      }

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

            childName: this.normalizeChildName(r.childName),
            status: r.status,
            bringOranges: m.isHome ? !!r.bringOranges : false,
            referee: m.isHome ? !!r.referee : false,
            goalkeeper: r.goalkeeper,
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

  private normalizeChildName(value: any): string {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    const first = value.firstName ?? "";
    const last = value.lastName ?? "";
    return `${first} ${last}`.trim();
  }

  return String(value);
}
}

