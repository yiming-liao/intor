"use client";

import type { GenConfigKeys, GenLocale } from "@/shared/types/generated";
import type { Url } from "next/dist/shared/lib/router/router";
import type { LinkProps as NextLinkProps } from "next/link";
import { formatUrl } from "next/dist/shared/lib/router/utils/format-url";
import NextLink from "next/link";
import * as React from "react";
import { usePathname } from "@/adapters/next/navigation/use-pathname";
// NOTE: Internal context imports.
// Rewritten to `intor/react` by Rollup alias at build time.
// Do not change these paths without updating the alias config.
import { useNavigationTarget, useNavigationStrategy } from "@/client/react";

interface LinkProps<CK extends GenConfigKeys = "__default__">
  extends Omit<NextLinkProps, "href">,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href?: Url;
  /**
   * Locale to navigate with.
   *
   * If `href` is omitted, the current route is used as the navigation target.
   */
  locale?: GenLocale<CK>;
}

/**
 * Locale-aware Link component.
 *
 * Wraps Next.js `Link`
 *
 * - Resolves a locale-aware navigation destination
 * - Preserves external navigation behavior
 * - Switches locale via client state or full reload when required
 *
 * This component is responsible only for executing the resolved target.
 */
export const Link = <CK extends GenConfigKeys = "__default__">({
  href,
  locale,
  children,
  onClick,
  ...props
}: LinkProps<CK>): React.JSX.Element => {
  const { localizedPathname } = usePathname();
  const { resolveNavigation } = useNavigationTarget(localizedPathname);
  const { decideNavigation } = useNavigationStrategy();

  // Normalize Next.js href input into a string destination
  const rawDestination =
    typeof href === "string" ? href : href ? formatUrl(href) : undefined;

  // Resolve navigation target
  const target = resolveNavigation({ destination: rawDestination, locale });

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Decide how this navigation should be executed
    const { kind } = decideNavigation(target);
    if (kind === "reload") {
      e.preventDefault(); // prevent client-side navigation
      globalThis.location.href = target.destination;
      return;
    }
  };

  return (
    <NextLink href={target.destination} onClick={handleClick} {...props}>
      {children}
    </NextLink>
  );
};
