"use client";

import * as React from "react";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";

/**
 * Initialize loading state if using lazy load
 */
export const useInitLoadingState = (config: IntorResolvedConfig) => {
  const lazyLoad = !!config.loader?.lazyLoad;
  const [isCsr, setIsCsr] = React.useState(false);

  React.useEffect(() => {
    setIsCsr(true);
  }, []);

  const isBeforeCSRLoading = lazyLoad && !isCsr;

  return isBeforeCSRLoading;
};
