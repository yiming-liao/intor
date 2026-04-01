import { Translator } from "intor-translator";

/**
 * Formatter defaults and fallback behavior
 */

const messages = {
  en: {
    common: {
      summary: "{date} | {amount} | {distance} | {items}",
    },
  },
  de: {
    common: {
      summary: "{date} | {amount} | {distance} | {items}",
    },
  },
};

const translator = new Translator({
  messages,
  locale: "en",
  formatDefaults: {
    timeZone: "UTC",
    number: { maximumFractionDigits: 1 },
    date: { dateStyle: "long" },
    currency: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
    relativeTime: { numeric: "auto" },
    list: { type: "conjunction", style: "long" },
  },
});

const publishedAt = new Date("2026-04-01T12:30:00.000Z");
const items = ["Apple", "Banana", "Cherry"];

//════════════════════════ Output ════════════════════════

console.log(translator.format.date(publishedAt));
// => 'April 1, 2026'

console.log(translator.format.currency(499.9, "USD"));
// => '$500' (uses formatDefaults.currency)

console.log(translator.format.number(12_345.67));
// => '12,345.7'

console.log(translator.format.relativeTime(-1, "day"));
// => 'yesterday'

console.log(translator.format.list(items));
// => 'Apple, Banana, and Cherry'

console.log(
  translator.t("common.summary", {
    date: translator.format.date(publishedAt),
    amount: translator.format.currency(499.9, "USD"),
    distance: translator.format.number(12_345.67),
    items: translator.format.list(items),
  }),
);

// Call options override defaults
console.log(
  translator.format.date(publishedAt, {
    dateStyle: "short",
  }),
);
// => '4/1/26'

translator.setLocale("de");

console.log(translator.format.date(publishedAt));
// => '1. April 2026' or locale-equivalent date output
