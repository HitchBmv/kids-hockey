import { Injectable } from "@angular/core";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AppUser } from "./models";

@Injectable({ providedIn: "root" })
export class UsersService {
  async getUser(uid: string): Promise<AppUser | null> {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as AppUser) : null;
  }

  async upsertUser(user: AppUser): Promise<void> {
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, user, { merge: true });
  }
}
