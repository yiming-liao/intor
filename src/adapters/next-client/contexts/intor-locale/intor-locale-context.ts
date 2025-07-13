"use client";

import type { IntorLocaleContextValue } from "./types";
import * as React from "react";

// Context
export const IntorLocaleContext = React.createContext<
  IntorLocaleContextValue | undefined
>(undefined);
