import type { IntorOptions, IntorResult } from "../intor/intor-types";
import { IntorError, IntorErrorCode } from "../intor-error";
import { getOrCreateLogger } from "../intor-logger";
import { intorRuntime } from "../intor-runtime";
import { intorTranslator } from "../intor-translator";

/**
 * Entry point for initializing Intor (the i18n system )
 * Determines runtime context and returns a translator or runtime object based on adapter
 */
export const intor = async ({
  request,
  config,
  translatorHandlers,
}: IntorOptions): Promise<IntorResult> => {
  const logger = getOrCreateLogger({ id: config.id, prefix: "intor" });
  void logger.info("Starting Intor initialization:", {
    adapter: config.adapter,
  });

  // Intor runtime
  const runtime = await intorRuntime({ config, request });
  const { initialLocale, messages } = runtime;

  /* ▼ Adapters */
  switch (config.adapter) {
    case "next-server": {
      // Create a translator and return
      const translator = intorTranslator({
        locale: initialLocale,
        messages,
        fallbackLocales: config.fallbackLocales,
        loadingMessage: config.translator.loadingMessage,
        handlers: translatorHandlers,
      });
      return translator as IntorResult;
    }

    case "next-client": {
      // Return with initialized runtime result
      return runtime as IntorResult;
    }

    default: {
      void logger.error("Unsupported adapter:", { adapter: config.adapter });
      throw new IntorError({
        id: config.id,
        code: IntorErrorCode.UNSUPPORTED_ADAPTER,
        message: `Unsupported adapter: ${config.adapter}`,
      });
    }
  }
};
