import type { GenLocale } from "@/shared/types/generated.types";
import type { Locale } from "intor-translator";
import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter as useNextRouter } from "next/navigation";
import { useLocaleSwitch } from "@/adapters/next/navigation/utils/use-locale-switch";

/**
 * useRouter hook.
 *
 * Wraps Next.js useRouter and provides push/replace methods that automatically switch locale.
 */
export const useRouter = () => {
  const { push, replace, ...rest } = useNextRouter();

  const { switchLocale } = useLocaleSwitch();

  // Push with locale
  const pushWithLocale = (
    href: string,
    options?: NavigateOptions & { locale?: GenLocale },
  ) => {
    const resolvedHref = switchLocale({ href, locale: options?.locale });
    if (resolvedHref) push(resolvedHref, options);
  };

  // Replace with locale
  const replaceWithLocale = (
    href: string,
    options?: NavigateOptions & { locale?: Locale },
  ) => {
    const resolvedHref = switchLocale({ href, locale: options?.locale });
    if (resolvedHref) replace(resolvedHref, options);
  };

  return {
    push: pushWithLocale,
    replace: replaceWithLocale,
    ...rest,
  };
};
