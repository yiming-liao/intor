import type { IntorResolvedConfig } from "@/config";
import type { NextRequest } from "next/server";
import { createResponse } from "@/adapters/next/middleware/utils/create-response";
import { determineInitialLocale } from "@/adapters/next/middleware/utils/determine-initial-locale";

/**
 * Handle routing for "none" prefix.
 *
 * Checks cookie for locale. If absent,
 * determines initial locale via config.
 * Returns response with locale.
 */
export const handlePrefixNone = async <Req extends NextRequest = NextRequest>(
  config: IntorResolvedConfig,
  request: Req,
): Promise<Response> => {
  let locale = request.cookies.get(config.cookie.name)?.value;

  // No cookie, so is first visit
  if (!locale) {
    // Decide to use locale from browser or defaultLocale
    locale = await determineInitialLocale(config);
  }

  // ▶ Go directly (set cookie only for the first time, no override)
  return createResponse<Req>({ request, config, locale });
};
