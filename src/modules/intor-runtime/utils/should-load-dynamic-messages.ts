import { LoaderOptions } from "@/modules/intor-config/types/loader-options-types";

/**
 * Determines whether dynamic messages should be loaded.
 *
 * - Always load if type is "import"
 * - Load if type is "api" unless it's client-side ("next-client") and lazyLoad is true
 *
 * @param loaderOptions - Dynamic message loader configuration
 * @param adapter - Current runtime adapter (e.g., "next-client")
 * @returns Whether to load dynamic messages
 */
export const shouldLoadDynamicMessages = (
  loaderOptions: LoaderOptions | undefined,
  adapter: string,
): boolean => {
  if (!loaderOptions) {
    return false;
  }

  const { type, lazyLoad } = loaderOptions;

  if (type === "import") {
    // Always load for static imports
    return true;
  }

  if (type === "api") {
    // Skip loading only when client-side + lazy
    if (adapter === "next-client" && lazyLoad) {
      return false;
    }
    return true;
  }

  // Unknown type — do not load
  return false;
};
