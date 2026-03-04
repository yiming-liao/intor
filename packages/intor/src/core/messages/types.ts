import type { IntorConfig } from "../../config";
import type { LocaleMessages } from "intor-translator";

/**
 * Reads and parses a message file for a single locale.
 *
 * The reader must return the messages object for one locale only,
 * without adding a locale wrapper.
 *
 * The returned value is intentionally untyped (`unknown`).
 * Intor validates and normalizes it internally.
 *
 * @example
 * ```ts
 * const reader: MessagesReader = async () => ({
 *   title: "Hello"
 * });
 * ```
 *
 * @public
 */
export type MessagesReader = (filePath: string) => Promise<unknown>;

/**
 * Maps file extensions (without leading dot) to message readers.
 *
 * @example
 * ```ts
 * {
 *   yaml: yamlReader,
 *   md: mdReader
 * }
 * ```
 *
 * @public
 */
export type MessagesReaders = Record<string, MessagesReader>;

/**
 * High-level message loading strategy.
 *
 * Allows users to override how locale-specific messages
 * are resolved at runtime (e.g. dynamic imports, remote fetch, custom merging).
 *
 * @public
 */
export type MessagesLoader = (
  config: IntorConfig,
  locale: string,
) => Promise<LocaleMessages>;
