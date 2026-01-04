import type { SvelteTagRenderers } from "../render";
import type {
  BootstrapCore,
  GenConfigKeys,
  GenLocale,
  GenMessages,
  MessageKey,
} from "@/core";
import type { KeyMode } from "@/core";
import type {
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";
import type { Readable } from "svelte/store";
import {
  type Locale,
  type LocalizedNodeKeys,
  type Replacement,
} from "intor-translator";

export interface SvelteBootstrap<CK extends GenConfigKeys = "__default__">
  extends Omit<BootstrapCore<CK>, "messages"> {
  messages?: Readable<GenMessages<CK>>;
  isLoading?: Readable<boolean>;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  onLocaleChange?: (newLocale: GenLocale<CK>) => Promise<void> | void;
}

export type CreateIntorOptions<CK extends GenConfigKeys = "__default__"> =
  SvelteBootstrap<CK>;

export type IntorRuntime<
  CK extends GenConfigKeys = "__default__",
  Mode extends KeyMode = "auto",
> = {
  /** `messages`: The message object containing all translations. */
  messages: GenMessages<CK>;

  /** Current locale in use. */
  locale: Locale<GenMessages<CK>>;

  /** Indicates whether translations are currently loading. */
  isLoading: boolean;

  /** Update the active locale. */
  setLocale: (locale: Locale<GenMessages<CK>>) => void;

  /** Create a scoped translator using a preKey */
  scoped<PK extends string = LocalizedNodeKeys<GenMessages<CK>>>(
    preKey: PK,
  ): ReactiveTranslator<CK, PK, Mode>;
} & ReactiveTranslator<CK, undefined, Mode>;

interface ReactiveTranslator<
  CK extends GenConfigKeys = "__default__",
  PK extends string | undefined = undefined,
  Mode extends KeyMode = "auto",
> {
  /** Reactive translation function for Svelte templates */
  t: Readable<
    (
      key?: MessageKey<GenMessages<CK>, PK, Mode>,
      replacements?: Replacement,
    ) => string
  >;
  /** Reactive rich translation function for Svelte templates */
  tRich: Readable<
    (
      key: MessageKey<GenMessages<CK>, PK, Mode>,
      tagRenderers?: SvelteTagRenderers,
      replacements?: Replacement,
    ) => string
  >;
}
