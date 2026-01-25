import type { GenConfigKeys, GenLocale } from "@/core";
import type {
  NavigateOptions,
  PrefetchOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter as useNextRouter, usePathname } from "next/navigation";
import { executeNavigation } from "@/client";
import { useIntorContext } from "@/client/react"; // NOTE: Internal imports are rewritten to `intor/react` via Rollup alias at build time.
import { resolveNavigation } from "@/routing";

/**
 * Locale-aware router hook for the current execution context.
 *
 * - Resolves a locale-aware navigation destination.
 * - Determines whether navigation should be executed client-side or via full reload.
 *
 * @platform Next.js
 */
export const useRouter = () => {
  const { config, locale: currentLocale, setLocale } = useIntorContext();
  const currentPathname = usePathname();
  const {
    push: nextRouterPush,
    replace: nextRouterReplace,
    prefetch: nextRouterPrefetch,
    ...rest
  } = useNextRouter();

  // --------------------------------------------------
  // push
  // --------------------------------------------------
  const push = <CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: NavigateOptions & { locale?: GenLocale<CK> },
  ) => {
    const navigationResult = resolveNavigation(
      config,
      currentLocale,
      currentPathname,
      { destination: href, locale: options?.locale },
    );
    executeNavigation(navigationResult, { config, currentLocale, setLocale });
    nextRouterPush(navigationResult.destination, options);
  };

  // --------------------------------------------------
  // replace
  // --------------------------------------------------
  const replace = <CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: NavigateOptions & { locale?: GenLocale<CK> },
  ) => {
    const navigationResult = resolveNavigation(
      config,
      currentLocale,
      currentPathname,
      { destination: href, locale: options?.locale },
    );
    executeNavigation(navigationResult, { config, currentLocale, setLocale });
    nextRouterReplace(navigationResult.destination, options);
  };

  // --------------------------------------------------
  // prefetch
  // --------------------------------------------------
  const prefetch = <CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: PrefetchOptions & { locale?: GenLocale<CK> },
  ) => {
    const { kind, destination } = resolveNavigation(
      config,
      currentLocale,
      currentPathname,
      { destination: href, locale: options?.locale },
    );
    if (kind !== "client") return; // Prefetch only makes sense for client-side navigation
    nextRouterPrefetch(destination, options);
  };

  return {
    push,
    replace,
    prefetch,
    ...rest,
  };
};
