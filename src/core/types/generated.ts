import type { LOCALE_PLACEHOLDER } from "../constants";
import type {
  Locale,
  LocaleMessages,
  Replacement,
  Rich,
} from "intor-translator";

/**
 * =================================================
 * Generated-aware type system for Intor
 * =================================================
 */

/**
 * Sentinel key injected by CLI when generated types exist.
 * Used purely for type-level generation detection.
 */
export type INTOR_GENERATED_KEY = "__intor_generated__";

/**
 * Detect whether generated types are present.
 */
type HasGenerated = IntorGeneratedTypes extends {
  [K in INTOR_GENERATED_KEY]: true;
}
  ? true
  : false;

/**
 * Extract valid configuration keys from generated types.
 * (Excludes sentinel key.)
 */
type GeneratedConfigKeys = Exclude<
  keyof IntorGeneratedTypes,
  INTOR_GENERATED_KEY
>;

/**
 * Public configuration key union.
 * Falls back to `string` in non-generated mode.
 */
export type GenConfigKeys = HasGenerated extends true
  ? GeneratedConfigKeys
  : string;

/**
 * Fallback configuration shape (non-generated mode).
 */
type FallbackConfig = {
  Locales: Locale;
  Messages: LocaleMessages;
  Replacements: Replacement;
  Rich: Rich;
};

/**
 * Extract generated configuration shape safely.
 */
type ExtractGeneratedConfig<T> = T extends {
  Locales: infer L extends string;
  Messages: Record<typeof LOCALE_PLACEHOLDER, infer M>;
  Replacements: infer RE;
  Rich: infer RI;
}
  ? {
      Locales: L;
      Messages: Record<L, M>;
      Replacements: RE;
      Rich: RI;
    }
  : never;

/**
 * Configuration shape resolver.
 *
 * - Uses generated types when available.
 * - Falls back to default shape otherwise.
 */
export type GenConfig<CK extends GenConfigKeys> = HasGenerated extends true
  ? CK extends GeneratedConfigKeys
    ? ExtractGeneratedConfig<IntorGeneratedTypes[CK]>
    : never
  : FallbackConfig;

/**
 * Derived helpers
 */

export type GenMessages<CK extends GenConfigKeys> = GenConfig<CK>["Messages"];

export type GenLocale<CK extends GenConfigKeys> = GenConfig<CK>["Locales"];

export type GenReplacements<CK extends GenConfigKeys> =
  GenConfig<CK>["Replacements"];

export type GenRich<CK extends GenConfigKeys> = GenConfig<CK>["Rich"];
