import type { IntorResolvedConfig } from "@/config";
import type { GenConfigKeys, GenLocale, GenMessages } from "@/core";

/**
 * Shared bootstrap contract for initializing an Intor client runtime.
 *
 * This type defines the minimal, framework-agnostic data required
 * to bootstrap a client-side Intor runtime.
 */
export interface BootstrapCore<CK extends GenConfigKeys> {
  config: IntorResolvedConfig;
  locale: GenLocale<CK>;
  messages: Readonly<GenMessages<CK>>;
}
