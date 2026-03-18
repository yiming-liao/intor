import type { InferredShapes } from "../../../core";
import type { MessageObject } from "intor";
import { collectMissingMessages } from "./collect-missing-messages";
import { collectMissingReplacements } from "./collect-missing-replacements";
import { collectMissingRich } from "./collect-missing-rich";

export interface MissingRequirements {
  missingMessages: string[];
  missingReplacements: Array<{ key: string; name: string }>;
  missingRich: Array<{ key: string; tag: string }>;
}

/**
 * Collect missing translation requirements by comparing
 * inferred semantic schemas with locale messages.
 */
export function collectMissingRequirements(
  schemas: InferredShapes,
  localeMessages: MessageObject,
): MissingRequirements {
  const missingRequirements: MissingRequirements = {
    missingMessages: [],
    missingReplacements: [],
    missingRich: [],
  };

  collectMissingMessages(
    schemas.messages,
    localeMessages,
    "",
    missingRequirements,
  );

  collectMissingReplacements(
    schemas.replacements,
    localeMessages,
    "",
    missingRequirements,
  );

  collectMissingRich(schemas.rich, localeMessages, "", missingRequirements);

  return missingRequirements;
}
