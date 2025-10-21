"use client";

import { Locale } from "intor-translator";
import * as React from "react";
import { useIntorMessages } from "@/adapters/next-client/contexts/intor-messages";
import { LoaderOptions } from "@/modules/intor-config/types/loader-options-types";

/**
 * When lazyLoad is enabled, fetch locale messages once after mount
 */
export const useInitLazyLoad = ({
  loaderOptions,
  currentLocale,
}: {
  loaderOptions?: LoaderOptions;
  currentLocale: Locale;
}) => {
  const { refetchMessages } = useIntorMessages();

  const lazyLoad = !!loaderOptions?.lazyLoad;
  const isFirstLoadedRef = React.useRef(false);

  // Trigger refetch once if lazyLoad is TRUE
  React.useEffect(() => {
    if (lazyLoad && !isFirstLoadedRef.current) {
      void refetchMessages(currentLocale);
      isFirstLoadedRef.current = true;
    }
  }, [lazyLoad, currentLocale, refetchMessages, isFirstLoadedRef]);
};
