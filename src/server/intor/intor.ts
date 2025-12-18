import type { IntorResolvedConfig } from "@/config";
import type {
  I18nContext,
  GetI18nContext,
  IntorResult,
} from "@/server/intor/types";
import type { MessagesReader } from "@/server/messages";
import type { GenLocale } from "@/shared/types/generated.types";
import type { LocaleMessages } from "intor-translator";
import { loadMessages } from "@/server/messages";
import { getLogger } from "@/server/shared/logger/get-logger";
import { deepMerge } from "@/shared/utils";

/**
 * Entry point for initializing Intor.
 *
 * - Resolve i18n context from a resolver function or a static context object
 * - Load messages if loader is enabled.
 */

export const intor = async (
  config: IntorResolvedConfig,
  i18nContext: GetI18nContext | Partial<I18nContext>,
  loadMessagesOptions: {
    exts?: string[];
    messagesReader?: MessagesReader;
  } = {},
): Promise<IntorResult> => {
  const baseLogger = getLogger({ id: config.id, ...config.logger });
  const logger = baseLogger.child({ scope: "intor" });
  logger.info("Start Intor initialization.");

  // Resolve i18n context
  const isI18nContextFunction = typeof i18nContext === "function";
  const context = isI18nContextFunction
    ? await i18nContext(config)
    : {
        locale: (i18nContext?.locale || config.defaultLocale) as GenLocale,
        pathname: i18nContext?.pathname || "",
      };
  const { locale, pathname } = context;
  const source = isI18nContextFunction ? i18nContext.name : "static context";
  logger.debug(`I18n context resolved via "${source}".`, context as object);

  // Load messages
  let loadedMessages: LocaleMessages | undefined;
  if (config.loader) {
    loadedMessages = await loadMessages({
      config,
      locale,
      pathname,
      extraOptions: {
        exts: loadMessagesOptions.exts,
        messagesReader: loadMessagesOptions.messagesReader,
      },
      allowCacheWrite: true,
    });
  }

  logger.info("Intor initialized.");
  return {
    config,
    initialLocale: locale,
    pathname,
    messages: deepMerge(config.messages, loadedMessages) || {},
  };
};
