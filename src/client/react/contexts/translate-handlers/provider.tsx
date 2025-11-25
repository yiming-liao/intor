"use client";

import type { TranslateHandlersProviderProps } from "./types";
import * as React from "react";
import { TranslateHandlersContext } from "./context";

// provider
export const TranslateHandlersProvider = ({
  children,
  handlers,
}: TranslateHandlersProviderProps) => {
  const value = handlers;

  return (
    <TranslateHandlersContext.Provider value={value}>
      {children}
    </TranslateHandlersContext.Provider>
  );
};
