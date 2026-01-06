import type { LoadRemoteMessagesParams } from "./types";
import type { LocaleMessages } from "intor-translator";
import { getLogger } from "../../logger";
import { fetchLocaleMessages } from "./fetch-locale-messages";

/**
 * Load locale messages from a remote API.
 *
 * This function serves as the orchestration layer for remote message loading.
 * It coordinates:
 *
 * - Locale resolution with fallbacks
 * - Respecting abort signals across the entire async flow
 *
 * Network fetching and data validation are delegated to lower-level utilities.
 */
export const loadRemoteMessages = async ({
  locale,
  fallbackLocales,
  namespaces,
  rootDir,
  url,
  headers,
  signal,
  loggerOptions,
}: LoadRemoteMessagesParams): Promise<LocaleMessages | undefined> => {
  const baseLogger = getLogger(loggerOptions);
  const logger = baseLogger.child({ scope: "load-remote-messages" });

  // Abort early if the request has already been cancelled
  if (signal?.aborted) {
    logger.debug("Remote message loading aborted before fetch.");
    return;
  }

  const start = performance.now();
  logger.debug("Loading remote messages.", { url });

  // ---------------------------------------------------------------------------
  // Resolve locale messages with ordered fallback strategy
  // ---------------------------------------------------------------------------
  const candidateLocales = [locale, ...(fallbackLocales || [])];
  let messages: LocaleMessages | undefined;

  for (let i = 0; i < candidateLocales.length; i++) {
    const candidateLocale = candidateLocales[i];
    const isLast = i === candidateLocales.length - 1;
    try {
      const fetched = await fetchLocaleMessages({
        locale: candidateLocale,
        namespaces,
        rootDir,
        url,
        headers,
        signal,
        extraOptions: { loggerOptions },
      });
      // Stop at the first locale that yields non-empty messages
      if (fetched && Object.values(fetched[candidateLocale] || {}).length > 0) {
        messages = fetched;
        break;
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        logger.debug("Remote message loading aborted.");
        return;
      }
      if (isLast) {
        logger.warn("Failed to load messages for all candidate locales.", {
          locale,
          fallbackLocales,
        });
      } else {
        logger.warn(
          `Failed to fetch locale messages for "${candidateLocale}", trying next fallback.`,
        );
      }
      logger.trace("Remote fetch error detail.", {
        locale: candidateLocale,
        error,
      });
    }
  }

  // Final success log with resolved locale and timing
  if (messages) {
    logger.trace("Finished loading remote messages.", {
      loadedLocale: messages ? Object.keys(messages)[0] : undefined,
      duration: `${Math.round(performance.now() - start)} ms`,
    });
  }

  return messages;
};
