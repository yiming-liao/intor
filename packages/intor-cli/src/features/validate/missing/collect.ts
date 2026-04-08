import type { MissingResult } from "./types";
import type { InferredShapes } from "../../../core";
import type { MessageObject } from "intor";
import { collectMissingMessages } from "./messages";
import { collectMissingReplacements } from "./replacements";
import { collectMissingRich } from "./rich";

/**
 * Collect missing translation requirements by comparing
 * inferred semantic shapes with locale messages.
 */
export function collectMissing(
  shapes: InferredShapes,
  messageObject: MessageObject,
): MissingResult {
  const result: MissingResult = {
    missingMessages: [],
    missingReplacements: [],
    missingRich: [],
  };

  // -----------------------------------------------------------------------
  // Collect missing requirements by message shape category
  // -----------------------------------------------------------------------
  collectMissingMessages(shapes.messages, messageObject, result);
  collectMissingReplacements(shapes.replacements, messageObject, result);
  collectMissingRich(shapes.rich, messageObject, result);

  return result;
}
