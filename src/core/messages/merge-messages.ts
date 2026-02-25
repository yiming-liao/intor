import type { IntorResolvedConfig } from "../../config";
import type { Locale, LocaleMessages } from "intor-translator";
import { getLogger } from "../logger";
import { deepMerge, type DeepMergeOverrideEvent } from "../utils";

interface MergeMessagesOptions {
  config: IntorResolvedConfig;
  locale: Locale;
  /**
   * Optional hook for tooling; suppresses runtime logging when provided.
   */
  onEvent?: (event: DeepMergeOverrideEvent) => void;
}

/**
 * Merge locale-specific messages with runtime overrides.
 *
 * - Only merges messages under the given locale
 * - Emits debug logs for add / override events
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
