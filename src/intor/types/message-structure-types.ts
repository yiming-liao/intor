// =====================================
// Basic Types
// =====================================

export type Locale = string;
export type Namespace = string;
export type Message = string;
export type Replacement = { [key: string]: string | number | Replacement };

// =====================================
// Locale and Message Types
// =====================================

/**
 * A nested message structure or a simple string message.
 */
export type NestedMessage = MessageRecord | string;

/**
 * A record of messages where keys are strings, and values can be strings or nested objects.
 */
export type MessageRecord = { [key: string]: NestedMessage };

/**
 * A record of messages grouped by namespace.
 */
export type NamespaceMessages = Record<Namespace, NestedMessage>;

/**
 * Messages grouped by locale and namespace.
 */
export type LocaleNamespaceMessages = Record<Locale, NamespaceMessages>;

/**
 * Locale keys extracted from message map.
 */
export type RawLocale<Messages extends LocaleNamespaceMessages> =
  keyof Messages & string;

/**
 * Defines which fallback locales should be used for each base locale.
 */
export type FallbackLocalesMap<Messages extends LocaleNamespaceMessages> =
  Partial<Record<RawLocale<Messages>, RawLocale<Messages>[]>>;

// =====================================
// Helpers
// =====================================

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
