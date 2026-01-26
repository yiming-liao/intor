import type { HtmlTagRenderers, TranslatorInstance } from "@/core";
import {
  type Locale,
  type LocaleMessages,
  type LocalizedKey,
  type LocalizedReplacement,
  type LocalizedRich,
  type Replacement,
  type Rich,
  type ScopedKey,
} from "intor-translator";

export type TranslatorInstanceServer<
  M extends LocaleMessages,
  ReplacementSchema = Replacement,
  RichSchema = Rich,
  PK extends string | undefined = undefined,
> = TranslatorInstance<M, ReplacementSchema, PK> & {
  /** `messages`: The message object containing all translations. */
  messages: M;

  /** Current locale in use. */
  locale: Locale<M>;

  /** Translate a key into an HTML string using semantic rich tags. */
  tRich: <
    K extends string = PK extends string ? ScopedKey<M, PK> : LocalizedKey<M>,
    RI = LocalizedRich<RichSchema, K>,
    RE = LocalizedReplacement<ReplacementSchema, K>,
  >(
    key?: K | (string & {}),
    tagRenderers?: HtmlTagRenderers<RI> | HtmlTagRenderers,
    replacements?: RE | Replacement,
  ) => string;
};
