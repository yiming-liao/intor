import { Translator } from "intor-translator";

/**
 * Currency formatting
 */

const messages = {
  en: {
    common: {
      total: "Total: {amount}",
    },
  },
};

const translator = new Translator({ messages, locale: "en" });

//════════════════════════ Output ════════════════════════

console.log(translator.format.currency(499.9, "USD"));
// => '$499.90'

console.log(
  translator.t("common.total", {
    amount: translator.format.currency(499.9, "USD"),
  }),
);
// => 'Total: $499.90'

console.log(
  translator.format.currency(-1234567.891, "USD", {
    currencyDisplay: "symbol",
    currencySign: "accounting",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }),
);
// => '($1,234,567.89)'
