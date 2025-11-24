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

// =====================================
// Init config
// =====================================

export type IntorRawConfig = (
  | { loader: LoaderOptions; supportedLocales: readonly Locale[] }
  | { loader?: undefined; supportedLocales?: readonly Locale[] }
) & {
  readonly id?: string; // Identifier for the intor instance
  readonly messages?: LocaleMessages; // Static messages
  readonly defaultLocale: Locale;
  readonly fallbackLocales?: FallbackLocalesMap;
  readonly translator?: TranslatorOptions;
  readonly cookie?: CookieRawOptions;
  readonly routing?: RoutingRawOptions;
  readonly logger?: LoggerOptions;
  readonly cache?: CacheRawOptions;
};

// =====================================
// Resolved config
// =====================================

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
