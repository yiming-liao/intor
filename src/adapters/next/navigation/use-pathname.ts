import { usePathname as useNextPathname } from "next/navigation";
import { useConfig } from "@/adapters/next/contexts/config";
import { useLocale } from "@/adapters/next/contexts/locale";
import { localizePathname } from "@/adapters/next/shared/utils/localize-pathname";

/**
 * Custom hook to get the current pathname in different forms based on the active locale.
 *
 * This hook wraps Next.js `usePathname` and processes the pathname according to the app's
 * locale configuration.
 *
 * @example
 * const { localizedPathname, standardizedPathname, unprefixedPathname } = usePathname();
 * console.log(localizedPathname); // e.g. "/en/about"
 * console.log(standardizedPathname); // e.g. "/{locale}/about"
 * console.log(unprefixedPathname); // e.g. "/about"
 */
export const usePathname = (): {
  localizedPathname: string;
  standardizedPathname: string;
  unprefixedPathname: string;
} => {
  const { config } = useConfig();
  const { locale } = useLocale();

  // Get the raw pathname from the Next.js usePathname hook
  const rawPathname = useNextPathname();

  // Generate the locale-prefixed pathname
  const { localePrefixedPathname, standardizedPathname, unprefixedPathname } =
    localizePathname({
      config,
      pathname: rawPathname,
      locale,
    });

  return {
    localizedPathname: localePrefixedPathname,
    standardizedPathname,
    unprefixedPathname,
  };
};
