import type { IntlFormatter } from "./types";
import { createDateTimeFormatter } from "./date/create-date-time-formatter";
import { createListFormatter } from "./list/create-list-formatter";
import { createNumberFormatter } from "./number/create-number-formatter";
import { createRelativeTimeFormatter } from "./relative-time/create-relative-time-formatter";

/**
 * Creates a locale-bound formatter backed by Intl.
 */
export function createFormatter({
  getLocale,
}: {
  getLocale: () => string;
}): IntlFormatter {
  const getDateTimeFormatter = createDateTimeFormatter();
  const getListFormatter = createListFormatter();
  const getNumberFormatter = createNumberFormatter();
  const getRelativeTimeFormatter = createRelativeTimeFormatter();

  return {
    number(value, options) {
      return getNumberFormatter(getLocale(), options).format(value);
    },

    currency(value, currency, options) {
      return getNumberFormatter(getLocale(), {
        ...options,
        style: "currency",
        currency,
      }).format(value);
    },

    date(value, options) {
      return getDateTimeFormatter(getLocale(), options).format(value);
    },

    relativeTime(value, unit, options) {
      return getRelativeTimeFormatter(getLocale(), options).format(value, unit);
    },

    list(values, options) {
      return getListFormatter(getLocale(), options).format(values);
    },
  };
}
