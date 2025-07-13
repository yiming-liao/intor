import type { NextRequest } from "next/server";
import { createResponse } from "@/adapters/next-client/routing/utils/create-response";
import { determineInitialLocale } from "@/adapters/next-client/routing/utils/determine-initial-locale";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";

type Params = {
  request: NextRequest;
  config: IntorResolvedConfig;
};

/**
 * Handle routing for "none" prefix.
 *
 * Checks cookie for locale. If absent,
 * determines initial locale via config.
 * Returns response with locale.
 *
 * @param {Params} params - Request and config.
 * @returns {Promise<Response>} Response with locale.
 */
export const handlePrefixNone = async ({
  request,
  config,
}: Params): Promise<Response> => {
  let locale = request.cookies.get(config.cookie.name)?.value;

  // No cookie, so is first visit
  if (!locale) {
    // Decide to use locale from browser or defaultLocale
    locale = await determineInitialLocale(config);
  }

  // ▶ Go directly (set cookie only for the first time, no override)
  return createResponse({ request, config, locale });
};
