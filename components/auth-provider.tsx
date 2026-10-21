"use client";
import { sitePath } from "@/lib/site-path";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firebaseClient } from "@/lib/firebase";

type AuthState = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  name: string;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<AuthState, "logout">>({
    user: null,
    loading: true,
    isAdmin: false,
    name: "",
  });
  useEffect(() => {
    const { auth, db } = firebaseClient();
    let current = 0;
    let alive = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const generation = ++current;
      let isAdmin = false;
      let name = user?.displayName || user?.email?.split("@")[0] || "";
      if (user) {
        try {
          const snapshot = await getDoc(doc(db, "users", user.uid));
          const data = snapshot.data();
          isAdmin = data?.role === "admin";
          if (!user.displayName && data)
            name =
              [data.lastName, data.firstName].filter(Boolean).join(" ") || name;
        } catch {
          /* A failed role lookup never grants admin access. */
        }
      }
      if (alive && generation === current)
        setState({ user, loading: false, isAdmin, name });
    });
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);
  async function logout() {
    await signOut(firebaseClient().auth);
    location.assign(sitePath("/home/"));
  }
  return <AuthContext value={{ ...state, logout }}>{children}</AuthContext>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider is required");
  return value;
}
