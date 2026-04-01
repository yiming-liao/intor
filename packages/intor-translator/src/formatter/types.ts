/**
 * Locale-aware formatting helpers backed by Intl.
 *
 * @public
 */
export interface IntlFormatter {
  number(value: number | bigint, options?: Intl.NumberFormatOptions): string;
  currency(
    value: number | bigint,
    currency?: string,
    options?: Omit<Intl.NumberFormatOptions, "style" | "currency">,
  ): string;
  date(value: Date | number, options?: Intl.DateTimeFormatOptions): string;
  relativeTime(
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ): string;
  list(values: Iterable<string>, options?: Intl.ListFormatOptions): string;
  displayName(
    value: string,
    options?: Partial<Intl.DisplayNamesOptions>,
  ): string | undefined;
  plural(value: number, options?: Intl.PluralRulesOptions): Intl.LDMLPluralRule;
}

/**
 * Default Intl options applied by `createFormatter`.
 *
 * Call-site options passed to each formatter method take precedence.
 *
 * @public
 */
export interface FormatDefaults {
  date?: Intl.DateTimeFormatOptions;
  number?: Intl.NumberFormatOptions;
  currency?: Omit<Intl.NumberFormatOptions, "style" | "currency">;
  relativeTime?: Intl.RelativeTimeFormatOptions;
  list?: Intl.ListFormatOptions;
  displayName?: Partial<Intl.DisplayNamesOptions>;
  plural?: Intl.PluralRulesOptions;
  /** Fallback currency code when `format.currency(...)` is called without `currency`. */
  currencyCode?: string;
  /** Global fallback time zone (typically used by `format.date(...)`). */
  timeZone?: string;
}
