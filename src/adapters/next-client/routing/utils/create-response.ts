import { NextRequest, NextResponse } from "next/server";
import { setLocaleCookieEdge } from "@/adapters/next-client/routing/utils/set-locale-cookie-edge";
import { setPathnameHeader } from "@/adapters/next-client/routing/utils/set-pathname-header";
import { localizePathname } from "@/adapters/next-client/utils/localize-pathname";
import { IntorResolvedConfig } from "@/modules/intor-config/types/define-intor-config-types";

type CreateResponseOptions = {
  request: NextRequest;
  config: IntorResolvedConfig;
  locale?: string;
  responseType?: "next" | "redirect";
  setCookieOptions?: { override?: boolean };
};

/**
 * Create a Next.js response with locale handling.
 *
 * @param {CreateResponseOptions} options - Options for creating the response.
 * @param {NextRequest} options.request - The incoming Next.js request object.
 * @param {IntorResolvedConfig} options.config - Localization configuration.
 * @param {string} [options.locale] - Locale to use for the response.
 * @param {"next" | "redirect"} [options.responseType="next"] - Type of response to return.
 * @param {{ override?: boolean }} [options.setCookieOptions={ override: false }] - Options for setting the locale cookie.
 *
 * @returns {NextResponse} The generated Next.js response.
 *
 * @throws {Error} Throws if an unsupported responseType is provided.
 */
export const createResponse = ({
  request,
  config,
  locale,
  responseType = "next",
  setCookieOptions = { override: false },
}: CreateResponseOptions): NextResponse => {
  const { cookie } = config;
  const { override } = setCookieOptions;
  const url = request.nextUrl.clone(); // Clone URL to avoid mutating original

  // Generate locale-prefixed pathname
  const { localePrefixedPathname } = localizePathname({
    config,
    pathname: url.pathname,
    locale,
  });
  url.pathname = localePrefixedPathname;

  let response: NextResponse;

  // Create response based on the responseType
  switch (responseType) {
    case "next": {
      response = NextResponse.next();
      break;
    }
    case "redirect": {
      response = NextResponse.redirect(url);
      break;
    }
    default: {
      throw new Error(`Unsupported responseType: ${responseType}`);
    }
  }

  // Set locale cookie if locale is provided
  if (locale) {
    setLocaleCookieEdge({
      request,
      response,
      locale,
      cookie,
      override,
    });
  }

  // Set pathname header
  const finalResponse = setPathnameHeader({ request, response });
  return finalResponse;
};
