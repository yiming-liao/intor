import type { IntorResolvedConfig } from "@/modules/config";
import type {
  I18nContext,
  GetI18nContext,
  IntorResult,
} from "@/modules/intor/types";
import type { MessagesReader } from "@/modules/messages";
import type { GenLocale } from "@/shared/types/generated.types";
import type { LocaleMessages } from "intor-translator";
import { shouldLoadMessages } from "@/modules/intor/utils/should-load-messages";
import { loadMessages } from "@/modules/messages";
import { getLogger } from "@/shared/logger/get-logger";
import { mergeMessages } from "@/shared/utils";

/**
 * Entry point for initializing Intor.
 *
 * 1. Resolve context via adapter or fallback values.
 * 2. Load messages if loader is enabled.
 * 3. Merge static messages with loaded messages.
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

  const { messages, loader } = config;
  const isI18nContextFunction = typeof i18nContext === "function";

  // 1. Resolve context via adapter or fallback values
  const context = isI18nContextFunction
    ? await i18nContext(config)
    : {
        locale: (i18nContext?.locale || config.defaultLocale) as GenLocale,
        pathname: i18nContext?.pathname || "",
      };
  const { locale, pathname } = context;
  const source = isI18nContextFunction ? i18nContext.name : "static fallback";
  logger.debug(`I18n context resolved via ${source}.`, context as object);

  // 2. Load messages if loader enabled
  let loadedMessages: LocaleMessages | undefined;
  if (shouldLoadMessages(loader)) {
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

  // 3. Merge static and loaded messages
  const mergedMessages = mergeMessages(messages, loadedMessages);

  logger.info("Messages successfully initialized.", {
    static: { enabled: !!messages },
    loaded: {
      enabled: !!loadedMessages,
      ...(loader
        ? { loaderType: loader.type, lazyLoad: !!loader.lazyLoad }
        : null),
    },
    merged: mergedMessages,
  });

  return {
    config,
    initialLocale: locale,
    pathname,
    messages: mergedMessages,
  };
};
