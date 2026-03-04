import type { IntorConfig } from "../../../config";
import type { GenConfigKeys } from "../../../core";
import type { IntorValue } from "../../../server";
import { intor as intorCore, type IntorOptions } from "intor/server";
import { getLocale } from "./get-locale";

/**
 * Initializes Intor for the current execution context.
 *
 * - Automatically resolves the locale from the framework context.
 * - Permits cache writes during server execution.
 *
 * @public
 */
export async function intor<CK extends GenConfigKeys = "__default__">(
  config: IntorConfig,
  options?: Omit<IntorOptions, "fetch">,
): Promise<IntorValue<CK>> {
  const { readers, allowCacheWrite = true } = options ?? {};

  return await intorCore(config, await getLocale(config), {
    ...(readers !== undefined ? { readers } : {}),
    allowCacheWrite,
  });
}
