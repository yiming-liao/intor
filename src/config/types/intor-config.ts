import type { CacheRawOptions, CacheResolvedOptions } from "./cache";
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
  readonly id?: string;
  // --- Locale & Messages ---
  readonly messages?: LocaleMessages;
  readonly defaultLocale: Locale;
  readonly supportedLocales?: readonly Locale[];
  readonly fallbackLocales?: FallbackLocalesMap;
  // --- Translator ---
  readonly translator?: TranslatorOptions;
  // --- Routing & Persistence ---
  readonly routing?: RoutingRawOptions;
  readonly cookie?: CookieRawOptions;
  // --- Messages Loading ---
  readonly loader?: LoaderOptions;
  readonly server?: { loader?: ServerLoaderOptions };
  readonly client?: { loader?: ClientLoaderOptions };
  // --- Observability & Infrastructure ---
  readonly logger?: Omit<LoggerOptions, "id">;
  readonly cache?: CacheRawOptions;
};

/** Fully resolved configuration after validation and normalization. */
export type IntorResolvedConfig = {
  readonly id: string;
  // --- Locale & Messages ---
  readonly messages?: LocaleMessages;
  readonly defaultLocale: Locale;
  readonly supportedLocales: readonly Locale[];
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
  readonly cache: CacheResolvedOptions;
};
