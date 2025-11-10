import type { NextRequest, NextResponse } from "next/server";
import { PATHNAME_HEADER_NAME } from "@/adapters/next/shared/constants/pathname-header-name";

interface SetPathnameHeaderOptions {
  request: NextRequest;
  response: NextResponse;
  key?: string;
}

/**
 * Set the pathname in the response header.
 * - For Next.js edge middleware.
 */
export const setPathnameHeader = ({
  request,
  response,
  key = PATHNAME_HEADER_NAME,
}: SetPathnameHeaderOptions): NextResponse => {
  const pathname = request.nextUrl.pathname;
  response.headers.set(key, pathname);
  return response;
};
