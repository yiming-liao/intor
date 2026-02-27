import type { GenConfigKeys, GenLocale } from "../../core";
import { useRouter as useNextRouter, usePathname } from "next/navigation";
import { executeNavigation } from "../../client";
import { useIntorContext } from "../../client/react"; // NOTE: Internal imports are rewritten to `intor/react/internal` via Rollup alias at build time.
import { resolveOutbound, type OutboundResult } from "../../routing";

type NextRouter = ReturnType<typeof useNextRouter>;
type PushOptions = Parameters<NextRouter["push"]>[1];
type ReplaceOptions = Parameters<NextRouter["replace"]>[1];
type PrefetchOptions = Parameters<NextRouter["prefetch"]>[1];

/**
 * Locale-aware router hook for the current execution context.
 *
 * - Resolves a locale-aware navigation destination.
 * - Commits locale changes only on actual navigation.
 * - Keeps routing logic pure and side-effects explicit.
 *
 * @public
 */
export function useRouter() {
  const { config, locale: currentLocale, setLocale } = useIntorContext();
  const currentPathname = usePathname();
  const nextRouter = useNextRouter();

  function resolve(href: string, locale?: string) {
    return resolveOutbound(config, currentLocale, currentPathname, {
      destination: href,
      ...(locale !== undefined ? { locale } : {}),
    });
  }

  function execute(outboundResult: OutboundResult) {
    executeNavigation(outboundResult, { config, currentLocale, setLocale });
  }

  // --------------------------------------------------
  // push
  // --------------------------------------------------
  function push<CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: PushOptions & { locale?: GenLocale<CK> },
  ) {
    const outboundResult = resolve(href, options?.locale);
    execute(outboundResult);
    if (!options) {
      nextRouter.push(outboundResult.destination);
      return;
    }
    const { locale: _, ...rest } = options;
    nextRouter.push(outboundResult.destination, rest);
  }

  // --------------------------------------------------
  // replace
  // --------------------------------------------------
  function replace<CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: ReplaceOptions & { locale?: GenLocale<CK> },
  ) {
    const outboundResult = resolve(href, options?.locale);
    execute(outboundResult);
    if (!options) {
      nextRouter.replace(outboundResult.destination);
      return;
    }
    const { locale: _, ...rest } = options;
    nextRouter.replace(outboundResult.destination, rest);
  }

  // --------------------------------------------------
  // prefetch (NO side effects)
  // --------------------------------------------------
  function prefetch<CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: PrefetchOptions & { locale?: GenLocale<CK> },
  ) {
    const outboundResult = resolve(href, options?.locale);
    if (outboundResult.kind !== "client") return;
    if (!options) {
      nextRouter.prefetch(outboundResult.destination);
      return;
    }
    const { locale: _, ...rest } = options;
    nextRouter.prefetch(outboundResult.destination, rest);
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
