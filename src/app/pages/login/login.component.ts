import { ChangeDetectorRef, Component } from "@angular/core";

import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { PasswordModule } from "primeng/password";

import { AuthService } from "../../auth/auth.service";
import { UsersService } from "../../data/users.service";
import { AppUser } from "../../data/models";

@Component({
  standalone: true,
  imports: [
    AutoCompleteModule,
    CommonModule,
    CardModule,
    InputTextModule,
    FormsModule,
    MessageModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
  ],
  template: `
  <style>
  :host {
    --duck-green: oklch(65% 0.17 150);
    --bright-blue: oklch(51.01% 0.274 263.83);
    --electric-violet: oklch(53.18% 0.28 296.97);
    --french-violet: oklch(47.66% 0.246 305.88);
    --vivid-pink: oklch(69.02% 0.277 332.77);
    --hot-red: oklch(61.42% 0.238 15.34);
    --orange-red: oklch(63.32% 0.24 31.68);

    --gray-900: oklch(19.37% 0.006 300.98);
    --gray-700: oklch(36.98% 0.014 302.71);
    --gray-400: oklch(70.9% 0.015 304.04);

    --red-to-pink-to-purple-vertical-gradient: linear-gradient(
      180deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --red-to-pink-to-purple-horizontal-gradient: linear-gradient(
      90deg,
      var(--orange-red) 0%,
      var(--vivid-pink) 50%,
      var(--electric-violet) 100%
    );

    --pill-accent: var(--duck-green);

    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1 {
    font-size: 3.125rem;
    color: var(--gray-900);
    font-weight: 500;
    line-height: 100%;
    letter-spacing: -0.125rem;
    margin: 0;
    font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  p {
    margin: 0;
    color: var(--gray-700);
  }

  main {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    box-sizing: inherit;
    position: relative;
  }

  .angular-logo {
    max-width: 9.2rem;
  }

  .content {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 700px;
    margin-bottom: 3rem;
  }

  .content h1 {
    margin-top: 1.75rem;
  }

  .content p {
    margin-top: 1.5rem;
  }

  .divider {
    width: 1px;
    background: var(--red-to-pink-to-purple-vertical-gradient);
    margin-inline: 0.5rem;
  }

  .pill-group {
    display: flex;
    flex-direction: column;
    align-items: start;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .pill {
    display: flex;
    align-items: center;
    --pill-accent: var(--duck-green);
    background: color-mix(in srgb, var(--pill-accent) 5%, transparent);
    color: var(--pill-accent);
    padding-inline: 0.75rem;
    padding-block: 0.375rem;
    border-radius: 2.75rem;
    border: 0;
    transition: background 0.3s ease;
    font-family: var(--inter-font);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.4rem;
    letter-spacing: -0.00875rem;
    text-decoration: none;
    white-space: nowrap;
  }

  .pill:hover {
    background: color-mix(in srgb, var(--pill-accent) 15%, transparent);
  }

  .pill-group .pill:nth-child(6n + 1) {
    --pill-accent: var(--duck-green);
  }
  .pill-group .pill:nth-child(6n + 2) {
    --pill-accent: var(--electric-violet);
  }
  .pill-group .pill:nth-child(6n + 3) {
    --pill-accent: var(--french-violet);
  }

  .pill-group .pill:nth-child(6n + 4),
  .pill-group .pill:nth-child(6n + 5),
  .pill-group .pill:nth-child(6n + 6) {
    --pill-accent: var(--hot-red);
  }

  .pill-group svg {
    margin-inline-start: 0.25rem;
  }

  .social-links {
    display: flex;
    align-items: center;
    gap: 0.73rem;
    margin-top: 1.5rem;
  }

  .social-links path {
    transition: fill 0.3s ease;
    fill: var(--gray-400);
  }

  .social-links a:hover svg path {
    fill: var(--gray-900);
  }

  @media screen and (max-width: 650px) {
    .content {
      flex-direction: column;
      width: max-content;
    }

    .divider {
      height: 1px;
      width: 100%;
      background: var(--duck-green);
      margin-block: 1.5rem;
    }
  }
</style>
  <main class="main">
  <div class="flex justify-content-center">
    <div class="left-side">
      <img  src="/waterloo-ducks-small.jpg" alt="Logo">
      <h3>Bienvenue dans Wadu Kids! Votre espace pour suivre, organiser et vivre la saison avec l’équipe !</h3>
      <p><i>Ducks fly together 🦆</i></p>
    </div>

    <div class="right-side">
      <div class="pill-group">
        @for (item of [
          { title: 'Waterloo ducks', link: 'https://mywadu.be' }
        ]; track item.title) {
          <a
            class="pill"
            [href]="item.link"
            target="_blank"
            rel="noopener"
          >
            <span>{{ item.title }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="14"
              viewBox="0 -960 960 960"
              width="14"
              fill="currentColor"
            >
              <path
                d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"
              />
            </svg>
          </a>
        }
      </div>
    </div>
  </div>
  </main>
    <div class="flex justify-content-center">
      <p-card header="Connexion" styleClass="w-full md:w-30rem">
        <p-message *ngIf="error" severity="error" [text]="error"></p-message>
        <div class="flex flex-column gap-3">

          <div class="flex flex-column gap-2">
            <label>Email</label>
            <input pInputText [(ngModel)]="email" placeholder="email@..." />
          </div>

          <div class="flex flex-column gap-2">
            <label>Mot de passe</label>
            <p-password [(ngModel)]="password" [feedback]="false"></p-password>
          </div>

          <button pButton label="Se connecter" (click)="onLogin()" [disabled]="busy"></button>

          <p-divider></p-divider>

          <div class="text-sm opacity-80">
            Pour créer votre compte, indiquez:<br>  🏑 email, mot de passe, nom d’équipe, et le nom de l’enfant
          </div>

          <div class="flex flex-column gap-2">
            <label>Nom d'équipe</label>
            <p-autoComplete
              [(ngModel)]="teamId"
              [suggestions]="filteredTeams"
              (completeMethod)="filterTeams($event)"
              placeholder="ex: U9-Girls-A"
              [forceSelection]="false"
              [dropdown]="true">
            </p-autoComplete>

          </div>

          <div class="flex flex-column gap-2">
            <label>Nom enfant</label>
            <input pInputText [(ngModel)]="childName" placeholder="ex: Cris" />
          </div>

          <button pButton label="Créer un compte" severity="secondary" (click)="onRegister()" [disabled]="busy"></button>
        </div>
      </p-card>

    </div>
    <footer class="app-footer">
      © {{ year }} Copyright
      <a href="https://gettalent.be" target="_blank" rel="noopener noreferrer">
        gettalent.be</a>
      All Rights Reserved
    </footer>
  `,
})
export class LoginComponent {
  email = "";
  password = "";
  teamId = "";
  childName = "";

  busy = false;
  error = "";

  teamOptions = [
    "U9-Girls-A",
    "U9-Girls-B",
    "U10-Girls-A",
    "U10-Girls-B",
    "U12-Girls-A",
    "U12-Girls-B",
    "U14-Girls-A",
    "U14-Girls-B",
  ];

  filteredTeams: string[] = [];

  year = new Date().getFullYear();

  filterTeams(event: { query: string }) {
    const q = (event.query ?? "").toLowerCase().trim();
    this.filteredTeams = this.teamOptions.filter(t =>
      t.toLowerCase().includes(q)
    );
  }

  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  async onLogin() {
    this.error = "";
    this.busy = true;
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigateByUrl("/matchs");
    } catch (e: any) {
      this.error = e?.message ?? "Erreur login";
      this.cdr.detectChanges();
    } finally {
      this.busy = false;
    }
  }

  async onRegister() {

    if (!this.teamId?.trim()) {
      this.error = "Choisis une équipe (Team ID).";
      return;
    }

    this.error = "";
    this.busy = true;
    try {
      const cred = await this.auth.register(this.email, this.password);
      const uid = cred.user.uid;

      const user: AppUser = {
        uid,
        email: this.email,
        teamId: this.teamId || "U9-Girls",
        childName: this.childName || "Enfant",
        createdAt: Date.now(),
      };

      await this.users.upsertUser(user);
      this.router.navigateByUrl("/matchs");
    } catch (e: any) {
      this.error = this.formatError(e);
      this.cdr.detectChanges();
    } finally {
      this.busy = false;
    }
  }

  private formatError(e: unknown): string {
    if (!e) return "Erreur inconnue";

    const anyErr = e as any;

    const code = typeof anyErr.code === "string" ? anyErr.code : "";

    let message: string;
    if (typeof anyErr.message === "string") {
      message = anyErr.message;
    } else if (typeof anyErr.toString === "function") {
      message = anyErr.toString();
    } else {
      message = "Erreur inconnue";
    }

    return code ? `${code} – ${message}` : message;
  }

}
