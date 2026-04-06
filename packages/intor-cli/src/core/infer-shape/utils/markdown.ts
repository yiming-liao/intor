import type { MessageObject } from "intor";
import {
  INTOR_MESSAGES_KIND,
  INTOR_MESSAGES_KIND_KEY,
  INTOR_PREFIX,
} from "intor/internal";

/**
 * Detect whether a message object contains markdown payload metadata.
 */
export function isMdContainer(value: MessageObject): boolean {
  return (
    value[INTOR_MESSAGES_KIND_KEY] === INTOR_MESSAGES_KIND.markdown &&
    typeof value["content"] === "string"
  );
}

/**
 * Remove markdown payload internals and keep only semantic sibling keys.
 */
export function omitMdPayload(value: MessageObject): MessageObject {
  return Object.fromEntries(
    Object.entries(value).filter(([key]) => {
      if (key === "content") return false;
      if (key.startsWith(INTOR_PREFIX)) return false;
      return true;
    }),
  );
}
