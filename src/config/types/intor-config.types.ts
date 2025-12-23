import type { CookieRawOptions, CookieResolvedOptions } from "./cookie.types";
import type { LoaderOptions } from "./loader.types";
import type { LoggerOptions } from "./logger.types";
import type {
  RoutingRawOptions,
  RoutingResolvedOptions,
} from "./routing.types";
import type {
  CacheRawOptions,
  CacheResolvedOptions,
} from "@/config/types/cache.types";
import type { TranslatorOptions } from "@/config/types/translator.types";
import type {
  FallbackLocalesMap,
  Locale,
  LocaleMessages,
} from "intor-translator";

/** Raw configuration object used to define Intor behavior. */
export type IntorRawConfig = (
  | { loader: LoaderOptions; supportedLocales: readonly Locale[] }
  | { loader?: undefined; supportedLocales?: readonly Locale[] }
) & {
  readonly id?: string;
  readonly messages?: LocaleMessages; // Static messages
  readonly defaultLocale: Locale;
  readonly fallbackLocales?: FallbackLocalesMap;
  readonly translator?: TranslatorOptions;
  readonly cookie?: CookieRawOptions;
  readonly routing?: RoutingRawOptions;
  readonly logger?: LoggerOptions;
  readonly cache?: CacheRawOptions;
};

/** Fully resolved configuration after validation and normalization. */
export type IntorResolvedConfig = (
  | { loader: LoaderOptions; supportedLocales: readonly Locale[] }
  | { loader?: undefined; supportedLocales: readonly Locale[] }
) & {
  readonly id: string;
  readonly messages?: LocaleMessages;
  readonly defaultLocale: Locale;
  readonly fallbackLocales: FallbackLocalesMap;
  readonly translator?: TranslatorOptions;
  readonly cookie: CookieResolvedOptions;
  readonly routing: RoutingResolvedOptions;
  readonly logger?: LoggerOptions;
  readonly cache: CacheResolvedOptions;
};
