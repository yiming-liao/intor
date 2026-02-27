import type { Handle } from "@sveltejs/kit";
import type { IntorConfig } from "intor";
import { redirect } from "@sveltejs/kit";
import { normalizeQuery } from "../../core";
import {
  getLocaleFromAcceptLanguage,
  resolveInbound,
  type InboundContext,
  type InboundResult,
} from "../../routing";
import { isSvelteKitSSG } from "./utils/is-svelte-kit-ssg";

/**
 * Resolves locale-aware routing for the current execution context.
 *
 * - Acts as the canonical routing authority within the SvelteKit request lifecycle.
 *
 * @platform SvelteKit
 */
export function createIntorHandler(config: IntorConfig): Handle {
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
      const locale = event.params?.["locale"];
      if (!locale) throw new Error("Locale param is missing in SSG mode.");
      inboundResult = {
        locale,
        localeSource: "path" as const,
        pathname: event.url.pathname,
        shouldRedirect: false,
      };
    } else {
      const cookie = event.cookies.get(config.cookie.name);
      const { host, searchParams, pathname: rawPathname } = event.url;
      inboundResult = resolveInbound(config, rawPathname, {
        host,
        query: normalizeQuery(Object.fromEntries(searchParams.entries())),
        ...(cookie !== undefined ? { cookie } : {}),
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
