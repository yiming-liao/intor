import type { NextRequest, NextResponse } from "next/server";
import { DEFAULT_PATHNAME_HEADER_NAME } from "@/adapters/next-client/constants/header-key-constants";

type SetPathnameHeaderOptions = {
  request: NextRequest;
  response: NextResponse;
  key?: string;
};

/**
 * Set the pathname in the response header.
 * - For Next.js edge middleware.
 * - Returns the modified response.
 */
export const setPathnameHeader = ({
  request,
  response,
  key = DEFAULT_PATHNAME_HEADER_NAME,
}: SetPathnameHeaderOptions): NextResponse => {
  const pathname = request.nextUrl.pathname;
  response.headers.set(key, pathname);

  return response;
};
