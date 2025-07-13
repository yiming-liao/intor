"use client";

import type { IntorMessagesContextValue } from "./types";
import * as React from "react";
import { IntorMessagesContext } from "./intor-messages-context";

// Hook
export const useIntorMessages = (): IntorMessagesContextValue => {
  const context = React.useContext(IntorMessagesContext) as
    | IntorMessagesContextValue
    | undefined;

  if (!context) {
    throw new Error(
      "useIntorMessages must be used within a IntorMessagesProvider",
    );
  }

  return context;
};
