"use client";

import type { IntorConfigContextValue } from "./types";
import * as React from "react";
import { IntorConfigContext } from "./intor-config-context";

// Hook
export const useIntorConfig = (): IntorConfigContextValue => {
  const context = React.useContext(IntorConfigContext) as
    | IntorConfigContextValue
    | undefined;

  if (!context) {
    throw new Error("useIntorConfig must be used within IntorConfigProvider");
  }

  return context;
};
