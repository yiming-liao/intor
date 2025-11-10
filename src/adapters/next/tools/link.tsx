"use client";

import type { LinkProps as NextLinkProps } from "next/link";
import * as React from "react";
import NextLink from "next/link";
import { useLocale } from "@/adapters/next/contexts/locale";
import { localizePathname } from "@/adapters/next/shared/utils/localize-pathname";
import { useConfig } from "@/adapters/next/contexts/config";
import { shouldFullReload } from "@/adapters/next/tools/utils/should-full-reload";
import { setLocaleCookieBrowser } from "@/adapters/next/shared/utils/set-locale-cookie-browser";
import { usePathname } from "@/adapters/next/tools/use-pathname";
import { formatUrl } from "next/dist/shared/lib/router/utils/format-url";
import { Url } from "next/dist/shared/lib/router/router";

interface LinkProps extends Omit<NextLinkProps, "href"> {
  href?: Url;
  locale?: string;
  children: React.ReactNode;
  onClick?: React.AnchorHTMLAttributes<HTMLAnchorElement>["onClick"];
}

/**
 * Localized Link component wrapping Next.js Link.
 *
 * If loader type is "import", triggers a full page reload by setting window.location.href.
 * Otherwise, it updates the locale in context without a reload.
 */
export const Link = ({
  href,
  locale,
  children,
  onClick,
  ...props
}: LinkProps): React.JSX.Element => {
  const { config } = useConfig();
  const { locale: currentLocale, setLocale } = useLocale();
  const targetLocale = locale || currentLocale;
  const pathname = usePathname();

  const formattedUrl = href
    ? typeof href === "string"
      ? href
      : formatUrl(href)
    : undefined;

  const { localePrefixedPathname } = localizePathname({
    config,
    pathname: formattedUrl ?? pathname,
    locale: targetLocale,
  });
  const resolvedHref = localePrefixedPathname;

  // Click handler to manage navigation and locale change
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    onClick?.(e);

    // Using dynamic import or using dynamic API with full reload enabled
    if (shouldFullReload(config.loader)) {
      setLocaleCookieBrowser({ cookie: config.cookie, locale: targetLocale });
      window.location.href = resolvedHref; // Full reload navigation
      return;
    } else {
      setLocale(targetLocale); // Update locale without full reload (static messages or API loader with client refetch)
    }
  };

  return (
    <NextLink href={resolvedHref} onClick={handleClick} {...props}>
      {children}
    </NextLink>
  );
};
