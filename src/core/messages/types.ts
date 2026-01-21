/**
 * A function that reads and parses a message file into a message object
 * for a single locale (without locale prefix).
 *
 * This function is format-specific (YAML, TOML, etc.)
 * and is NOT responsible for validating the returned structure.
 *
 * @param filePath - The path to the message file to read.
 * @returns A Promise that resolves to parsed, unvalidated content.
 *
 * @example
 * ```ts
 * const reader: MessagesReader = async () => {
 *   // Single-locale message object (no locale prefix)
 *   return {
 *     title: "Hello",
 *   };
 * };
 * ```
 */
export type MessagesReader = (filePath: string) => Promise<unknown>;

/**
 * A map of file extension (without dot) to message reader.
 *
 * Example:
 * {
 *   md: mdReader,
 *   yaml: yamlReader,
 *   toml: tomlReader,
 * }
 */
export type MessagesReaders = Record<string, MessagesReader>;
