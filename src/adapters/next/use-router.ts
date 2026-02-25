import type { GenConfigKeys, GenLocale } from "../../core";
import type {
  NavigateOptions,
  PrefetchOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter as useNextRouter, usePathname } from "next/navigation";
import { executeNavigation } from "../../client";
import { useIntorContext } from "../../client/react"; // NOTE: Internal imports are rewritten to `intor/react` via Rollup alias at build time.
import { resolveOutbound } from "../../routing";

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
    const { locale } = options ?? {};
    const outboundResult = resolveOutbound(
      config,
      currentLocale,
      currentPathname,
      { destination: href, ...(locale !== undefined ? { locale } : {}) },
    );
    executeNavigation(outboundResult, { config, currentLocale, setLocale });
    nextRouterPush(outboundResult.destination, options);
  };

  // --------------------------------------------------
  // replace
  // --------------------------------------------------
  const replace = <CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: NavigateOptions & { locale?: GenLocale<CK> },
  ) => {
    const { locale } = options ?? {};
    const outboundResult = resolveOutbound(
      config,
      currentLocale,
      currentPathname,
      { destination: href, ...(locale !== undefined ? { locale } : {}) },
    );
    executeNavigation(outboundResult, { config, currentLocale, setLocale });
    nextRouterReplace(outboundResult.destination, options);
  };

  // --------------------------------------------------
  // prefetch
  // --------------------------------------------------
  const prefetch = <CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: PrefetchOptions & { locale?: GenLocale<CK> },
  ) => {
    const { locale } = options ?? {};
    const { kind, destination } = resolveOutbound(
      config,
      currentLocale,
      currentPathname,
      { destination: href, ...(locale !== undefined ? { locale } : {}) },
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
