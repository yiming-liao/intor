import { LoaderOptions } from "@/modules/config/types/loader.types";

/**
 * Determines whether dynamic messages should be loaded.
 *
 * - Always load if type is "import"
 * - Load if type is "api" unless lazyLoad is true
 */
export const shouldLoadMessages = (
  loader: LoaderOptions | undefined,
): boolean => {
  if (!loader) return false;

  const { type, lazyLoad } = loader;

  //====== type: import ======
  if (type === "import") return true;

  //====== type: api ======
  if (lazyLoad) return false;
  return true;
};
