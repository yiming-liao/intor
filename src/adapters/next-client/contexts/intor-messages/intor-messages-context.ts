"use client";

import type { IntorMessagesContextValue } from "./types";
import * as React from "react";

// Context
export const IntorMessagesContext = React.createContext<
  IntorMessagesContextValue | undefined
>(undefined);
