import type { HandlerContext } from "../types";
import type { TranslateContext } from "../types/context";

/**
 * Create an immutable context object exposed to external handlers.
 *
 * The returned object is frozen to prevent handlers from
 * mutating internal translator state.
 */
export function makeHandlerContext(ctx: TranslateContext): HandlerContext {
  return Object.freeze({
    config: ctx.config,

    messages: ctx.messages,
    locale: ctx.locale,
    ...(ctx.isLoading !== undefined && { isLoading: ctx.isLoading }),

    key: ctx.key,
    ...(ctx.replacements !== undefined && { replacements: ctx.replacements }),

    candidateLocales: ctx.candidateLocales,
    ...(ctx.rawMessage !== undefined && { rawMessage: ctx.rawMessage }),

    ...(ctx.formattedMessage !== undefined && {
      formattedMessage: ctx.formattedMessage,
    }),

    meta: ctx.meta,
  });
}
