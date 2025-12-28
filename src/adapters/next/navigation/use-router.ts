import type { GenConfigKeys, GenLocale } from "@/core/types/generated";
import type {
  NavigateOptions,
  PrefetchOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter as useNextRouter } from "next/navigation";
import { usePathname } from "@/adapters/next/navigation/use-pathname";
// NOTE: Internal context imports.
// Rewritten to `intor/react` by Rollup alias at build time.
// Do not change these paths without updating the alias config.
import { useNavigationTarget, useNavigationStrategy } from "@/client/react";

/**
 * Locale-aware router hook.
 *
 * Wraps Next.js `useRouter`
 *
 * - Resolve locale-aware navigation targets
 * - Decide execution strategy (client-side vs full reload)
 * - Preserve correct behavior across navigation types
 */
export const useRouter = () => {
  const {
    push: nextRouterPush,
    replace: nextRouterReplace,
    prefetch: nextRouterPrefetch,
    ...rest
  } = useNextRouter();
  const { localizedPathname } = usePathname();
  const { resolveNavigation } = useNavigationTarget(localizedPathname);
  const { decideNavigation } = useNavigationStrategy();

  const push = <CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: NavigateOptions & { locale?: GenLocale<CK> },
  ) => {
    const { locale } = options || {};
    const target = resolveNavigation({ destination: href, locale });
    const { kind } = decideNavigation(target);
    if (kind === "reload") {
      globalThis.location.href = target.destination;
      return;
    }
    nextRouterPush(target.destination, options);
  };

  const replace = <CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: NavigateOptions & { locale?: GenLocale<CK> },
  ) => {
    const { locale } = options || {};
    const target = resolveNavigation({ destination: href, locale });
    const { kind } = decideNavigation(target);
    if (kind === "reload") {
      globalThis.location.href = target.destination;
      return;
    }
    nextRouterReplace(target.destination, options);
  };

  const prefetch = <CK extends GenConfigKeys = "__default__">(
    href: string,
    options?: PrefetchOptions & { locale?: GenLocale<CK> },
  ) => {
    const { locale } = options || {};
    const target = resolveNavigation({ destination: href, locale });
    const { kind } = decideNavigation(target);
    if (kind !== "client") return; // Prefetch only makes sense for client-side navigation
    nextRouterPrefetch(target.destination, options);
  };

  return {
    push,
    replace,
    prefetch,
    ...rest,
  };
};
