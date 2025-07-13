"use client";

import { TranslateHandlers } from "intor-translator";
import * as React from "react";

// Translate handlers contsxt
export const TranslateHandlersContext = React.createContext<
  TranslateHandlers | undefined
>(undefined);
