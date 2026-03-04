import type { IntorConfig } from "../../config";
import type { Locale, LocaleMessages } from "intor-translator";
import { getLogger } from "../logger";
import { deepMerge } from "../utils";

/**
 * Event emitted during message merging when a value is added or overridden.
 *
 * Provided to the `onEvent` hook of `mergeMessages`.
 *
 * @public
 */
export interface MergeMessagesEvent {
  /** Dot-separated property path. */
  path: string;
  /** Previous value before merge. */
  prev: unknown;
  /** Next value after merge. */
  next: unknown;
  /** Type of change. */
  kind: "add" | "override";
}

/**
 * Options controlling merge behavior and event reporting.
 *
 * @public
 */
export interface MergeMessagesOptions {
  config: IntorConfig;
  locale: Locale;
  /** Optional hook for tooling; suppresses runtime logging when provided. */
  onEvent?: (event: MergeMessagesEvent) => void;
}

/**
 * Merge locale-specific messages with runtime overrides.
 *
 * - Only merges messages under the given locale
 * - Emits debug logs for add / override events
 *
 * @public
 */
export function mergeMessages(
  a: LocaleMessages | undefined,
  b: LocaleMessages | undefined,
  { config, locale, onEvent }: MergeMessagesOptions,
): LocaleMessages {
  const baseLogger = getLogger({ ...config.logger, id: config.id });
  const logger = baseLogger.child({ scope: "merge-messages" });

  // Merge messages for the active locale only
  const merged = deepMerge(a?.[locale] ?? {}, b?.[locale] ?? {}, {
    onOverride: (event) => {
      if (onEvent) {
        onEvent(event);
        return;
      }
      const { kind, path, next, prev } = event;
      if (kind === "add") return;
      logger.debug(`Override | ${locale}: "${path}"`, { prev, next });
    },
  });

  // Preserve other locales, update only the target one
  return {
    ...a,
    [locale]: merged,
  };
}
