import type { FormatHandler, MessageValue } from "intor-translator";
import { IntlMessageFormat } from "intl-messageformat";
import { Translator } from "intor-translator";

/**
 * [Handler] Custom ICU formatting.
 */

// A custom formatter using ICU MessageFormat
const formatHandler: FormatHandler = ({ rawMessage, locale, replacements }) => {
  const formatter = new IntlMessageFormat(
    rawMessage,
    locale,
    {},
    { ignoreTag: true },
  );
  return formatter.format(replacements) as MessageValue;
};

// Messages (follows the LocalesMessages structure)
const messages = {
  en: {
    notification:
      "{name} has {count, plural, =0 {no messages} one {1 message} other {# messages}}.",
  },
};

// Create translator with a custom formatting handler
const translator = new Translator({
  locale: "en",
  messages,
  handlers: { formatHandler },
});

//════════════════════════ Output ════════════════════════
console.log(translator.t("notification", { name: "John", count: 0 }));
// => John has no messages.

console.log(translator.t("notification", { name: "John", count: 5 }));
// => John has 5 messages.
