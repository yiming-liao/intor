"use client";

import type { IntorLocaleContextValue } from "./types";
import * as React from "react";
import { IntorLocaleContext } from "./intor-locale-context";

// Hook
export const useIntorLocale = () => {
  const context = React.useContext(IntorLocaleContext) as
    | IntorLocaleContextValue
    | undefined;

  if (!context) {
    throw new Error("useIntorLocale must be used within a IntorLocaleProvider");
  }

  return context;
};
