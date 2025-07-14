import type {
  InitCookieOptions,
  ResolvedCookieOptions,
} from "./cookie-options-types";
import type { IntorAdapter } from "./intor-adapter-types";
import type { LoaderOptions } from "./loader-options-types";
import type {
  InitLoggerOptions,
  ResolvedLoggerOptions,
} from "./logger-options-types";
import type {
  InitRoutingOptions,
  ResolvedRoutingOptions,
} from "./routing-options-types";
import {
  FallbackLocalesMap,
  Locale,
  LocaleNamespaceMessages,
} from "intor-translator";
import { InitTranslatorOptions } from "@/modules/intor-config/types/translator-options-types";

// With static messages (Without loader options)
export type WithStaticMessages = {
  loaderOptions?: undefined;
  supportedLocales?: readonly Locale[]; // Optional
};

// With dynamic messages (With loader options)
export type WithDynamicMessages = {
  loaderOptions: LoaderOptions;
  supportedLocales: readonly Locale[]; // Required
};

// =====================================
// Init config
// =====================================

export type IntorInitConfig = (
  | WithDynamicMessages // supportedLocales is required
  | WithStaticMessages
) & {
  readonly id?: string; // Identifier for the intor instance
  readonly messages?: LocaleNamespaceMessages; // Static messages
  readonly defaultLocale: Locale;
  readonly fallbackLocales?: FallbackLocalesMap;
  readonly translator?: InitTranslatorOptions;
  readonly cookie?: InitCookieOptions;
  readonly routing?: InitRoutingOptions;
  readonly adapter?: IntorAdapter;
  readonly logger?: InitLoggerOptions;
  readonly prefixPlaceHolder?: string;
};

// =====================================
// Resolved config
// =====================================

export type IntorResolvedConfig = (
  | WithDynamicMessages // supportedLocales is required
  | WithStaticMessages
) & {
  readonly id: string; // Identifier for the intor instance
  readonly messages?: LocaleNamespaceMessages; // Static messages
  readonly defaultLocale: Locale;
  readonly fallbackLocales: FallbackLocalesMap;
  readonly translator?: InitTranslatorOptions;
  readonly cookie: ResolvedCookieOptions;
  readonly routing: ResolvedRoutingOptions;
  readonly adapter: IntorAdapter;
  readonly logger?: ResolvedLoggerOptions;
  readonly prefixPlaceHolder: string;
};
