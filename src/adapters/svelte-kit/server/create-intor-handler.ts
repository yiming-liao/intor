import type { IntorResolvedConfig } from "@/config";
import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { isSvelteKitSSG } from "@/adapters/svelte-kit/server/utils/is-svelte-kit-ssg";
import { normalizeQuery } from "@/core";
import {
  getLocaleFromAcceptLanguage,
  resolveInbound,
  type InboundContext,
  type InboundResult,
} from "@/routing";

/**
 * Resolves locale-aware routing for the current execution context.
 *
 * - Acts as the canonical routing authority within the SvelteKit request lifecycle.
 *
 * @platform SvelteKit
 */
export function createIntorHandler(config: IntorResolvedConfig): Handle {
  return async function intorHandler({ event, resolve }) {
    // Locale from Accept-Language header
    const acceptLanguage = event.request.headers.get("accept-language");
    const localeFromAcceptLanguage = getLocaleFromAcceptLanguage(
      acceptLanguage,
      config.supportedLocales,
    );

    // ----------------------------------------------------------
    // Resolve inbound routing decision (pure computation)
    // ----------------------------------------------------------
    let inboundResult: InboundResult;
    if (isSvelteKitSSG(event)) {
      inboundResult = {
        locale: event.params?.locale,
        localeSource: "path" as const,
        pathname: event.url.pathname,
        shouldRedirect: false,
      };
    } else {
      const { host, searchParams, pathname: rawPathname } = event.url;
      inboundResult = await resolveInbound(config, rawPathname, {
        host,
        query: normalizeQuery(Object.fromEntries(searchParams.entries())),
        cookie: event.cookies.get(config.cookie.name),
        detected: localeFromAcceptLanguage || config.defaultLocale,
      });
    }
    const { locale, localeSource, pathname, shouldRedirect } = inboundResult;

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
