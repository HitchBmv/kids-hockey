import { Injectable } from "@angular/core";
import {
  setDoc,
  doc,
  getDoc,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import { MatchResponse } from "./models";
import { PLAYERS } from "./users.service";

@Injectable({ providedIn: "root" })
export class ResponsesService {
  private responseDoc(matchId: string, uid: string) {
    return doc(db, "matches", matchId, "responses", uid);
  }

  async getMyResponse(matchId: string, uid: string): Promise<MatchResponse | null> {
    const ref = this.responseDoc(matchId, uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data() as any;
    const updated =
      data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : (data.updatedAt ?? 0);

    return {
      uid: data.uid,
      childName: data.childName ?? "",
      status: data.status ?? "maybe",
      bringOranges: !!data.bringOranges,
      referee: !!data.referee,
      goalkeeper: !!data.goalkeeper,
      lineup: !!data.lineup,
      updatedAt: updated,
    };
  }

  async saveMyResponse(matchId: string, uid: string, payload: Omit<MatchResponse, "uid">) {
    // Vérifier si l'UID existe dans la liste PLAYERS
    const player = PLAYERS.find(p => p.uid === uid);
    if (player){
      const ref = this.responseDoc(matchId, uid);
      await setDoc(ref, { uid, ...payload }, { merge: true });
    }
  }

  // private responsesCollection(matchId: string) {
  //   return collection(db, `matches/${matchId}/responses`);
  // }
  // async saveMyResponse(matchId: string, uid: string, payload: Omit<MatchResponse, "uid">) {
  //   const col = this.responsesCollection(matchId); // matches/{matchId}/responses
  //   await addDoc(col, { uid, ...payload, createdAt: Date.now() });
  // }

  async getAllResponses(matchId: string): Promise<MatchResponse[]> {
    const col = collection(db, "matches", matchId, "responses");
    const snap = await getDocs(col);

    return snap.docs.map((d) => {
      const data = d.data() as any;
      const updated =
        data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : (data.updatedAt ?? 0);

      return {
        uid: data.uid ?? d.id,
        childName: data.childName ?? "",
        status: data.status ?? "maybe",
        bringOranges: !!data.bringOranges,
        referee: !!data.referee,
        goalkeeper: !!data.goalkeeper,
        lineup: !!data.lineup,
        updatedAt: updated,
      } satisfies MatchResponse;
    });
  }
}
