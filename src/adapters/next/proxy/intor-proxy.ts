import type { IntorResolvedConfig } from "@/config/types/intor-config.types";
import type { NextRequest } from "next/server";
import { handlePrefixAll } from "@/adapters/next/proxy/handle-prefix/handle-prefix-all";
import { handlePrefixExceptDefault } from "@/adapters/next/proxy/handle-prefix/handle-prefix-except-default";
import { handlePrefixNone } from "@/adapters/next/proxy/handle-prefix/handle-prefix-none";

/**
 * Handle locale routing based on prefix config
 */
export async function intorProxy<Req extends NextRequest = NextRequest>(
  config: IntorResolvedConfig,
  request: Req,
) {
  const { prefix } = config.routing;

  // --- Prefix: none
  if (prefix === "none") {
    return handlePrefixNone<Req>(config, request);
  }

  // --- Prefix: except-default
  if (prefix === "except-default") {
    return await handlePrefixExceptDefault<Req>(config, request);
  }

  // --- Prefix: all
  return await handlePrefixAll<Req>(config, request);
}
