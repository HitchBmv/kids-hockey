import { Routes } from "@angular/router";
import { authGuard } from "./auth/auth.guard";
import { LoginComponent } from "./pages/login/login.component";
import { MatchesComponent } from "./pages/matches/matches.component";
import { MatchDetailComponent } from "./pages/match-detail/match-detail.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { LayoutComponent } from "./shared/layout.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent },

  {
    path: "",
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: "", pathMatch: "full", redirectTo: "matches" },
      { path: "matches", component: MatchesComponent },
      { path: "match/:id", component: MatchDetailComponent },
      { path: "dashboard", component: DashboardComponent },
    ],
  },

  { path: "**", redirectTo: "" },
];
