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

export function AuthProvider({
  children,
  initialSession = null,
}: {
  children: ReactNode;
  initialSession?: SessionData | null;
}) {
  const { data, isPending } = authClient.useSession();

  const clientValue: SessionData | null = data
    ? {
        user: data.user,
        session: data.session
          ? { id: data.session.id, userId: data.session.userId }
          : null,
      }
    : null;

  // Prefer the resolved client session; while it's still loading, fall back to the
  // server-prefetched session so first paint already shows the signed-in state.
  const value: SessionData =
    clientValue ??
    (isPending ? initialSession : null) ?? { user: null, session: null };

  return (
    <SessionContext.Provider
      value={{ data: value, isPending: isPending && !initialSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
