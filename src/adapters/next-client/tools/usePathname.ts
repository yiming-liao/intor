"use client";

import { usePathname as useNextPathname } from "next/navigation";
import { useIntorConfig } from "@/adapters/next-client/contexts/intor-config";
import { useIntorLocale } from "@/adapters/next-client/contexts/intor-locale";
import { localizePathname } from "@/adapters/next-client/utils/localize-pathname";

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
  const { config } = useIntorConfig();
  const { locale } = useIntorLocale();

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
