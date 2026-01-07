import type { NestedMessage } from "intor-translator";

/**
 * Represents a collection of messages for a single locale.
 *
 * - This type does NOT include a locale layer.
 * - Each key represents a namespace or message group, and the value is a
 *   `NestedMessage` object that can contain nested message structures.
 *
 *
 * @example
 * ```ts
 * const messages: Messages = {
 *   ui: {
 *     greeting: "Hello",
 *     farewell: "Goodbye"
 *   },
 *   errors: {
 *     network: "Network error occurred"
 *   }
 * };
 * ```
 */
export type Messages = Record<string, NestedMessage>;

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
