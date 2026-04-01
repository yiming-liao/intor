import { Translator } from "intor-translator";

/**
 * List formatting
 */

const messages = {
  en: {
    common: {
      supports: "Supports {items}",
    },
  },
  de: {
    common: {
      supports: "Unterstuetzt {items}",
    },
  },
};

const translator = new Translator({ messages, locale: "en" });
const items = ["Apple", "Banana", "Cherry"];

//════════════════════════ Output ════════════════════════

console.log(translator.format.list(items));
// => 'Apple, Banana, and Cherry'

console.log(
  translator.format.list(items, {
    type: "disjunction",
    style: "short",
  }),
);
// => 'Apple, Banana, or Cherry'

console.log(
  translator.t("common.supports", {
    items: translator.format.list(items),
  }),
);
// => 'Supports Apple, Banana, and Cherry'

translator.setLocale("de");

console.log(translator.format.list(items));
// => locale-equivalent list output for German
