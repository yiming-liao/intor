"use client";

import type { GenConfigKeys, GenLocale } from "@/core";
import type { Url } from "next/dist/shared/lib/router/router";
import type { LinkProps as NextLinkProps } from "next/link";
import { formatUrl } from "next/dist/shared/lib/router/utils/format-url";
import NextLink from "next/link";
import * as React from "react";
import { useResolveNavigation } from "@/client/react"; // NOTE: Internal imports are rewritten to `intor/react` via Rollup alias at build time.
import { usePathname } from "./use-pathname";

interface LinkProps<CK extends GenConfigKeys = "__default__">
  extends Omit<NextLinkProps, "href">,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href?: Url;

  /**
   * Optional locale override for this navigation.
   *
   * When omitted, the locale is resolved from the current execution context.
   */
  locale?: GenLocale<CK>;
}

/**
 * Render a locale-aware link for the current execution context.
 *
 * - Resolves a locale-aware navigation destination.
 * - Determines whether navigation should be executed client-side or via full reload.
 *
 * @platform Next.js
 */
export const Link = <CK extends GenConfigKeys = "__default__">({
  href,
  locale,
  children,
  onClick,
  ...props
}: LinkProps<CK>): React.JSX.Element => {
  const { pathname } = usePathname();
  const { resolveNavigation } = useResolveNavigation();

  // Normalize href into a string destination
  const rawDestination =
    typeof href === "string" ? href : href ? formatUrl(href) : undefined;

  // Resolve navigation result for this link
  const { kind, destination } = resolveNavigation(pathname, {
    destination: rawDestination,
    locale,
  });

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Decide how this navigation should be executed
    if (kind === "reload") {
      e.preventDefault(); // prevent client-side navigation
      globalThis.location.href = destination;
      return;
    }
  };

  return (
    <NextLink href={destination} onClick={handleClick} {...props}>
      {children}
    </NextLink>
  );
};
