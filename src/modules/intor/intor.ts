import { LocaleNamespaceMessages } from "intor-translator";
import {
  AdapterRuntime,
  IntorOptions,
  IntorResult,
} from "@/modules/intor/types";
import { shouldLoadMessages } from "@/modules/intor/utils/should-load-messages";
import { getMessages } from "@/modules/messages";
import { getLogger } from "@/shared/logger/get-logger";
import { mergeMessages } from "@/shared/utils";

/**
 * Entry point for initializing Intor.
 *
 * 1. Resolve runtime via adapter or fallback values
 * 2. Load messages if loader enabled
 * 3. Merge static and loaded messages
 */
export const intor = async ({
  config,
  adapter,
  adapterRuntime,
}: IntorOptions): Promise<IntorResult> => {
  const baseLogger = getLogger({ id: config.id, ...config.logger });
  const logger = baseLogger.child({ scope: "intor" });
  logger.info("Start Intor initialization.");

  const { messages, loader } = config;

  // 1. Resolve runtime via adapter or fallback values
  let runtime: AdapterRuntime;
  if (adapter) {
    runtime = await adapter(config);
  } else {
    runtime = {
      locale: adapterRuntime?.locale || config.defaultLocale,
      pathname: adapterRuntime?.pathname || "",
    };
  }
  const { locale, pathname } = runtime;
  logger.debug("Runtime resolved via adapter/fallback", runtime as object);

  // 2. Load messages if loader enabled
  let loadedMessages: LocaleNamespaceMessages | undefined;
  if (shouldLoadMessages(loader)) {
    loadedMessages = await getMessages({ config, locale, pathname });
  }

  // 3. Merge static and loaded messages
  const mergedMessages = mergeMessages(messages, loadedMessages);

  logger.info("Messages initialized.", {
    staticMessages: { enabled: !!messages },
    loadedMessages: {
      enabled: !!loadedMessages,
      ...(loader
        ? { loaderType: loader.type, lazyLoad: !!loader.lazyLoad }
        : null),
    },
    mergedMessages,
  });

  return {
    config,
    initialLocale: locale,
    pathname,
    messages: mergedMessages,
  };
};
