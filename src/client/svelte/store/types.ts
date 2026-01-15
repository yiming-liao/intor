import type { SvelteTagRenderers } from "../render";
import type { IntorResolvedConfig } from "@/config";
import type {
  Locale,
  Replacement,
  LocaleMessages,
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import type { Readable, Writable } from "svelte/store";

export type IntorValue = {
  config: IntorResolvedConfig;
  locale: Locale;
  messages?: Readable<LocaleMessages>;
  isLoading?: Readable<boolean>;
  onLocaleChange?: (newLocale: Locale) => Promise<void> | void;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
};

export type IntorStore = {
  /** `messages`: The message object containing all translations. */
  messages: Readable<LocaleMessages>;

  /** Current locale in use. */
  locale: Writable<Locale>;

  /** Indicates whether translations are currently loading. */
  isLoading: Readable<boolean>;

  /** Update the active locale. */
  setLocale: (locale: Locale) => void;

  /** Create a scoped translator using a preKey */
  scoped(preKey: string): ReactiveTranslator;
} & ReactiveTranslator;

export interface ReactiveTranslator {
  /** Reactive translation function for Svelte templates */
  t: Readable<(key: string, replacements?: Replacement) => string>;
  /** Reactive rich translation function for Svelte templates */
  tRich: Readable<
    (
      key: string,
      tagRenderers?: SvelteTagRenderers,
      replacements?: Replacement,
    ) => string
  >;
}
