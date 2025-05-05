import type {
  InitCookieOptions,
  ResolvedCookieOptions,
} from "@/intor/core/intor-config/types/cookie-options.types";
import type { IntorAdapter } from "@/intor/core/intor-config/types/intor-adapter.types";
import type { LoaderOptions } from "@/intor/core/intor-config/types/loader-options.types";
import type {
  ResolvedRoutingOptions,
  InitRoutingOptions,
} from "@/intor/core/intor-config/types/routing-options.types";
import type {
  InitTranslatorOptions,
  ResolvedTranslatorOptions,
} from "@/intor/core/intor-config/types/translator-options.types";
import type { LogLevel } from "@/intor/core/intor-logger/intor-logger";
import type {
  FallbackLocalesMap,
  LocaleNamespaceMessages,
  Locale,
} from "@/intor/types/message-structure-types";
import type { PrefixPlaceHolder } from "@/intor/types/pathname-types";

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

export type IntorInitConfig<
  Messages extends LocaleNamespaceMessages = LocaleNamespaceMessages,
> = (
  | WithDynamicMessages // supportedLocales is required
  | WithStaticMessages
) & {
  readonly id?: string; // Identifier for the intor instance
  readonly messages?: Messages; // Static messages
  readonly defaultLocale: Locale;
  readonly fallbackLocales?: FallbackLocalesMap;
  readonly translator?: InitTranslatorOptions;
  readonly cookie?: InitCookieOptions;
  readonly routing?: InitRoutingOptions;
  readonly adapter?: IntorAdapter;
  readonly log?: { level?: LogLevel };
  readonly prefixPlaceHolder?: PrefixPlaceHolder;
};

// =====================================
// Resolved config
// =====================================

export type IntorResolvedConfig<
  Messages extends LocaleNamespaceMessages = LocaleNamespaceMessages,
> = (
  | WithDynamicMessages // supportedLocales is required
  | WithStaticMessages
) & {
  readonly id: string; // Identifier for the intor instance
  readonly messages?: Messages; // Static messages
  readonly defaultLocale: Locale;
  readonly fallbackLocales: FallbackLocalesMap;
  readonly translator: ResolvedTranslatorOptions;
  readonly cookie: ResolvedCookieOptions;
  readonly routing: ResolvedRoutingOptions;
  readonly adapter: IntorAdapter;
  readonly prefixPlaceHolder: PrefixPlaceHolder;
};
