import { NextRequest, NextResponse } from "next/server";
import { setLocaleCookieEdge } from "@/adapters/next/middleware/utils/set-locale-cookie-edge";
import { setPathnameHeader } from "@/adapters/next/middleware/utils/set-pathname-header";
import { localizePathname } from "@/adapters/next/shared/utils/localize-pathname";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";

type CreateResponseOptions = {
  request: NextRequest;
  config: IntorResolvedConfig;
  locale?: string;
  responseType?: "next" | "redirect";
  setCookieOptions?: { override?: boolean };
};

/**
 * Create a Next.js response with locale handling.
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
  if (responseType === "redirect") {
    response = NextResponse.redirect(url);
  } else {
    response = NextResponse.next();
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
