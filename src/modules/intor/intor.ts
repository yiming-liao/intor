import { logry } from "logry";
import { IntorOptions, IntorResult } from "@/modules/intor/intor-types";
import { IntorError, IntorErrorCode } from "@/modules/intor-error";
import { intorRuntime } from "@/modules/intor-runtime";

/**
 * Entry point for initializing Intor (the i18n system )
 * Determines runtime context and returns a translator or runtime object based on adapter
 */
export const intor = async ({
  request,
  config,
}: IntorOptions): Promise<IntorResult> => {
  const logger = logry({ id: config.id, scope: "intor" });
  logger.info("Starting Intor initialization:", {
    adapter: config.adapter,
  });

  // Intor runtime
  const runtime = await intorRuntime({ config, request });

  /* ▼ Adapters */
  switch (config.adapter) {
    case "next-server": {
      return runtime;
    }

    case "next-client": {
      return runtime;
    }

    default: {
      logger.error("Unsupported adapter:", { adapter: config.adapter });
      throw new IntorError({
        id: config.id,
        code: IntorErrorCode.UNSUPPORTED_ADAPTER,
        message: `Unsupported adapter: ${config.adapter}`,
      });
    }
  }
};
