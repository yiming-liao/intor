import { Translator } from "intor-translator";

/**
 * Relative time formatting
 */

const messages = {
  en: {
    common: {
      updated: "Updated {time}",
    },
  },
  de: {
    common: {
      updated: "Aktualisiert {time}",
    },
  },
};

const translator = new Translator({ messages, locale: "en" });

//════════════════════════ Output ════════════════════════

console.log(translator.format.relativeTime(-2, "hour"));
// => '2 hours ago'

console.log(
  translator.format.relativeTime(-1, "day", {
    numeric: "auto",
  }),
);
// => 'yesterday'

console.log(
  translator.t("common.updated", {
    time: translator.format.relativeTime(-2, "hour"),
  }),
);
// => 'Updated 2 hours ago'

translator.setLocale("de");

console.log(translator.format.relativeTime(-2, "hour"));
// => 'vor 2 Stunden' or locale-equivalent relative time output

console.log(
  translator.t("common.updated", {
    time: translator.format.relativeTime(-2, "hour"),
  }),
);
// => 'Aktualisiert vor 2 Stunden' or locale-equivalent relative time output
