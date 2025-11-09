"use client";

import { usePathname as useNextPathname } from "next/navigation";
import { useConfig } from "@/adapters/next/contexts/config";
import { useLocale } from "@/adapters/next/contexts/locale";
import { localizePathname } from "@/adapters/next/utils/localize-pathname";

/**
 * Custom hook to get the localized pathname.
 *
 * It fetches the raw pathname from Next.js,
 * then prefixes it with the current locale
 * based on the app's configuration and locale context.
 *
 * @returns {string} Localized pathname with locale prefix.
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
