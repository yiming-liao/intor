"use client";

import type { IntorResolvedConfig } from "../../../../config";
import type { Locale, LocaleMessages } from "intor-translator";
import * as React from "react";
import {
  createRefetchMessages,
  type RefetchMessagesFn,
} from "../../../shared/messages";

export function useMessagesEffects(
  config: IntorResolvedConfig,
  locale: Locale,
  setRuntimeMessages: React.Dispatch<
    React.SetStateAction<LocaleMessages | null>
  >,
  setInternalIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  // Prepares message refetch function.
  const refetchMessages: RefetchMessagesFn = React.useMemo(
    () =>
      createRefetchMessages({
        config,
        onLoadingStart: () => setInternalIsLoading(true),
        onLoadingEnd: () => setInternalIsLoading(false),
        onMessages: setRuntimeMessages,
      }),
    [config, setRuntimeMessages, setInternalIsLoading],
  );

  // Refetch messages when locale changes (except initial render).
  const isInitialRenderRef = React.useRef(true);
  React.useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }
    void refetchMessages(locale);
  }, [refetchMessages, locale]);
}
