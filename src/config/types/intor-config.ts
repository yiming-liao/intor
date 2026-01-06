import type { CookieRawOptions, CookieResolvedOptions } from "./cookie";
import type {
  ClientLoaderOptions,
  LoaderOptions,
  ServerLoaderOptions,
} from "./loader";
import type { LoggerOptions } from "./logger";
import type { RoutingRawOptions, RoutingResolvedOptions } from "./routing";
import type { TranslatorOptions } from "./translator";
import type {
  FallbackLocalesMap,
  Locale,
  LocaleMessages,
} from "intor-translator";

/** Raw configuration object used to define Intor behavior. */
export type IntorRawConfig = {
  /** Identifier for this Intor config scope; defaults to "default" and should be unique across configs. */
  readonly id?: string;

  /** Static locale messages. */
  readonly messages?: LocaleMessages;
  /** Base locale used for locale resolution and routing decisions. */
  readonly defaultLocale: Locale;
  /** Explicit list of locales supported by the application. */
  readonly supportedLocales: readonly Locale[];
  /** Locale fallback rules used to determine alternative locales for message loading and lookup. */
  readonly fallbackLocales?: FallbackLocalesMap;

  /** Static fallback messages used during translation states. */
  readonly translator?: TranslatorOptions;

  /** Locale-aware routing behavior and redirection strategy. */
  readonly routing?: RoutingRawOptions;
  /** Cookie persistence settings for locale resolution. */
  readonly cookie?: CookieRawOptions;

  /** Messages loading configuration shared across runtimes. */
  readonly loader?: LoaderOptions;
  /** Server-specific messages loading overrides. */
  readonly server?: { loader?: ServerLoaderOptions };
  /** Client-specific messages loading overrides. */
  readonly client?: { loader?: ClientLoaderOptions };

  /** Logging and diagnostic configuration. */
  readonly logger?: Omit<LoggerOptions, "id">;
};

/** Fully resolved configuration after validation and normalization. */
export type IntorResolvedConfig = {
  readonly id: string;

  // --- Locale & Messages ---
  readonly messages?: LocaleMessages;
  readonly defaultLocale: string;
  readonly supportedLocales: readonly string[];
  readonly fallbackLocales: FallbackLocalesMap;

  // --- Translator ---
  readonly translator?: TranslatorOptions;

  // --- Routing & Persistence ---
  readonly routing: RoutingResolvedOptions;
  readonly cookie: CookieResolvedOptions;

  // --- Messages Loading ---
  readonly loader?: LoaderOptions;
  readonly server?: { loader?: ServerLoaderOptions };
  readonly client?: { loader?: ClientLoaderOptions };

  // --- Observability & Infrastructure ---
  readonly logger: LoggerOptions;
};
