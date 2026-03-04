import type { IntorConfig } from "../../config";
import {
  type GenConfigKeys,
  type GenLocale,
  type GenMessages,
  type MessagesReaders,
  type RuntimeFetch,
} from "../../core";

/**
 * Options for the `intor` server initializer.
 *
 * Controls message loading behavior for the current request.
 *
 * @public
 */
export interface IntorOptions {
  readers?: MessagesReaders;
  allowCacheWrite?: boolean;
  fetch?: RuntimeFetch;
}

/**
 * Server-side snapshot returned by `intor`.
 *
 * Represents a locale-bound, fully-resolved message state.
 *
 * @public
 */
export interface IntorValue<CK extends GenConfigKeys = "__default__"> {
  config: IntorConfig;
  locale: GenLocale<CK>;
  messages: Readonly<GenMessages<CK>>;
}
