import type { TranslateHandlers } from "./handlers";
import type { FallbackLocalesMap, Locale } from "../../types";

/**
 * Configuration options controlling translation behavior.
 *
 * These options influence how the pipeline resolves fallbacks,
 * loading states, missing messages, and custom handlers.
 *
 * @public
 */
export type TranslateConfig<M = unknown> = {
  /**
   * Mapping of fallback locales used when a message cannot be resolved in the active locale.
   */
  fallbackLocales?: FallbackLocalesMap<Locale<M>>;

  /**
   * Message returned while translations are still loading.
   */

  loadingMessage?: string;
  /**
   * Message returned when no translation can be resolved.
   */
  missingMessage?: string;

  /**
   * Optional custom handlers that override or extend default pipeline behavior.
   */
  handlers?: TranslateHandlers;
};
