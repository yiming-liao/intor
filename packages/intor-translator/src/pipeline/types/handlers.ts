import type { TranslateContext } from "./context";
import type { MessageValue } from "../../types";

/**
 * Optional strategy overrides for specific translation stages.
 *
 * Handlers are invoked by built-in hooks to customize
 * loading, missing, or formatting behavior.
 *
 * These do not modify pipeline execution flow.
 *
 * @public
 */
export type TranslateHandlers = {
  /** Overrides behavior while translations are loading. */
  loadingHandler?: LoadingHandler;
  /** Overrides behavior when no translation can be resolved. */
  missingHandler?: MissingHandler;
  /** Overrides the formatting stage of a resolved message. */
  formatHandler?: FormatHandler;
};

/**
 * Produces a message while translations are still loading.
 *
 * @public
 */
export type LoadingHandler = (ctx: HandlerContext) => MessageValue;

/**
 * Produces a message when no translation can be resolved.
 *
 * @public
 */
export type MissingHandler = (ctx: HandlerContext) => MessageValue;

/**
 * Formats a resolved raw message before it becomes final output.
 *
 * `rawMessage` is guaranteed to be a string at this stage.
 *
 * @public
 */
export type FormatHandler = (
  ctx: HandlerContext & { rawMessage: string },
) => MessageValue;

/**
 * Readonly snapshot of the translation context exposed to handlers.
 *
 * Handlers may inspect translation state but must not mutate it.
 *
 * @public
 */
export type HandlerContext = Readonly<
  Pick<
    TranslateContext,
    "locale" | "isLoading" | "key" | "replacements" | "rawMessage" | "meta"
  >
>;
