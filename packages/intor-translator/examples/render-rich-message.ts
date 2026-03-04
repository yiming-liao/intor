import { Translator, renderRichMessage, type Renderer } from "intor-translator";

/**
 * Use `renderRichMessage` to render rich-formatted translation output.
 */

// Messages (follows the LocalesMessages structure)
const messages = {
  en: {
    welcome: "Welcome to <b>our site</b>!",
  },
};

// Create a translator instance
const translator = new Translator({ messages, locale: "en" });

// Define a string renderer
const stringRenderer: Renderer<string> = {
  text(value: string) {
    return value;
  },
  tag(name: string, _: Record<string, string>, children: string[]) {
    // This switch is where tag semantics are implemented.
    switch (name) {
      case "b": {
        return `**${children.join("")}**`;
      }
      default: {
        return children.join("");
      }
    }
  },
  raw(value) {
    if (typeof value === "string") return value;
    return "unknown";
  },
};

//════════════════════════ Output ════════════════════════

// Render the translated message
const output = renderRichMessage(translator.t("welcome"), stringRenderer);

// Join rendered segments into a single string
console.log(output.join(""));
// => Welcome to **our site**!
