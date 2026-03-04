import {
  findMessage,
  format,
  interpolate,
  loading,
  missing,
  resolveLocales,
} from "./hooks";

/**
 * Default hook sequence for the translation pipeline.
 *
 * The order defines the canonical execution flow:
 * locale resolution → message lookup → loading handling →
 * missing handling → formatting → interpolation.
 *
 * This array represents the standard translation strategy
 * used by CoreTranslator unless extended via `use()`.
 */
export const DEFAULT_HOOKS = [
  resolveLocales,
  findMessage,
  loading,
  missing,
  format,
  interpolate,
];
