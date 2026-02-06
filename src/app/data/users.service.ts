import { Injectable } from "@angular/core";
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy,where } from "firebase/firestore";
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

  async getPlayersByTeam(teamId: string): Promise<any[]> {
    const ref = collection(db, "Children");
    const q = query(
      ref,
      where("teamId", "==", teamId),
      orderBy("Prenom", "asc")
    );

    const snap = await getDocs(q);

    return snap.docs.map(d => {
      const data = d.data() as any;

      return {
        id: d.id,
        ...data,
        fullName: `${data.Prenom} ${data.Nom}`
      };
    });
  }

}
