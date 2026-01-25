import type { GenConfigKeys, GenLocale } from "@/core";
import type {
  NavigateOptions,
  PrefetchOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter as useNextRouter, usePathname } from "next/navigation";
import { useResolveNavigation, useExecuteNavigation } from "@/client/react"; // NOTE: Internal imports are rewritten to `intor/react` via Rollup alias at build time.

/**
 * Locale-aware router hook for the current execution context.
 *
 * - Resolves a locale-aware navigation destination.
 * - Determines whether navigation should be executed client-side or via full reload.
 *
 * @platform Next.js
 */
export const useRouter = () => {
  const {
    push: nextRouterPush,
    replace: nextRouterReplace,
    prefetch: nextRouterPrefetch,
    ...rest
  } = useNextRouter();
  const pathname = usePathname();
  const resolveNavigation = useResolveNavigation();
  const executeNavigation = useExecuteNavigation();

  // --------------------------------------------------
  // push
  // --------------------------------------------------
  const push = <CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: NavigateOptions & { locale?: GenLocale<CK> },
  ) => {
    const navigationResult = resolveNavigation(pathname, {
      destination: href,
      locale: options?.locale,
    });
    executeNavigation(navigationResult);
    nextRouterPush(navigationResult.destination, options);
  };

  // --------------------------------------------------
  // replace
  // --------------------------------------------------
  const replace = <CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: NavigateOptions & { locale?: GenLocale<CK> },
  ) => {
    const navigationResult = resolveNavigation(pathname, {
      destination: href,
      locale: options?.locale,
    });
    executeNavigation(navigationResult);
    nextRouterReplace(navigationResult.destination, options);
  };

  // --------------------------------------------------
  // prefetch
  // --------------------------------------------------
  const prefetch = <CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: PrefetchOptions & { locale?: GenLocale<CK> },
  ) => {
    const { kind, destination } = resolveNavigation(pathname, {
      destination: href,
      locale: options?.locale,
    });
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
