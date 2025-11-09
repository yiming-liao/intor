"use client";

import * as React from "react";
import { setLocaleCookieClient } from "@/adapters/next/utils/set-locale-cookie-client";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";

/**
 * Init locale cookie
 */
export const useInitLocaleCookie = ({
  config,
  locale,
}: {
  config: IntorResolvedConfig;
  locale: string;
}) => {
  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const { cookie, routing } = config;
    const { firstVisit } = routing;

    const cookies = document.cookie.split(";").map((c) => c.trim());
    const isCookieExists = cookies.some((c) => c.startsWith(`${cookie.name}=`));

    // Cookie already exists
    if (isCookieExists) return;

    // If first visit is not using redirect, do not set cookie
    if (!firstVisit.redirect) return;

    // Cookie is disabled or autoSetCookie is disabled
    if (cookie.disabled || !cookie.autoSetCookie) return;

    setLocaleCookieClient({ cookie, locale });
  }, []); // Mount only once
};
