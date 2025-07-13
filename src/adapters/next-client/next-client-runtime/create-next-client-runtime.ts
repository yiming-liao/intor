import { nextClientRuntime } from "./next-client-runtime";
import { IntorAdapterRuntime } from "@/modules/intor-adapter/types";

/**
 * Standardized runtime export for Intor adapters.
 *
 * This file is used internally by the Intor runtime system
 * to load the runtime logic for this adapter.
 * Not part of the public API – do not import directly.
 */
export const createNextClientRuntime: IntorAdapterRuntime = async ({
  config,
}) => {
  return nextClientRuntime({ config });
};
