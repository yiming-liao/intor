import type { InferredShapes } from "./types";
import type { MessageObject } from "intor";
import { inferMessagesShape } from "./infer-messages-shape";
import { inferReplacementsShape } from "./infer-replacements-shape";
import { inferRichShape } from "./infer-rich-shape";
import { stripInternalKeys } from "./utils/strip-internal-keys";

/**
 * Infer all semantic shapes from messages.
 */
export function inferShapes(messages: MessageObject): InferredShapes {
  const inferredShapes: InferredShapes = {
    messages: inferMessagesShape(messages),
    replacements: inferReplacementsShape(messages),
    rich: inferRichShape(messages),
  };

  stripInternalKeys(inferredShapes);

  return inferredShapes;
}
