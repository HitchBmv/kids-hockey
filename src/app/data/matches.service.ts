import { Injectable } from "@angular/core";
import { collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Match } from "./models";

@Injectable({ providedIn: "root" })
export class MatchesService {
  async getMatchesByTeam(teamId: string): Promise<Match[]> {
    const q = query(
      collection(db, "matches"),
      where("teamId", "==", teamId),
      orderBy("dateTime", "asc")
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as any;

      // Si tu stockes dateTime en Firestore Timestamp:
      const dt =
        data.dateTime instanceof Timestamp ? data.dateTime.toMillis() : (data.dateTime ?? 0);

      return {
        id: d.id,
        teamId: data.teamId,
        dateTime: dt,
        opponent: data.opponent ?? "",
        location: data.location ?? "",
        isHome: !!data.isHome,
      } satisfies Match;
    });
  }

  async getMatch(matchId: string): Promise<Match | null> {
    // Optionnel si tu veux lire un match direct : à implémenter si besoin
    return null;
  }
}
