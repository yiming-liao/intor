import type { MessageValue } from "../../types";
import type { createPipeline } from "rura";
import { type TranslateContext } from "../../pipeline";

/**
 * Executes the translation pipeline and returns the resolved message.
 *
 * If a hook short-circuits the pipeline, its output is returned directly.
 * Otherwise, the pipeline must produce `finalMessage`.
 */
export function translate(
  pipeline: ReturnType<typeof createPipeline<TranslateContext, MessageValue>>,
  context: TranslateContext,
): MessageValue {
  const { ctx, early, output } = pipeline.run(context);

  if (early === true) return output;

  assertFinalMessage(ctx);

  return ctx.finalMessage;
}

/**
 * Asserts that the pipeline produced a final message.
 *
 * Throws if the pipeline contract is violated.
 */
function assertFinalMessage(
  ctx: TranslateContext,
): asserts ctx is TranslateContext & { finalMessage: MessageValue } {
  if (ctx.finalMessage === undefined) {
    throw new Error("Invariant violated: missing hook did not produce output");
  }
}
