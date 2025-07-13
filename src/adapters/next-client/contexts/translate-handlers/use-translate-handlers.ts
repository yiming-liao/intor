"use client";

import * as React from "react";
import { TranslateHandlersContext } from "./translate-handlers-context";
import { TranslateHandlersContextValue } from "./types";

// Hook
export const useTranslateHandlers = () => {
  const context = React.useContext(TranslateHandlersContext) as
    | TranslateHandlersContextValue
    | undefined;

  return context;
};
