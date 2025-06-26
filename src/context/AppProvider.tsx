
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

  return (
    <AppContext.Provider value={store.current}>
      {children}
    </AppContext.Provider>
  );
}
