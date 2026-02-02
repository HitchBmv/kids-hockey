import { Injectable, computed, signal } from "@angular/core";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

@Injectable({ providedIn: "root" })
export class AuthService {
  private _user = signal<User | null>(null);
  user = computed(() => this._user());
  uid = computed(() => this._user()?.uid ?? null);
  isLoggedIn = computed(() => !!this._user());

  constructor() {
    onAuthStateChanged(auth, (u) => this._user.set(u));
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  logout() {
    return signOut(auth);
  }
}
