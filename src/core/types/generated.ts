import type { PREFIX_PLACEHOLDER } from "../constants";
import type { LocaleMessages } from "intor-translator";

/**
 * ================================================
 * Generated-aware type system for Intor.
 *
 * This module defines conditional and fallback types that adapt
 * based on whether generated types are present.
 * ================================================
 */

/**
 * Internal sentinel key indicating that Intor generated types are present.
 * - Used by conditional types to switch between fallback and generated modes.
 * - Type-level only. Not for runtime or user-facing usage.
 */
export type INTOR_GENERATED_KEY = "__intor_generated__";

/**
 * Conditional type for generated types.
 * - Uses key presence on `IntorGeneratedTypes` to detect generation.
 */
export type IfGen<Then, Else = never> = IntorGeneratedTypes extends {
  [K in INTOR_GENERATED_KEY]: true;
}
  ? Then
  : Else;

/**
 * Config keys provided by generated types.
 * - Excludes internal sentinel
 */
type GeneratedConfigKeys = Exclude<
  keyof IntorGeneratedTypes,
  INTOR_GENERATED_KEY
>;

/**
 * Union of all configuration keys.
 * - Defaults to `string` if `IntorGeneratedTypes` does not exist.
 */
export type GenConfigKeys = IfGen<GeneratedConfigKeys, string>;

/**
 * Configuration shape for a given config key.
 * - If `IntorGeneratedTypes` is not defined, falls back to default shape.
 * Otherwise, picks `Locales` and `Messages` according to the key.
 */
export type GenConfig<CK extends GenConfigKeys> = IfGen<
  // generated mode
  CK extends keyof IntorGeneratedTypes
    ? IntorGeneratedTypes[CK] extends {
        Locales: infer L extends string;
        Messages: Record<typeof PREFIX_PLACEHOLDER, infer M>;
      }
      ? {
          Locales: L;
          Messages: Record<L, M>;
        }
      : never
    : never,
  // fallback mode
  { Locales: string; Messages: LocaleMessages }
>;

/** Extracts messages for a given config key */
export type GenMessages<CK extends GenConfigKeys> = GenConfig<CK>["Messages"];

/** Extracts locales for a given config key */
export type GenLocale<CK extends GenConfigKeys> = GenConfig<CK>["Locales"];
