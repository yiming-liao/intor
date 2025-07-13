import { LoaderOptions } from "@/modules/intor-config/types/loader-options-types";

export const shouldUseFullReload = (loaderOptions?: LoaderOptions): boolean => {
  return (
    loaderOptions?.type === "import" ||
    (loaderOptions?.type === "api" && loaderOptions.fullReload === true)
  );
};
