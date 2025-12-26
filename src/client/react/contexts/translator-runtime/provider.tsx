"use client";

import type {
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import * as React from "react";
import { TranslatorRuntimeContext } from "./context";

export type TranslatorRuntimeProviderProps = {
  value: {
    handlers?: TranslateHandlers;
    plugins?: (TranslatorPlugin | TranslateHook)[];
  };
  children: React.ReactNode;
};

export const TranslatorRuntimeProvider = ({
  value: { handlers, plugins },
  children,
}: TranslatorRuntimeProviderProps) => {
  const value = React.useMemo(
    () => ({
      handlers,
      plugins,
    }),
    [handlers, plugins],
  );

  return (
    <TranslatorRuntimeContext.Provider value={value}>
      {children}
    </TranslatorRuntimeContext.Provider>
  );
};
