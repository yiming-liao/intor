/**
 * A function that reads and parses a message file.
 *
 * This function is format-specific (YAML, TOML, etc.)
 * and is NOT responsible for validating the returned structure.
 *
 * @param filePath - The path to the message file to read.
 * @returns A Promise that resolves to parsed, unvalidated content.
 *
 *   @example
 * ```ts
 * const reader: MessagesReader = async (filePath) => {
 *   const content = await fs.promises.readFile(filePath, "utf-8");
 *   return JSON.parse(content) as Messages;
 * };
 * ```
 */
export type MessagesReader = (filePath: string) => Promise<unknown>;

/**
 * A map of file extension (without dot) to message reader.
 *
 * Example:
 * {
 *   yaml: yamlReader,
 *   yml: yamlReader,
 *   toml: tomlReader,
 * }
 */
export type MessagesReaders = Record<string, MessagesReader>;
