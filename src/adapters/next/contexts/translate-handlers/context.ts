import { TranslateHandlers } from "intor-translator";
import * as React from "react";

// Context
export const TranslateHandlersContext = React.createContext<
  TranslateHandlers | undefined
>(undefined);
