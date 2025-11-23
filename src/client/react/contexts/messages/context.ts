import type { MessagesContextValue } from "./types";
import * as React from "react";

// context
export const MessagesContext = React.createContext<
  MessagesContextValue | undefined
>(undefined);
