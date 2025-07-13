import { LocaleNamespaceMessages } from "intor-translator";
import { logry } from "logry";
import { resolceAdapterRuntimeLoader } from "@/modules/intor-adapter/resolve-adapter-runtime-loader";
import { intorAdapters } from "@/modules/intor-config/types/intor-adapter-types";
import { IntorError, IntorErrorCode } from "@/modules/intor-error";
import { intorMessagesLoader } from "@/modules/intor-messages-loader";
import {
  IntorRuntimeOptions,
  IntorRuntimeResult,
} from "@/modules/intor-runtime/intor-runtime-types";
import { shouldLoadDynamicMessages } from "@/modules/intor-runtime/utils/should-load-dynamic-messages";
import { mergeStaticAndDynamicMessages } from "@/shared/utils/merge-static-and-dynamic-messages";

/**
 * Initializes the Intor runtime with the specified adapter and configuration.
 *
 * This function handles the complete runtime setup, including:
 *
 * 0. Initializing the logger
 * 1. Dynamically loading the adapter's runtime and executing it to get runtime context
 * 2. Loading dynamic messages via import or API (if a loader is defined)
 * 3. Merging static messages (from config) and dynamic messages (if available)
 *
 * This function returns a fully prepared runtime object,
 * including locale, pathname, and merged messages.
 */
export const intorRuntime = async ({
  request,
  config,
}: IntorRuntimeOptions): Promise<IntorRuntimeResult> => {
  const logger = logry({ id: config.id, scope: "intorRuntime" });
  const {
    messages: staticMessages, // Static messages defined from config
    loaderOptions,
    adapter,
  } = config;

  // Throw error if `adapter` is not  supported
  if (!intorAdapters.includes(adapter)) {
    logger.error("Unsupported adapter:", { adapter });
    throw new IntorError({
      id: config.id,
      code: IntorErrorCode.UNSUPPORTED_ADAPTER,
      message: `Unsupported adapter: ${adapter}`,
    });
  }

  // Dynamically load runtime function from specified adapter
  const adapterRuntime = await resolceAdapterRuntimeLoader({ config });
  const { locale, pathname } = await adapterRuntime({ config, request });

  // Log out initial locale and pathname
  logger.info("Initialized locale and pathname:", { locale, pathname });

  let dynamicMessages: LocaleNamespaceMessages | undefined;
  // Use dynamic loader
  if (shouldLoadDynamicMessages(loaderOptions, adapter)) {
    dynamicMessages = await intorMessagesLoader({ config, locale, pathname });
  }

  // Merge static and dynamic messages (Only the first level after locales)
  const messages = mergeStaticAndDynamicMessages(
    staticMessages,
    dynamicMessages,
  );

  // Log out messages
  logger.info("Loaded messages:", {
    staticMessages: {
      fromConfig: !!staticMessages,
    },
    dynamicMessages: {
      fromLoader: !!dynamicMessages,
      ...(loaderOptions
        ? {
            loaderType: loaderOptions.type,
            lazyLoad: !!loaderOptions.lazyLoad,
          }
        : null),
    },
    mergedMessages: messages,
  });

  return {
    config,
    initialLocale: locale,
    pathname,
    messages,
  };
};
