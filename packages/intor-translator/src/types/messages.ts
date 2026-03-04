/**
 * Primitive message value.
 *
 * Represents non-object primitive values in the message tree.
 *
 * @public
 */
export type MessagePrimitive = string | number | boolean | null;

/**
 * Array-based message value.
 *
 * Allows messages to be composed as ordered lists of nested `MessageValue` items.
 *
 * @public
 */
export type MessageArray = readonly MessageValue[];

/**
 * A recursive message tree object.
 *
 * Represents a node in the recursive message tree.
 *
 * @public
 */
export interface MessageObject {
  [key: string]: MessageValue;
}

/**
 * A message value in the locale message tree.
 *
 * Can be a primitive, nested object, or array.
 *
 * @public
 */
export type MessageValue = MessagePrimitive | MessageObject | MessageArray;

/**
 * A non-traversable message value.
 *
 * Leaf values represent the end of a message path.
 *
 * @public
 */
export type MessageLeaf = MessagePrimitive | MessageArray;

/**
 * Messages grouped by locale.
 * Used to structure all available messages for multiple locales.
 *
 * - The root-level keys are locale identifiers, e.g., "en" or "zh-TW".
 * - Each value is a `MessageObject`, allowing for deeply nested message objects.
 *
 * @example
 * ```ts
 * const messages: LocaleMessages = {
 *   en: {
 *     welcome: "Welcome",
 *     auth: {
 *       login: {
 *         success: "Login successful",
 *         failure: "Login failed"
 *       }
 *     }
 *   }
 * };
 * ```
 *
 * @public
 */
export type LocaleMessages = Record<string, MessageObject>;
