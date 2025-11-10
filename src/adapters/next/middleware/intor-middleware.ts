import type { NextRequest } from "next/server";
import { handlePrefixAll } from "@/adapters/next/middleware/handle-prefix/handle-prefix-all";
import { handlePrefixExceptDefault } from "@/adapters/next/middleware/handle-prefix/handle-prefix-except-default";
import { handlePrefixNone } from "@/adapters/next/middleware/handle-prefix/handle-prefix-none";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";

interface IntorMiddlewareParams {
  request: NextRequest;
  config: IntorResolvedConfig;
}

/**
 * Handle locale routing based on prefix config
 */
export async function intorMiddleware({
  request,
  config,
}: IntorMiddlewareParams) {
  const { prefix } = config.routing;

  // ===== Prefix: none =====
  if (prefix === "none") {
    return handlePrefixNone({ request, config });
  }

  // ===== Prefix: except-default =====
  if (prefix === "except-default") {
    return await handlePrefixExceptDefault({ request, config });
  }

  // ===== Prefix: all =====
  return await handlePrefixAll({ request, config });
}
