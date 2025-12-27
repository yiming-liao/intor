"use client";

import type { IntorResolvedConfig } from "@/config";
import type { Locale, LocaleMessages } from "intor-translator";
import * as React from "react";
import {
  createRefetchMessages,
  type RefetchMessagesFn,
} from "@/client/shared/utils/create-refetch-messages";

export interface MessagesEffectsProps {
  config: IntorResolvedConfig;
  setRuntimeMessages: React.Dispatch<
    React.SetStateAction<LocaleMessages | null>
  >;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  locale: Locale;
}

export function MessagesEffects({
  config,
  locale,
  setRuntimeMessages,
  setIsLoading,
}: MessagesEffectsProps): null {
  const isInitialRenderRef = React.useRef(true);

  // Prepares message refetch function.
  const refetchMessages: RefetchMessagesFn = React.useMemo(
    () =>
      createRefetchMessages({
        config,
        onLoadingStart: () => setIsLoading(true),
        onLoadingEnd: () => setIsLoading(false),
        onMessages: setRuntimeMessages,
      }),
    [config, setRuntimeMessages, setIsLoading],
  );

  // Refetch messages when locale changes (except initial render).
  React.useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }
    refetchMessages(locale);
  }, [refetchMessages, locale]);

  return null;
}
