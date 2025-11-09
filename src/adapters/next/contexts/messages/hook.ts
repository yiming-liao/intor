import type { MessagesContextValue } from "./types";
import * as React from "react";
import { MessagesContext } from "./context";

// Hook
export function useMessages(): MessagesContextValue {
  const context = React.useContext(MessagesContext);
  if (!context)
    throw new Error("useMessages must be used within a MessagesProvider");
  return context;
}
