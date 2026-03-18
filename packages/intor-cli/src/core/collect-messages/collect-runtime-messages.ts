import type {
  ReaderOptions,
  CollectRuntimeMessagesResult,
  MergeOverrides,
} from "./types";
import type { LocaleMessages } from "intor";
import {
  mergeMessages,
  type IntorResolvedConfig,
  type MessagesReaders,
} from "intor";
import { resolveLoaderOptions } from "intor/internal";
import { loadMessages } from "intor/internal";
import { getBuiltInReaders } from "../collect-messages/readers";
import { resolveMessagesReader } from "./resolve-messages-reader";

/**
 * Collect runtime messages for a given locale.
 *
 * Precedence: client-side runtime > server-side runtime > static messages.
 */
export async function collectRuntimeMessages(
  config: IntorResolvedConfig,
  locale: string,
  { exts = [], customReaders }: ReaderOptions,
): Promise<CollectRuntimeMessagesResult> {
  // ----------------------------------------------------------------------
  // Resolve readers
  // ----------------------------------------------------------------------
  // Resolve optional custom readers
  const resolvedCustomReaders: MessagesReaders = {};
  for (const [ext, filePath] of Object.entries(customReaders || {})) {
    const resolved = await resolveMessagesReader(filePath);
    if (resolved) resolvedCustomReaders[ext] = resolved;
  }
  const readers = { ...getBuiltInReaders(exts), ...resolvedCustomReaders };

  // ----------------------------------------------------------------------
  // Load runtime messages
  // ----------------------------------------------------------------------
  let serverMessages: LocaleMessages | undefined;
  let clientMessages: LocaleMessages | undefined;
  const overrides: MergeOverrides[] = [];

  // Load server-side runtime messages
  if (config.loader || config.server?.loader) {
    const serverLoader = resolveLoaderOptions(config, "server");
    if (serverLoader) {
      serverMessages = await loadMessages({
        config: { ...config, loader: serverLoader },
        locale,
        readers,
        fetch: globalThis.fetch,
      });
    }
  }

  // Load client-side runtime messages
  if (config.client?.loader) {
    const clientLoader = resolveLoaderOptions(config, "client");
    if (clientLoader) {
      clientMessages = await loadMessages({
        config: { ...config, loader: clientLoader },
        locale,
        readers,
        fetch: globalThis.fetch,
      });
    }
  }

  // ----------------------------------------------------------------------
  // Merge messages
  // ----------------------------------------------------------------------
  // client-side runtime > server-side runtime
  const runtimeMessages = mergeMessages(serverMessages, clientMessages, {
    config,
    locale,
    onEvent: (event) => {
      overrides.push({
        ...event,
        layer: "clientOverServer",
        locale,
        configId: config.id,
      });
    },
  });

  // runtime messages > static messages
  const messages = mergeMessages(config.messages, runtimeMessages, {
    config,
    locale,
    onEvent: (event) => {
      overrides.push({
        ...event,
        layer: "runtimeOverStatic",
        locale,
        configId: config.id,
      });
    },
  });

  return { messages, overrides };
}
