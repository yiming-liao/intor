import { usePathname as useNextPathname } from "next/navigation";
import { useConfig } from "@/adapters/next/contexts/config";
import { useLocale } from "@/adapters/next/contexts/locale";
import { localizePathname } from "@/adapters/next/shared/utils/localize-pathname";

/**
 * usePathname hook
 *
 * Wraps Next.js usePathname and returns the current pathname prefixed with the active locale.
 */
export const usePathname = (): string => {
  const { config } = useConfig();
  const { locale } = useLocale();

  // Get the raw pathname from the Next.js usePathname hook
  const rawPathname = useNextPathname();

  // Generate the locale-prefixed pathname
  const { localePrefixedPathname } = localizePathname({
    config,
    pathname: rawPathname,
    locale,
  });

  return localePrefixedPathname;
};
