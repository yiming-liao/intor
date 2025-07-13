"use client";

import type { IntorTranslatorContextValue } from "./types";
import * as React from "react";

// Context
export const IntorTranslatorContext = React.createContext<
  IntorTranslatorContextValue | undefined
>(undefined);
