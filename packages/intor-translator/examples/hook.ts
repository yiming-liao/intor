import { Translator, type TranslateHook } from "intor-translator";

/**
 * [Hook] Modify the final translated output.
 */

// A simple hook that appends a suffix to every translated message
export const autoSuffixHook: TranslateHook = {
  name: "autoSuffix",
  order: 999, // runs after built-in hooks
  run(ctx) {
    if (typeof ctx.finalMessage === "string") {
      ctx.finalMessage = `${ctx.finalMessage} ✨`;
    }
  },
};

// Messages (follows the LocalesMessages structure)
const messages = { en: { hello: "Hello" } };

// Create translator with custom hooks / plugins
const translator = new Translator({
  locale: "en",
  messages,
  hooks: [autoSuffixHook],
});

//════════════════════════ Output ════════════════════════
console.log(translator.t("hello"));
// => Hello ✨
