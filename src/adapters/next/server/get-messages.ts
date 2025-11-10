import { nextAdapter } from "@/adapters/next/server/next-adapter";
import { IntorResolvedConfig } from "@/modules/config/types/intor-config.types";
import { getMessages as rawGetMessages } from "@/modules/messages";
import { MessagesLoaderResult } from "@/modules/messages/types";

/**
 * Retrieves messages in a Next.js SSR environment.
 * This function wraps the standard `getMessages` with the Next.js adapter,
 * automatically resolving runtime data.
 */
export const getMessages = async (
  config: IntorResolvedConfig,
): Promise<MessagesLoaderResult> => {
  const { locale, pathname } = await nextAdapter(config);
  const messages = await rawGetMessages({ config, locale, pathname });
  return messages;
};
