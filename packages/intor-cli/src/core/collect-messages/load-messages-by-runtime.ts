import type { IntorResolvedConfig, MessagesReaders } from "intor";
import type { LocaleMessages } from "intor-translator";
import { loadMessages, resolveLoaderOptions } from "intor/internal";

interface LoadMessagesByRuntimeCtx {
  config: IntorResolvedConfig;
  locale: string;
  readers: MessagesReaders;
}

/**
 * Load runtime messages for a specific runtime context.
 */
export async function loadMessagesByRuntime(
  runtime: "server" | "client",
  { config, locale, readers }: LoadMessagesByRuntimeCtx,
): Promise<LocaleMessages | undefined> {
  // ----------------------------------------------------------------------
  // Check runtime loader availability
  // ----------------------------------------------------------------------
  const hasLoader =
    runtime === "server"
      ? Boolean(config.loader || config.server?.loader)
      : Boolean(config.client?.loader);

  if (!hasLoader) return undefined;

  // ----------------------------------------------------------------------
  // Resolve runtime loader options
  // ----------------------------------------------------------------------
  const resolvedLoader = resolveLoaderOptions(config, runtime);
  if (!resolvedLoader) return undefined;

  // ----------------------------------------------------------------------
  // Load runtime messages
  // ----------------------------------------------------------------------
  return await loadMessages({
    config: { ...config, loader: resolvedLoader },
    locale,
    readers,
    fetch: globalThis.fetch,
  });
}
