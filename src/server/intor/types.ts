import type { IntorResolvedConfig } from "@/config";
import type { BootstrapCore } from "@/core/types/bootstrap";
import { type GenConfigKeys, type GenLocale } from "@/core";

export type LocaleResolver<CK extends GenConfigKeys = "__default__"> = (
  config: IntorResolvedConfig,
) => GenLocale<CK> | Promise<GenLocale<CK>>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- semantic alias for a server-side bootstrap snapshot
export interface BootstrapSnapshot<CK extends GenConfigKeys = "__default__">
  extends BootstrapCore<CK> {}
