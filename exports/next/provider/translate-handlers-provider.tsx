"use client";

import { TranslateHandlersContext } from "../../../dist/next";
import type { TranslateHandlersProviderProps } from "../../../dist/next";
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
