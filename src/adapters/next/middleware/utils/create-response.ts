import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { setLocaleCookieEdge } from "@/adapters/next/middleware/utils/set-locale-cookie-edge";
import { setPathnameHeader } from "@/adapters/next/middleware/utils/set-pathname-header";
import { localizePathname } from "@/adapters/next/shared/utils/localize-pathname";

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
export const createResponse = <
  Req extends NextRequest = NextRequest,
  Res extends NextResponse = NextResponse,
>({
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
  const { localePrefixedPathname } = localizePathname({
    config,
    pathname: url.pathname,
    locale,
  });
  url.pathname = localePrefixedPathname;

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

  // Set pathname header
  const finalResponse = setPathnameHeader<Req, Res>({
    request,
    response: response as Res,
  });
  return finalResponse;
};
