import type { PREFIX_PLACEHOLDER } from "@/shared/constants/prefix-placeholder";
import type { LocaleMessages } from "intor-translator";

/**
 * Conditional type for generated types.
 * - Returns `Then` if `IntorGeneratedTypes` exists, otherwise `Else`.
 */
export type IfGen<Then, Else = never> = IntorGeneratedTypes extends void
  ? Else
  : Then;

/**
 * Union of all configuration keys.
 * - Defaults to `string` if `IntorGeneratedTypes` does not exist.
 */
export type GenConfigKeys = IfGen<keyof IntorGeneratedTypes, string>;

/**
 * Configuration shape for a given config key.
 * - If `IntorGeneratedTypes` is not defined, falls back to default shape.
 * Otherwise, picks `Locales` and `Messages` according to the key.
 */
export type GenConfig<CK extends GenConfigKeys = "__default__"> =
  IntorGeneratedTypes extends void
    ? {
        Locales: string;
        Messages: LocaleMessages;
      }
    : CK extends keyof IntorGeneratedTypes
      ? {
          Locales: IntorGeneratedTypes[CK]["Locales"];
          Messages: {
            [K in IntorGeneratedTypes[CK]["Locales"]]: IntorGeneratedTypes[CK]["Messages"][typeof PREFIX_PLACEHOLDER];
          };
        }
      : never; // Returns `never` when the key does not exist.

/** Extracts messages for a given config key */
export type GenMessages<CK extends GenConfigKeys = "__default__"> =
  GenConfig<CK>["Messages"];

/** Extracts locales for a given config key */
export type GenLocale<CK extends GenConfigKeys = "__default__"> =
  GenConfig<CK>["Locales"];
