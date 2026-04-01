import { Translator } from "intor-translator";

/**
 * Date formatting
 */

const messages = {
  en: {
    common: {
      publishedAt: "Published: {date}",
    },
  },
  de: {
    common: {
      publishedAt: "Veroeffentlicht: {date}",
    },
  },
};

const translator = new Translator({ messages, locale: "en" });
const publishedAt = new Date("2026-04-01T00:00:00.000Z");

//════════════════════════ Output ════════════════════════

console.log(
  translator.format.date(publishedAt, {
    dateStyle: "long",
    timeZone: "UTC",
  }),
);
// => 'April 1, 2026'

console.log(
  translator.t("common.publishedAt", {
    date: translator.format.date(publishedAt, {
      dateStyle: "long",
      timeZone: "UTC",
    }),
  }),
);
// => 'Published: April 1, 2026'

translator.setLocale("de");

console.log(
  translator.format.date(publishedAt, {
    dateStyle: "long",
    timeZone: "UTC",
  }),
);
// => '1. April 2026' or locale-equivalent date output
