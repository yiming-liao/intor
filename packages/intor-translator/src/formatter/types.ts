/**
 * Locale-aware formatting helpers backed by Intl.
 *
 * @public
 */
export interface IntlFormatter {
  number(value: number | bigint, options?: Intl.NumberFormatOptions): string;
  currency(
    value: number | bigint,
    currency: string,
    options?: Omit<Intl.NumberFormatOptions, "style" | "currency">,
  ): string;
  date(value: Date | number, options?: Intl.DateTimeFormatOptions): string;
  relativeTime(
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ): string;
  list(values: Iterable<string>, options?: Intl.ListFormatOptions): string;
}
