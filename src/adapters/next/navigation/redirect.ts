import { redirect as nextRedirect, RedirectType } from "next/navigation";
import { getI18nContext } from "@/adapters/next/server";
import { localizePathname } from "@/adapters/next/shared/utils/localize-pathname";
import { IntorResolvedConfig } from "@/modules/config";
import { GenLocale } from "@/shared/types/generated.types";

/**
 * redirect utility.
 *
 * - Wraps Next.js redirect and applies locale-aware navigation.
 * - Automatically prefixes the pathname with the correct locale.
 * - External URLs are redirected directly without modification.
 */
export const redirect = async ({
  config,
  locale,
  url,
  type,
}: {
  config: IntorResolvedConfig;
  locale?: GenLocale;
  url: string;
  type?: RedirectType | undefined;
}) => {
  if (url.startsWith("http")) {
    nextRedirect(url);
  }

  const isLocaleValid = locale && config.supportedLocales?.includes(locale);
  const { locale: detectedLocale } = await getI18nContext(config);

  // Generate the locale-prefixed pathname
  const { localePrefixedPathname } = localizePathname({
    config,
    pathname: url,
    locale: isLocaleValid ? locale : detectedLocale,
  });

  nextRedirect(localePrefixedPathname, type);
};
