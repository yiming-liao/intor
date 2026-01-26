/* eslint-disable unicorn/prefer-ternary */
import type { IntorResolvedConfig } from "@/config";
import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { isSvelteKitSSG } from "@/adapters/svelte-kit/server/utils/is-svelte-kit-ssg";
import { normalizeQuery } from "@/core";
import {
  getLocaleFromAcceptLanguage,
  resolveInbound,
  type InboundContext,
} from "@/routing";

/**
 * Resolves locale-aware routing for the current execution context.
 *
 * The resolved routing state is exposed via response headers.
 *
 * - Acts as the canonical routing authority within the SvelteKit request lifecycle.
 *
 * @platform SvelteKit
 */
export function createIntorHandle(config: IntorResolvedConfig): Handle {
  return async ({ event, resolve }) => {
    // Locale from Accept-Language header
    const acceptLanguage = event.request.headers.get("accept-language");
    const localeFromAcceptLanguage = getLocaleFromAcceptLanguage(
      acceptLanguage,
      config.supportedLocales,
    );

    // ----------------------------------------------------------
    // Resolve inbound routing decision (pure computation)
    // ----------------------------------------------------------
    let inbound;
    if (isSvelteKitSSG(event)) {
      inbound = {
        locale: event.params?.locale,
        localeSource: "path" as const,
        pathname: event.url.pathname,
        shouldRedirect: false,
      };
    } else {
      inbound = await resolveInbound(config, event.url.pathname, false, {
        host: event.url.host,
        query: normalizeQuery(
          Object.fromEntries(event.url.searchParams.entries()),
        ),
        cookie: event.cookies.get(config.cookie.name),
        detected: localeFromAcceptLanguage || config.defaultLocale,
      });
    }
    const { locale, localeSource, pathname, shouldRedirect } = inbound;

    // ----------------------------------------------------------
    // Redirect if needed
    // ----------------------------------------------------------
    if (shouldRedirect) redirect(307, pathname);

    // ----------------------------------------------------------
    // Bind inbound routing context
    // ----------------------------------------------------------
    // @ts-expect-error - App.Locals must be extended by user
    event.locals.intor = {
      locale,
      localeSource,
      pathname,
    } satisfies InboundContext;

    const response = await resolve(event, {
      transformPageChunk: ({ html }) => html.replace("%lang%", locale),
    });
    return response;
  };
}
