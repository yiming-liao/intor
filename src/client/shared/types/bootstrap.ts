import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale } from "@/core";
import type {
  TranslateHandlers,
  TranslateHook,
  TranslatorPlugin,
} from "intor-translator";

/**
 * Framework-agnostic bootstrap types for the Intor client runtime.
 *
 * Defines the minimal input required to initialize a client runtime.
 * Reactive or framework-specific state should be handled by adapters.
 */
export interface BootstrapCore<CK extends GenConfigKeys = "__default__"> {
  config: IntorResolvedConfig;
  initialLocale: GenLocale<CK>;
  handlers?: TranslateHandlers;
  plugins?: (TranslatorPlugin | TranslateHook)[];
  onLocaleChange?: (newLocale: GenLocale<CK>) => Promise<void> | void;
}
