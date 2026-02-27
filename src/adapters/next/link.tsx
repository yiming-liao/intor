"use client";

import type { GenConfigKeys, GenLocale } from "../../core";
import type { Url } from "next/dist/shared/lib/router/router";
import type { LinkProps as NextLinkProps } from "next/link";
import { formatUrl } from "next/dist/shared/lib/router/utils/format-url";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { executeNavigation } from "../../client";
import { useIntorContext } from "../../client/react"; // NOTE: Internal imports are rewritten to `intor/react/internal` via Rollup alias at build time.
import { resolveOutbound } from "../../routing";

type LinkProps<CK extends GenConfigKeys = "__default__"> =
  React.PropsWithChildren<
    Omit<NextLinkProps, "href"> &
      Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
        href?: Url;
        /**
         * Optional locale override for this navigation.
         *
         * When omitted, the locale is resolved from the current execution context.
         */
        locale?: GenLocale<CK>;
      }
  >;

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
}: LinkProps<CK>) => {
  const { config, locale: currentLocale, setLocale } = useIntorContext();
  const currentPathname = usePathname();

  // Normalize href into a string destination
  const rawDestination =
    typeof href === "string" ? href : href ? formatUrl(href) : undefined;

  // Resolve navigation result for this link
  const outboundResult = resolveOutbound(
    config,
    currentLocale,
    currentPathname,
    {
      ...(rawDestination !== undefined ? { destination: rawDestination } : {}),
      ...(locale !== undefined ? { locale } : {}),
    },
  );

  // --------------------------------------------------
  // Execute navigation on user interaction
  // --------------------------------------------------
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    executeNavigation(outboundResult, { config, currentLocale, setLocale }, e);
  };

  return (
    <NextLink
      href={outboundResult.destination}
      onClick={handleClick}
      {...props}
    >
      {children}
    </NextLink>
  );
};
