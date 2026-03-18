import type { MessageObject } from "intor";

export function isMessageObject(value: unknown): value is MessageObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
