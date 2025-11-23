import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import * as React from "react";

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
