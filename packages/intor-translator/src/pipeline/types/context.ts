import type { TranslateConfig } from "./config";
import type { LocaleMessages, Replacement, MessageValue } from "../../types";

/**
 * Context shared across the translation pipeline.
 *
 * Represents the execution state for resolving a single key.
 *
 * @public
 */
export interface TranslateContext {
  // ----------------------------------------------------------
  // Input (read-only by convention)
  // ----------------------------------------------------------
  /** Configuration influencing translation behavior. */
  config: Readonly<TranslateConfig>;
  /** Message tree available for resolution. */
  messages: Readonly<LocaleMessages>;
  /** Active locale for resolution. */
  locale: string;
  /** Indicates whether translations are still loading. */
  isLoading?: boolean;
  /** Translation key to resolve. */
  key: string;
  /** Replacement values used during interpolation. */
  replacements?: Readonly<Replacement>;

  // ----------------------------------------------------------
  // Derived State (written by pipeline stages)
  // ----------------------------------------------------------
  /** Ordered locales evaluated during resolution. */
  candidateLocales: string[];
  /** Raw message resolved from the message tree. */
  rawMessage?: MessageValue;
  /** Message after formatting or transformation. */
  formattedMessage?: MessageValue;

  // ----------------------------------------------------------
  // Output (authoritative result)
  // ----------------------------------------------------------
  /** Final message produced by the pipeline. */
  finalMessage?: MessageValue;

  // ----------------------------------------------------------
  // Extension Channel
  // ----------------------------------------------------------
  /** Shared metadata channel between hooks. */
  meta: Record<string, unknown>;
}
