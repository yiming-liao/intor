"use client";

import type { IntorTranslatorContextValue } from "./types";
import * as React from "react";
import { IntorTranslatorContext } from "./intor-translator-context";

// Hook
export function useIntorTranslator<M>() {
  const context = React.useContext(IntorTranslatorContext) as
    | IntorTranslatorContextValue<M>
    | undefined;

  if (!context) {
    throw new Error(
      "useIntorTranslator must be used within IntorTranslatorProvider",
    );
  }

  return context;
}
