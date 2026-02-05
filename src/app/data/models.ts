export type PresenceStatus = "yes" | "no" | "maybe";

export interface AppUser {
  uid: string;
  email: string;
  teamId: string;      // ex: "U14-Girls-A"
  childName: string;   // MVP: un enfant
  createdAt: number;   // Date.now()
}

export interface Match {
  id: string;
  teamId: string;
  dateTime: number;    // timestamp ms (Date.now or Firestore Timestamp converti)
  opponent: string;
  location: string;
  isHome: boolean;
}

export interface MatchResponse {
  uid: string;
  childName: string;
  status: PresenceStatus;
  bringOranges: boolean;
  referee: boolean;
  goalkeeper: boolean;
  lineup: boolean;
  updatedAt: number;
}
