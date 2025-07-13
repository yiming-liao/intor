"use client";

import type { LinkProps as NextLinkProps } from "next/link";
import * as React from "react";
import NextLink from "next/link";
import { useIntorLocale } from "@/adapters/next-client/contexts/intor-locale";
import { localizePathname } from "@/adapters/next-client/utils/localize-pathname";
import { useIntorConfig } from "@/adapters/next-client/contexts/intor-config";
import { shouldUseFullReload } from "@/adapters/next-client/utils/should-use-full-reload";
import { setLocaleCookieClient } from "@/adapters/next-client/utils/set-locale-cookie-client";
import { usePathname } from "@/adapters/next-client/tools/usePathname";

type LinkProps = {
  href?: string;
  locale?: string;
  children: React.ReactNode;
  onClick?: React.AnchorHTMLAttributes<HTMLAnchorElement>["onClick"];
} & Omit<NextLinkProps, "href" | "locale" | "children"> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onClick">;

/**
 * Localized Link component wrapping Next.js Link.
 *
 * It prefixes the href with the current or given locale,
 * and handles locale switching on click depending on
 * the app's loader configuration.
 *
 * If loader type is "import", triggers a full page reload by setting window.location.href.
 * Otherwise, it updates the locale in context without a reload.
 *
 * @param {LinkProps} props - Props including href, optional locale, children and other anchor/link attributes.
 * @returns {JSX.Element} A localized link component.
 */
export const Link = ({
  href,
  locale,
  children,
  onClick,
  ...props
}: LinkProps): React.JSX.Element => {
  const { config } = useIntorConfig();
  const { locale: currentLocale, setLocale } = useIntorLocale();
  const targetLocale = locale || currentLocale;
  const pathname = usePathname();

  const { localePrefixedPathname } = localizePathname({
    config,
    pathname: href ?? pathname,
    locale: targetLocale,
  });

  href = localePrefixedPathname;

  // Click handler to manage navigation and locale change
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    onClick?.(e);

    // Using dynamic import or using dynamic API with full reload enabled
    if (shouldUseFullReload(config.loaderOptions)) {
      setLocaleCookieClient({ cookie: config.cookie, locale: targetLocale });
      window.location.href = href; // Full reload navigation
      return;
    } else {
      setLocale(targetLocale); // Update locale without full reload (static messages or API loader with client refetch)
    }
  };

  return (
    <NextLink href={href} onClick={handleClick} {...props}>
      {children}
    </NextLink>
  );
};
