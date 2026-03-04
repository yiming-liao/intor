import type {
  Locale,
  LocaleMessages,
  Replacement,
  Rich,
} from "intor-translator";
import "./generated-registry";

/* ============================================================
 * Generated-aware type system
 * ============================================================ */

/**
 * Sentinel key injected by CLI when generated types exist.
 *
 * @public
 */
export type INTOR_GENERATED_KEY = "__intor_generated__";

/**
 * Detect generation mode.
 *
 * This works in both source and declaration emit environments.
 *
 * @public
 */
export type HasGen = INTOR_GENERATED_KEY extends keyof IntorGeneratedTypes
  ? true
  : false;

/**
 * Extract concrete generated config keys safely.
 *
 * - Works even if IntorGeneratedTypes is empty.
 * - Prevents keyof widening issues.
 *
 * @public
 */
export type GeneratedConfigKeys = HasGen extends true
  ? Exclude<keyof IntorGeneratedTypes, INTOR_GENERATED_KEY>
  : never;

/**
 * Public config key union.
 *
 * - Never resolves to `never`.
 * - Falls back to `string` safely.
 *
 * @public
 */
export type GenConfigKeys = HasGen extends true
  ? [GeneratedConfigKeys] extends [never]
    ? string
    : GeneratedConfigKeys
  : string;

/**
 * Fallback configuration shape (non-generated mode).
 *
 * @public
 */
export type FallbackConfig = {
  Locales: Locale;
  Messages: LocaleMessages;
  Replacements: Replacement;
  Rich: Rich;
};

/**
 * Safely extract generated config structure.
 *
 * - Never leaks `never` to public API.
 * - Handles malformed generated types defensively.
 *
 * @public
 */
export type SafeExtract<T> = T extends {
  Locales: infer L extends string;
  Messages: Record<"{locale}", infer M extends LocaleMessages[string]>;
  Replacements: infer RE;
  Rich: infer RI;
}
  ? {
      Locales: L;
      Messages: Record<L, M>;
      Replacements: RE;
      Rich: RI;
    }
  : FallbackConfig;

/**
 * Main configuration resolver.
 *
 * - Never returns `never`.
 * - Fully declaration-safe.
 * - Stable under generic distribution.
 *
 * @public
 */
export type GenConfig<CK extends GenConfigKeys> = HasGen extends true
  ? CK extends GeneratedConfigKeys
    ? SafeExtract<IntorGeneratedTypes[CK]>
    : FallbackConfig
  : FallbackConfig;

/* ============================================================
 * Derived helpers
 * ============================================================ */

/** @public */
export type GenMessages<CK extends GenConfigKeys> = GenConfig<CK>["Messages"];

/** @public */
export type GenLocale<CK extends GenConfigKeys> = GenConfig<CK>["Locales"];

/** @public */
export type GenReplacements<CK extends GenConfigKeys> =
  GenConfig<CK>["Replacements"];

/** @public */
export type GenRich<CK extends GenConfigKeys> = GenConfig<CK>["Rich"];
