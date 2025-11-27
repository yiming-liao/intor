"use client";

import type { TranslateHandlersProviderProps } from "./types";
import * as React from "react";
import { TranslateHandlersContext } from "./context";

// provider
export const TranslateHandlersProvider = ({
  handlers,
  children,
}: TranslateHandlersProviderProps) => {
  return (
    <TranslateHandlersContext.Provider value={{ handlers }}>
      {children}
    </TranslateHandlersContext.Provider>
  );
};
