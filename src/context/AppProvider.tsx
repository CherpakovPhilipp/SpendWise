
"use client";

import * as React from "react";
import { AppStore } from "@/store/AppStore";

const AppContext = React.createContext<AppStore | null>(null);

export function useApp() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const store = React.useRef(new AppStore());

  React.useEffect(() => {
    // This effect runs only on the client, after the initial render.
    // It safely reads from localStorage and updates the store.
    const storedMode = (localStorage.getItem("mode") as "online" | "offline") || "offline";
    store.current.setMode(storedMode);
  }, []); // The empty dependency array ensures this runs only once on mount.

  return (
    <AppContext.Provider value={store.current}>
      {children}
    </AppContext.Provider>
  );
}
