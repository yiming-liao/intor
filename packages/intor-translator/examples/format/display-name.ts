import { Translator } from "intor-translator";

/**
 * Display name formatting (languages, regions, currencies, scripts)
 */

const messages = {
  en: {
    common: {
      language: "Language: {value}",
      region: "Region: {value}",
      currency: "Currency: {value}",
    },
  },
  de: {
    common: {
      language: "Sprache: {value}",
      region: "Region: {value}",
      currency: "Waehrung: {value}",
    },
  },
};

const translator = new Translator({
  messages,
  locale: "en",
  formatDefaults: {
    displayName: { type: "language", languageDisplay: "dialect" },
  },
});

//════════════════════════ Output ════════════════════════

console.log(translator.format.displayName("en-US"));
// => 'American English'

console.log(
  translator.t("common.language", {
    value: translator.format.displayName("de-DE"),
  }),
);
// => 'Language: German (Germany)'

console.log(
  translator.t("common.region", {
    value: translator.format.displayName("US", { type: "region" }),
  }),
);
// => 'Region: United States'

console.log(
  translator.t("common.currency", {
    value: translator.format.displayName("USD", { type: "currency" }),
  }),
);
// => 'Currency: US Dollar'

translator.setLocale("de");

console.log(translator.format.displayName("US", { type: "region" }));
// => 'Vereinigte Staaten' or locale-equivalent region output
