import type { MessagesContextValue } from "./types";
import * as React from "react";

// Context
export const MessagesContext = React.createContext<
  MessagesContextValue | undefined
>(undefined);
