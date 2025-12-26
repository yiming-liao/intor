import type { MessagesContextValue } from "@/client/shared/types";
import * as React from "react";

export const MessagesContext = React.createContext<
  MessagesContextValue | undefined
>(undefined);
