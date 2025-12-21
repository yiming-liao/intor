import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { setLocaleCookieEdge } from "@/adapters/next/proxy/utils/set-locale-cookie-edge";
import { localizePathname } from "@/shared/utils/routing/localize-pathname";

interface CreateResponseOptions<Req extends NextRequest = NextRequest> {
  request: Req;
  config: IntorResolvedConfig;
  locale?: string;
  responseType?: "next" | "redirect";
  setCookieOptions?: { override?: boolean };
}

/**
 * Create a Next.js response with locale handling.
 */
export const createResponse = <Req extends NextRequest = NextRequest>({
  request,
  config,
  locale,
  responseType = "next",
  setCookieOptions = { override: false },
}: CreateResponseOptions<Req>): Response => {
  const { cookie } = config;
  const { override } = setCookieOptions;
  const url = request.nextUrl.clone(); // Clone URL to avoid mutating original

  // Generate locale-prefixed pathname
  const { localizedPathname } = localizePathname({
    config,
    pathname: url.pathname,
    locale,
  });
  url.pathname = localizedPathname;

  // Create response based on the responseType
  const response =
    responseType === "redirect"
      ? NextResponse.redirect(url)
      : NextResponse.next();

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

  return response;
};
