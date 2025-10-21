"use client";

import * as React from "react";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";

/**
 * Initialize loading state if using lazy load
 */
export const useInitLoadingState = (config: IntorResolvedConfig) => {
  const lazyLoad = !!config.loaderOptions?.lazyLoad;
  const [isCsr, setIsCsr] = React.useState(false);

  React.useEffect(() => {
    setIsCsr(true);
  }, []);

  const isBeforeCSRLoading = lazyLoad && !isCsr;

  return isBeforeCSRLoading;
};
