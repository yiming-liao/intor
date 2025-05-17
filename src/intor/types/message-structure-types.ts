// =====================================
// Basic Types
// =====================================

export type Locale = string;
export type Namespace = string;
export type Message = string;
export type Replacement = { [key: string]: string | number | Replacement };

// Rich types replacement, support formatJS
export type RichPrimitive = string | number | boolean | Date;
export type RichSerializable = { toString(): string };
export type RichFormatterFunction = (chunks: string) => unknown;
export type ReplacementValue =
  | RichPrimitive
  | RichSerializable
  | RichFormatterFunction
  | null
  | undefined;
export type RichReplacement = { [key: string]: ReplacementValue | Replacement };

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
 * Defines which fallback locales should be used for each base locale.
 */
export type FallbackLocalesMap = Partial<Record<Locale, Locale[]>>;
