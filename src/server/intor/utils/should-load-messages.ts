import type { LoaderOptions } from "@/config/types/loader.types";

/**
 * Determines whether dynamic messages should be loaded.
 *
 * - Always load if type is "local"
 * - Load if type is "remote" unless lazyLoad is true
 */
export const shouldLoadMessages = (
  loader: LoaderOptions | undefined,
): boolean => {
  if (!loader) return false;

  const { type, lazyLoad } = loader;

  //====== type: import ======
  if (type === "local") return true;

  //====== type: remote ======
  if (lazyLoad) return false;
  return true;
};
