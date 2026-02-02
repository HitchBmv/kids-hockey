import { Component } from "@angular/core";
import { RouterOutlet, Router } from "@angular/router";
import { CommonModule } from "@angular/common";

import { MenubarModule } from "primeng/menubar";
import { ButtonModule } from "primeng/button";

import { AuthService } from "../auth/auth.service";

@Component({
  standalone: true,
  selector: "app-layout",
  imports: [CommonModule, RouterOutlet, MenubarModule, ButtonModule],
  template: `
    <p-menubar [model]="items">
      <ng-template pTemplate="end">
        <button pButton type="button" label="Logout" (click)="logout()"></button>
      </ng-template>
    </p-menubar>

    <div class="p-3">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class LayoutComponent {
  items = [
    { label: "Matchs", routerLink: "/matches" },
    { label: "Dashboard", routerLink: "/dashboard" },
  ];

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl("/login");
  }
}
