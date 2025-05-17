import type {
  IntorAdapterRuntimeOptions,
  IntorAdapterRuntimeResult,
} from "./create-adapter-runtime-loader-types";
import { IntorError, IntorErrorCode } from "../../core/intor-error";
import { getOrCreateLogger } from "../../core/intor-logger";
import { loadAdapterRuntime } from "./load-adapter-runtime";

export const createAdapterRuntimeLoader = async ({
  config,
}: IntorAdapterRuntimeOptions): Promise<IntorAdapterRuntimeResult> => {
  const { id, adapter } = config;
  const logger = getOrCreateLogger({
    id: config.id,
    prefix: "createAdapterRuntimeLoader",
  });

  try {
    // Real path example: "../../adapters/next-client/runtime.ts"
    const loadedRuntime = await loadAdapterRuntime(adapter);

    if (typeof loadedRuntime.default !== "function") {
      void logger.error(
        `Adapter "${adapter}" does not export a valid runtime function.`,
      );
      throw new IntorError({
        id,
        code: IntorErrorCode.ADAPTER_RUNTIME_LOAD_FAILED,
        message: `Adapter "${adapter}" does not export a valid runtime function.`,
      });
    }

    return loadedRuntime.default as IntorAdapterRuntimeResult;
  } catch (error) {
    throw error;
  }
};
