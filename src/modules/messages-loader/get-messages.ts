import { messagesLoader } from "@/modules/messages-loader";
import {
  MessagesLoaderOptions,
  MessagesLoaderResult,
} from "@/modules/messages-loader/types";
import { getGlobalMessagesPool } from "@/shared/messages/global-messages-pool";
import { resolveNamespaces } from "@/shared/utils/resolve-namespaces";

export async function getMessages(
  options: MessagesLoaderOptions,
): Promise<MessagesLoaderResult> {
  const { config, locale, pathname } = options;

  if (!config.cache.enabled) {
    return await messagesLoader(options);
  }

  const pool = getGlobalMessagesPool();

  const namespaces = resolveNamespaces({ config, pathname }); // Resolve namespaces with pathname
  const key = `${config.id}|${locale}|${[...namespaces].sort().join(",")}`;

  const cached = await pool.get(key);
  if (cached) return cached;

  const messages = await messagesLoader(options);
  await pool.set(key, messages, config.cache.ttl);

  return messages;
}
