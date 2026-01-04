import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale } from "@/core";

/**
 * Framework-agnostic runtime state contract for Intor clients.
 *
 * Defines the minimal, shared shape of a client-side runtime state,
 * independent of any specific reactive system or framework.
 */
export interface RuntimeStateCore<CK extends GenConfigKeys = "__default__"> {
  config: IntorResolvedConfig;
  locale: GenLocale<CK>;
  onLocaleChange: (locale: GenLocale<CK>) => Promise<void>;
}
