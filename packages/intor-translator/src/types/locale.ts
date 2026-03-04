import type { LocaleMessages } from "./messages";

/**
 * Extracts locale keys only when M is a valid messages object.
 *
 * - When M is a concrete `LocaleMessages`,
 * the locale key will be inferred as a union of its top-level keys like `"en" | "zh-TW"`.
 * Otherwise, falls back to a generic `string`.
 *
 * - This helps retain intellisense when `messages` is provided,
 * but avoids TypeScript errors when M is left as `unknown`.
 *
 * @example
 * ```ts
 * type Locales = Locale<{
 *   en: {};
 *   fr: {};
 * }>;
 * // → "en" | "fr"
 *
 * type Locales = Locale<unknown>;
 * // → string
 * ```
 *
 * @public
 */
export type Locale<M = unknown> = M extends LocaleMessages
  ? keyof M & string
  : string;

/**
 * A map that defines fallback locales for each base locale.
 *
 * - When a message is missing for a given locale, the system will attempt to find the message
 * by falling back to the locales listed here, in the specified order.
 *
 * @example
 * ```ts
 * const fallbacks: FallbackLocalesMap = {
 *   "en-AU": ["en-GB", "en"],
 *   "zh-TW": ["zh-HK", "zh"]
 * };
 * ```
 *
 * @public
 */
export type FallbackLocalesMap<L extends string = string> = Partial<
  Record<L, L[]>
>;
