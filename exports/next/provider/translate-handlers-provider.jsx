"use client";

import * as React from "react";
import { TranslateHandlersContext } from "../../../dist/next";

// Provider
export const TranslateHandlersProvider = ({ children, handlers }) => {
  const value = handlers;

  return (
    <TranslateHandlersContext.Provider value={value}>
      {children}
    </TranslateHandlersContext.Provider>
  );
};
