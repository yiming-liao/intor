import type { NextRequest, NextResponse } from "next/server";
import { PATHNAME_HEADER_NAME } from "@/adapters/next/shared/constants/pathname-header-name";

interface SetPathnameHeaderOptions<
  Req extends NextRequest = NextRequest,
  Res extends NextResponse = NextResponse,
> {
  request: Req;
  response: Res;
  key?: string;
}

/**
 * Set the pathname in the response header.
 * - For Next.js edge middleware.
 */
export const setPathnameHeader = <
  Req extends NextRequest = NextRequest,
  Res extends NextResponse = NextResponse,
>({
  request,
  response,
  key = PATHNAME_HEADER_NAME,
}: SetPathnameHeaderOptions<Req, Res>): Response => {
  const pathname = request.nextUrl.pathname;
  response.headers.set(key, pathname);
  return response;
};
