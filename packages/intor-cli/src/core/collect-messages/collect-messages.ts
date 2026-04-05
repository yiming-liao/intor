import type {
  ReaderOptions,
  CollectMessagesResult,
  MergeOverrides,
} from "./types";
import type { IntorResolvedConfig } from "intor";
import { loadMessagesByRuntime } from "./load-messages-by-runtime";
import { mergeMessagesByLayer } from "./merge-messages-by-layer";
import { getReaders } from "./readers";

/**
 * Collect messages for a locale.
 *
 * Precedence:
 * client runtime > server runtime > static messages
 */
export async function collectMessages(
  locale: string,
  config: IntorResolvedConfig,
  readerOptions: ReaderOptions,
): Promise<CollectMessagesResult> {
  // ----------------------------------------------------------------------
  // Resolve readers
  // ----------------------------------------------------------------------
  const readers = await getReaders(readerOptions);

  // ----------------------------------------------------------------------
  // Load runtime messages
  // ----------------------------------------------------------------------
  const loadMessagesctx = { config, locale, readers };

  const serverMessages = await loadMessagesByRuntime("server", loadMessagesctx);

  const clientMessages = await loadMessagesByRuntime("client", loadMessagesctx);

  // ----------------------------------------------------------------------
  // Merge messages
  // ----------------------------------------------------------------------
  const overrides: MergeOverrides[] = [];
  const mergeMessagesCtx = { config, locale, overrides };

  const runtimeMessages = mergeMessagesByLayer(
    "clientOverServer",
    serverMessages, // base
    clientMessages, // incoming
    mergeMessagesCtx,
  );

  const messages = mergeMessagesByLayer(
    "runtimeOverStatic",
    config.messages, // base
    runtimeMessages, // incoming
    mergeMessagesCtx,
  );

  return { messages, overrides };
}
