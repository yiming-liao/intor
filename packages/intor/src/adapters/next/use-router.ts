import type { GenConfigKeys, GenLocale } from "../../core";
import { useRouter as useNextRouter, usePathname } from "next/navigation";
import { executeNavigation } from "../../client";
import { useIntorContext } from "../../client/react"; // NOTE: Internal imports are rewritten to `intor/react/internal` via Rollup alias at build time.
import { resolveOutbound, type OutboundResult } from "../../routing";

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
    options?: Parameters<ReturnType<typeof useNextRouter>["push"]>[1] & {
      locale?: GenLocale<CK>;
    },
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
    options?: Parameters<ReturnType<typeof useNextRouter>["replace"]>[1] & {
      locale?: GenLocale<CK>;
    },
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
    options?: Parameters<ReturnType<typeof useNextRouter>["prefetch"]>[1] & {
      locale?: GenLocale<CK>;
    },
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
