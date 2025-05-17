/**
 * Dynamically loads the runtime module of a specific adapter.
 *
 * - This file is located at:
 *    src/intor/core/intor-adapter/load-adapter-runtime.ts
 *
 * - Adapter runtime module convention:
 *    Each adapter must provide a `runtime.ts` file located at:
 *    src/intor/adapters/{adapter-name}/runtime.ts
 *
 * - Usage:
 *    The adapter name (e.g. "next-client") will be used to build the relative import path.
 *    This allows optional installation of adapters without bundling all of them by default.
 *
 * - Note:
 *    - This function is used internally by the Intor runtime system.
 *    - Make sure the target adapter module exists before calling this function,
 *      or handle possible dynamic import errors.
 *
 * - Example path that will be resolved:
 *    ../../adapters/next-client/runtime
 */
export const loadAdapterRuntime = async (adapter: string) => {
  return await import(`@intor/${adapter}/runtime`);
};
