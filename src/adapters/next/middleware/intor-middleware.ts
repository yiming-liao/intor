import type { NextRequest } from "next/server";
import { handlePrefixAll } from "@/adapters/next/middleware/handle-prefix/handle-prefix-all";
import { handlePrefixExceptDefault } from "@/adapters/next/middleware/handle-prefix/handle-prefix-except-default";
import { handlePrefixNone } from "@/adapters/next/middleware/handle-prefix/handle-prefix-none";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";

export interface IntorMiddlewareParams<Req extends NextRequest = NextRequest> {
  request: Req;
  config: IntorResolvedConfig;
}

/**
 * Handle locale routing based on prefix config
 */
export async function intorMiddleware<Req extends NextRequest = NextRequest>({
  request,
  config,
}: IntorMiddlewareParams<Req>) {
  const { prefix } = config.routing;

  // ===== Prefix: none =====
  if (prefix === "none") {
    return handlePrefixNone<Req>({ request, config });
  }

  // ===== Prefix: except-default =====
  if (prefix === "except-default") {
    return await handlePrefixExceptDefault<Req>({ request, config });
  }

  // ===== Prefix: all =====
  return await handlePrefixAll<Req>({ request, config });
}
