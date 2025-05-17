import type { LocaleNamespaceMessages } from "../../../types/message-structure-types";

/**
 * Locale keys extracted from message map.
 */
export type RawLocale<Messages extends LocaleNamespaceMessages> =
  keyof Messages & string;

/**
 * All possible nested key paths of an object.
 * Example: "a", "a.b", "a.b.c"
 */
export type NestedKeyPaths<Messages> = Messages extends object
  ? {
      [Key in keyof Messages]:
        | `${Key & string}`
        | `${Key & string}.${NestedKeyPaths<Messages[Key]>}`;
    }[keyof Messages]
  : never;
