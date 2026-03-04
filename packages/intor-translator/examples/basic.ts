import { Translator } from "intor-translator";

/**
 * Basic translation flow
 */

// Messages (follows the LocalesMessages structure)
const messages = {
  en: {
    common: { welcome: "Welcome" },
    auth: { login: { success: "Login successful" } },
  },
  zh: {
    common: { welcome: "歡迎" },
    something: { key: "value" },
  },
};

// Create a translator instance
const translator = new Translator({ messages, locale: "en" });

//════════════════════════ Output ════════════════════════

// translate (with auto-complete)
console.log(translator.t("auth.login.success"));
// => 'Login successful'

// falls back to the key when missing in current locale
console.log(translator.t("something.key"));
// => 'something.key'

//
// scoped translator (auto-completes within "common")
const scoped = translator.scoped("common");

console.log(scoped.hasKey("welcome"));
// => true

console.log(scoped.t("welcome"));
// => 'Welcome'
