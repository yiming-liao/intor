import type { LoaderOptions } from "@/config/types/loader.types";
import type { Locale } from "intor-translator";
import * as React from "react";
import { useMessages } from "@/client/react/contexts/messages";

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
  const { refetchMessages } = useMessages();

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
