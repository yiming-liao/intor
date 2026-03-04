import type { LocaleMessages } from "../../types";
import type { Locale } from "../../types";
import { findMessageInLocales } from "../../shared/utils/find-message-in-locales";
import { resolveCandidateLocales } from "../../shared/utils/resolve-candidate-locales";

export type HasKeyOptions = {
  messages: Readonly<LocaleMessages>;
  locale: Locale;
  key: string;
  targetLocale?: Locale;
};

/**
 * Check if a key exists in the specified locale or current locale.
 */
export const hasKey = ({
  messages,
  locale,
  key,
  targetLocale,
}: HasKeyOptions): boolean => {
  const candidateLocales = resolveCandidateLocales(targetLocale || locale);
  const message = findMessageInLocales({ messages, candidateLocales, key });
  return message !== undefined;
};
