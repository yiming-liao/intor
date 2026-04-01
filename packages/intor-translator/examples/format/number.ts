import { Translator } from "intor-translator";

/**
 * Number formatting
 */

const messages = {
  en: {
    common: {
      visitors: "Visitors: {count}",
    },
  },
  de: {
    common: {
      visitors: "Besucher: {count}",
    },
  },
};

const translator = new Translator({ messages, locale: "en" });

//════════════════════════ Output ════════════════════════

console.log(translator.format.number(1000));
// => '1,000'

console.log(
  translator.t("common.visitors", {
    count: translator.format.number(12000),
  }),
);
// => 'Visitors: 12,000'

translator.setLocale("de");

console.log(translator.format.number(1000));
// => '1.000'
