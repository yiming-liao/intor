import type { TranslateContext } from "./context";
import type { MessageValue } from "../../types";
import type { RuraHookSync } from "rura";

/**
 * Synchronous hook executed in the translation pipeline.
 *
 * May mutate context or short-circuit execution.
 *
 * @public
 */
export type TranslateHook = RuraHookSync<TranslateContext, MessageValue>;
