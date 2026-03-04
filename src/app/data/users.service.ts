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

  getPlayersByTeam(teamId: string): Player[] {
    return PLAYERS
      .filter(p => p.teamId === teamId)
      .sort((a, b) => a.Prenom.localeCompare(b.Prenom));
  }

  async getDatabasePlayersByTeam(teamId: string): Promise<any[]> {
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

export const PLAYERS: Player[] = [
  {
    id: '1',
    uid: 'zeucPCSrcYOWFRz1PELxIirw2MB3',
    Nom: 'Haenecour',
    Prenom: 'Margaux',
    teamId: 'U9-Girls-W3',
    fullName: 'Margaux Haenecour'
  },
  {
    id: '2',
    uid: 'D9jpPIjNOPVczYSOP98HRJXspNT2',
    Nom: 'Boussaid Mendez-Vigo',
    Prenom: 'Danaé',
    teamId: 'U9-Girls-W3',
    fullName: 'Danaé Boussaid Mendez-Vigo'
  },
  {
    id: '3',
    uid: 'Wi0pGwAwjiXM321B0wBJpgI1Y5t1',
    Nom: 'Peeters',
    Prenom: 'Josephine',
    teamId: 'U9-Girls-W3',
    fullName: 'Josephine Peeters'
  },
   {
    id: '4',
    uid: 'uRjUnzTezSOM3jDx0Qa9n2tBANj1',
    Nom: 'Vernieuwe',
    Prenom: 'Margaux',
    teamId: 'U9-Girls-W3',
    fullName: 'Margaux Vernieuwe'
  },
  {
    id: '5',
    uid: 'dstNji76kjM4j3sLAM4s4MOkt8L2',
    Nom: 'Doetsch Khalladi',
    Prenom: 'Maya',
    teamId: 'U9-Girls-W3',
    fullName: 'Maya Doetsch Khalladi'
  },
  {
    id: '6',
    uid: 'GpEMBaIQLTaXgHiuuijUBd62Qbe2',
    Nom: 'Tilkens',
    Prenom: 'Elizabeth',
    teamId: 'U9-Girls-W3',
    fullName: 'Elizabeth Tilkens'
  },
  {
    id: '7',
    uid: 'yzhpGNnOPleoEqgIESL7oMo6kb43',
    Nom: 'Massart',
    Prenom: 'Axelle',
    teamId: 'U9-Girls-W3',
    fullName: 'Axelle Massart'
  },
  {
    id: '8',
    uid: '9MZhkE5BcDlmJlRrpf3Z',
    Nom: 'Poncelet',
    Prenom: 'Jade',
    teamId: 'U9-Girls-W3',
    fullName: 'Jade Poncelet'
  },
  {
    id: '9',
    uid: '2zgN2p2RpIZVItFIoGp0XL8oGPn1',
    Nom: 'Tazi',
    Prenom: 'Naëlle',
    teamId: 'U9-Girls-W3',
    fullName: 'Naëlle Tazi'
  },
  {
    id: '10',
    uid: '4fsg6SSvXMRnMKZbkb5B1lI44ic2',
    Nom: 'Fabri d Enneilles Giménez',
    Prenom: 'Victoria',
    teamId: 'U9-Girls-W3',
    fullName: 'Victoria Fabri d Enneilles Giménez'
  },
];

export interface Player {
  id: string;
  uid: string;
  Nom: string;
  Prenom: string;
  teamId: string;
  fullName: string;
}

