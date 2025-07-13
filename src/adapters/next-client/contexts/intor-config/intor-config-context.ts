"use client";

import type { IntorConfigContextValue } from "./types";
import * as React from "react";

// Context
export const IntorConfigContext = React.createContext<
  IntorConfigContextValue | undefined
>(undefined);
