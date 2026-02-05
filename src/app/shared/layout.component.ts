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
      <ng-template pTemplate="start">
        <img
          src="/waterloo-ducks-small.jpg"
          alt="Logo"
          height="48"
          class="mr-2"
        />
      </ng-template>

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
    { label: "Matchs", routerLink: "/matchs" },
    { label: "Dashboard", routerLink: "/dashboard" },
    { label: "Line-Up", routerLink: "/lineup" },
  ];

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl("/login");
  }
}
