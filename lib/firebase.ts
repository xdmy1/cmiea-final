import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Public Firebase web configuration. Access continues to be enforced by the
// existing Firebase Authentication and Firestore rules.
export function firebaseClient() {
  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: "AIzaSyBoWwArqP6pYGvVSBzCbUnOphhzk0Pi9oQ",
        authDomain: "tekwill-441fe.firebaseapp.com",
        projectId: "tekwill-441fe",
        storageBucket: "tekwill-441fe.firebasestorage.app",
        messagingSenderId: "990223834307",
        appId: "1:990223834307:web:c1a9da67d5e5f070db1676",
      });
  return { auth: getAuth(app), db: getFirestore(app) };
}
