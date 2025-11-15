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
} from "@/modules/config/types/cache.types";
import type { TranslatorOptions } from "@/modules/config/types/translator.types";
import type {
  FallbackLocalesMap,
  Locale,
  LocaleMessages,
} from "intor-translator";

type WithoutLoader = {
  loader?: undefined;
  supportedLocales?: readonly Locale[]; // Optional
};

type WithLoader = {
  loader: LoaderOptions;
  supportedLocales: readonly Locale[]; // Required
};

// =====================================
// Init config
// =====================================

export type IntorRawConfig = (WithLoader | WithoutLoader) & {
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

export type IntorResolvedConfig = (WithLoader | WithoutLoader) & {
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
