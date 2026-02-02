import { environment } from '../environments/environments';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseApp = initializeApp(environment.firebase);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
