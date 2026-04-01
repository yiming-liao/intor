import { Translator } from "intor-translator";

/**
 * Plural category selection
 */

const messages = {
  en: {
    common: {
      files: "{count} file(s) => {category}",
    },
  },
  ar: {
    common: {
      files: "{count} file(s) => {category}",
    },
  },
};

const translator = new Translator({
  messages,
  locale: "en",
  formatDefaults: {
    plural: { type: "cardinal" },
  },
});

//════════════════════════ Output ════════════════════════

console.log(translator.format.plural(1));
// => 'one'

console.log(translator.format.plural(2));
// => 'other'

console.log(
  translator.t("common.files", {
    count: 5,
    category: translator.format.plural(5),
  }),
);
// => '5 file(s) => other'

translator.setLocale("ar");

console.log(translator.format.plural(2));
// => locale-equivalent plural category for Arabic (e.g. 'two')
