import type { FormatDefaults, IntlFormatter } from "./types";
import { createDateTimeFormatter } from "./date/create-date-time-formatter";
import { createDisplayNames } from "./display-name/create-display-names";
import { createListFormatter } from "./list/create-list-formatter";
import { createNumberFormatter } from "./number/create-number-formatter";
import { createPluralRules } from "./plural/create-plural-rules";
import { createRelativeTimeFormatter } from "./relative-time/create-relative-time-formatter";

/**
 * Creates a locale-bound formatter backed by Intl.
 */
export function createFormatter({
  getLocale,
  formatDefaults,
}: {
  getLocale: () => string;
  formatDefaults?: FormatDefaults;
}): IntlFormatter {
  const getDateTimeFormatter = createDateTimeFormatter();
  const getListFormatter = createListFormatter();
  const getRelativeTimeFormatter = createRelativeTimeFormatter();
  const getNumberFormatter = createNumberFormatter();
  const getDisplayNames = createDisplayNames();
  const getPluralRules = createPluralRules();

  return {
    number(value, options) {
      return getNumberFormatter(getLocale(), {
        ...formatDefaults?.number,
        ...options,
      }).format(value);
    },

    currency(value, currency, options) {
      const resolvedCurrency = currency ?? formatDefaults?.currencyCode;
      if (!resolvedCurrency) {
        throw new Error("[intor-translator] currency is required");
      }
      return getNumberFormatter(getLocale(), {
        ...formatDefaults?.currency,
        ...options,
        style: "currency",
        currency: resolvedCurrency,
      }).format(value);
    },

    date(value, options) {
      return getDateTimeFormatter(getLocale(), {
        ...formatDefaults?.date,
        ...(formatDefaults?.timeZone
          ? { timeZone: formatDefaults.timeZone }
          : {}),
        ...options,
      }).format(value);
    },

    relativeTime(value, unit, options) {
      return getRelativeTimeFormatter(getLocale(), {
        ...formatDefaults?.relativeTime,
        ...options,
      }).format(value, unit);
    },

    list(values, options) {
      return getListFormatter(getLocale(), {
        ...formatDefaults?.list,
        ...options,
      }).format(values);
    },

    displayName(value, options) {
      const resolvedOptions: Partial<Intl.DisplayNamesOptions> = {
        ...formatDefaults?.displayName,
        ...options,
      };
      if (!resolvedOptions.type) {
        throw new Error("[intor-translator] displayName type is required");
      }
      return getDisplayNames(
        getLocale(),
        resolvedOptions as Intl.DisplayNamesOptions,
      ).of(value);
    },

    plural(value, options) {
      return getPluralRules(getLocale(), {
        ...formatDefaults?.plural,
        ...options,
      }).select(value);
    },
  };
}
