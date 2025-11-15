"use client";

import type { GenLocale } from "@/shared/types/generated.types";
import type { Url } from "next/dist/shared/lib/router/router";
import type { LinkProps as NextLinkProps } from "next/link";
import { formatUrl } from "next/dist/shared/lib/router/utils/format-url";
import NextLink from "next/link";
import * as React from "react";
import { useLocaleSwitch } from "@/adapters/next/navigation/utils/use-locale-switch";

interface LinkProps
  extends Omit<NextLinkProps, "href">,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href?: Url;
  locale?: GenLocale;
}

/**
 * Localized Link component
 *
 * - Wraps Next.js Link and handles locale switching.
 * - Full reload occurs only if the locale changes and requires it; otherwise updates context.
 */
export const Link = ({
  href,
  locale,
  children,
  onClick,
  ...props
}: LinkProps): React.JSX.Element => {
  const formatted =
    typeof href === "string" ? href : href ? formatUrl(href) : undefined;

  const { resolveHref, switchLocale } = useLocaleSwitch();
  const { resolvedHref } = resolveHref({ href: formatted, locale });

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    onClick?.(e);
    switchLocale({ href: formatted, locale });
  };

  return (
    <NextLink href={resolvedHref} onClick={handleClick} {...props}>
      {children}
    </NextLink>
  );
};
