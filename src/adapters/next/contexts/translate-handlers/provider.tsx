"use client";

import type { TranslateHandlersProviderProps } from "./types";
import { TranslateHandlersContext } from "./context";
import * as React from "react";

// Provider
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
