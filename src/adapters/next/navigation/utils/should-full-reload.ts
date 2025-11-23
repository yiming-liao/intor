import type { IntorResolvedConfig } from "@/config";
import { extractPathname } from "@/shared/utils";

export const shouldFullReload = ({
  config,
  targetPathname,
  locale,
  currentLocale,
}: {
  config: IntorResolvedConfig;
  targetPathname: string;
  locale?: string;
  currentLocale: string;
}): boolean => {
  const loader = config.loader;
  if (!loader || !loader.type) return false;
  if (loader.type === "remote" && !loader.fullReload) return false;

  const { maybeLocale, isLocalePrefixed } = extractPathname({
    config,
    pathname: targetPathname,
  });

  const isDifferentLocale =
    (locale && locale !== currentLocale) ||
    (isLocalePrefixed && maybeLocale !== currentLocale);

  return isDifferentLocale ? true : false;
};
