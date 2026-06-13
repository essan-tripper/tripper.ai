"use client";

import { createContext, useContext, ReactNode } from "react";
import { authClient } from "@/lib/db/auth-client";

type SessionData = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
  session: {
    id: string;
    userId: string;
  } | null;
};

type SessionContextType = {
  data: SessionData;
  isPending: boolean;
};

const SessionContext = createContext<SessionContextType>({
  data: { user: null, session: null },
  isPending: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = authClient.useSession();

  const value = data
    ? {
        user: data.user,
        session: data.session
          ? { id: data.session.id, userId: data.session.userId }
          : null,
      }
    : { user: null as SessionData["user"], session: null as SessionData["session"] };

  return (
    <SessionContext.Provider value={{ data: value, isPending }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
