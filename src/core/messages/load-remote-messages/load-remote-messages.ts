/* eslint-disable unicorn/prefer-at */
import type { LoadRemoteMessagesParams } from "./types";
import type { LocaleMessages } from "intor-translator";
import pLimit from "p-limit";
import { getLogger } from "../../logger";
import { collectRemoteResources } from "./collect-remote-resources";
import { fetchRemoteResource } from "./fetch-remote-resource";
import { resolveRemoteResources } from "./resolve-remote-resources";

/**
 * Load locale messages from a remote source.
 *
 * This function serves as the orchestration layer for remote message loading.
 * It coordinates:
 *
 * - Locale resolution with fallbacks
 * - Concurrency control for network requests
 * - Remote resource fetching and message merging
 *
 * Remote messages are fetched on demand and are not memoized at the process level.
 *
 * Network requests and response validation are delegated to lower-level utilities.
 */
export const loadRemoteMessages = async ({
  locale,
  fallbackLocales,
  namespaces,
  concurrency,
  fetch,
  url: baseUrl,
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
  logger.debug("Loading remote messages.", { baseUrl });

  // ----------------------------------------------------------------
  // Resolve locale messages with ordered fallback strategy
  // ----------------------------------------------------------------
  const limit = concurrency ? pLimit(concurrency) : undefined;
  const candidateLocales = [locale, ...(fallbackLocales || [])];
  let messages: LocaleMessages | undefined;

  for (const candidateLocale of candidateLocales) {
    const isLast =
      candidateLocale === candidateLocales[candidateLocales.length - 1];
    try {
      // -----------------------------------------------------------------
      // Collect remote message resources for the locale
      // -----------------------------------------------------------------
      const resources = collectRemoteResources({
        locale: candidateLocale,
        baseUrl,
        ...(namespaces !== undefined ? { namespaces } : {}),
      });

      // -----------------------------------------------------------------
      // Fetch all message chunks in parallel
      // -----------------------------------------------------------------
      const fetchUrl = (url: string) =>
        fetchRemoteResource({
          url,
          ...(headers !== undefined ? { headers } : {}),
          ...(signal !== undefined ? { signal } : {}),
          loggerOptions,
          fetch,
        });
      const results = await Promise.all(
        resources.map(({ url }) =>
          limit ? limit(() => fetchUrl(url)) : fetchUrl(url),
        ),
      );

      // Guard: no valid remote resources
      if (!results.some(Boolean)) continue;

      // -----------------------------------------------------------------
      // Resolve and merge remote message resources
      // -----------------------------------------------------------------
      const resolved = resolveRemoteResources(
        resources.map((res, i) => {
          const data = results[i];
          return { path: res.path, ...(data !== undefined ? { data } : {}) };
        }),
      );

      // -----------------------------------------------------------------
      // Wrap resolved messages into locale-scoped LocaleMessages
      // -----------------------------------------------------------------
      messages = { [candidateLocale]: resolved };
      break;
    } catch {
      if (signal?.aborted) {
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
          `Failed to load locale messages for "${candidateLocale}", trying next fallback.`,
        );
      }
    }
  }

  // Final success log with resolved locale and timing
  if (messages) {
    logger.trace("Finished loading remote messages.", {
      loadedLocale: Object.keys(messages)[0],
      duration: `${Math.round(performance.now() - start)} ms`,
    });
  }

  return messages;
};
