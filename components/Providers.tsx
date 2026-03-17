"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useOperatorStore } from "@/lib/store";

function CloudSyncer({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const syncFromCloud = useOperatorStore(state => state.syncFromCloud);
  const hasSynced = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email && !hasSynced.current) {
      hasSynced.current = true;
      syncFromCloud();
    }
  }, [status, session, syncFromCloud]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CloudSyncer>{children}</CloudSyncer>
    </SessionProvider>
  );
}
