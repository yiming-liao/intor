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
export function useRouter() {
  const { config, locale: currentLocale, setLocale } = useIntorContext();
  const currentPathname = usePathname();
  const nextRouter = useNextRouter();

  // --------------------------------------------------
  // push
  // --------------------------------------------------
  function push<CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: NavigateOptions & { locale?: GenLocale<CK> },
  ) {
    const { locale } = options ?? {};
    const outboundResult = resolveOutbound(
      config,
      currentLocale,
      currentPathname,
      { destination: href, ...(locale !== undefined ? { locale } : {}) },
    );
    executeNavigation(outboundResult, { config, currentLocale, setLocale });
    nextRouter.push(outboundResult.destination, options);
  }

  // --------------------------------------------------
  // replace
  // --------------------------------------------------
  function replace<CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: NavigateOptions & { locale?: GenLocale<CK> },
  ) {
    const { locale } = options ?? {};
    const outboundResult = resolveOutbound(
      config,
      currentLocale,
      currentPathname,
      { destination: href, ...(locale !== undefined ? { locale } : {}) },
    );
    executeNavigation(outboundResult, { config, currentLocale, setLocale });
    nextRouter.replace(outboundResult.destination, options);
  }

  // --------------------------------------------------
  // prefetch
  // --------------------------------------------------
  function prefetch<CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: PrefetchOptions & { locale?: GenLocale<CK> },
  ) {
    const { locale } = options ?? {};
    const { kind, destination } = resolveOutbound(
      config,
      currentLocale,
      currentPathname,
      { destination: href, ...(locale !== undefined ? { locale } : {}) },
    );
    if (kind !== "client") return; // Prefetch only makes sense for client-side navigation
    nextRouter.prefetch(destination, options);
  }

  return {
    push,
    replace,
    prefetch,
    back: () => nextRouter.back(),
    forward: () => nextRouter.forward(),
    refresh: () => nextRouter.refresh(),
  };
}
