import { usePathname as useNextPathname } from "next/navigation";
import { useConfig } from "@/client/react/contexts/config";
import { useLocale } from "@/client/react/contexts/locale";
import { localizePathname } from "@/shared/utils/routing/localize-pathname";

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
  unprefixedPathname: string;
  standardizedPathname: string;
  localizedPathname: string;
} => {
  const { config } = useConfig();
  const { locale } = useLocale();

  // Get the raw pathname from the Next.js usePathname hook
  const rawPathname = useNextPathname();

  // Generate the locale-prefixed pathname
  const { localizedPathname, standardizedPathname, unprefixedPathname } =
    localizePathname({
      config,
      pathname: rawPathname,
      locale,
    });

  return {
    unprefixedPathname,
    standardizedPathname,
    localizedPathname,
  };
};
