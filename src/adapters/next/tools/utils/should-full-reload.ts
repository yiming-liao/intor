import { LoaderOptions } from "@/modules/config/types/loader.types";

export const shouldFullReload = (loaderOptions?: LoaderOptions): boolean => {
  return (
    loaderOptions?.type === "import" ||
    (loaderOptions?.type === "api" && loaderOptions.fullReload === true)
  );
};
