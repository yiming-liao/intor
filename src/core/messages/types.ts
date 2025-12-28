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
 * A function that reads messages from a given file path.
 *
 * - This function is expected to return a `Promise` that resolves to a `Messages` object
 *   representing messages for a single locale.
 * - It can be implemented to support different file formats such as YAML, TOML, or others.
 *
 * @param filePath - The path to the message file to read.
 * @returns A Promise that resolves to a `Messages` object.
 *
 * @example
 * ```ts
 * const reader: MessagesReader = async (filePath) => {
 *   const content = await fs.promises.readFile(filePath, "utf-8");
 *   return JSON.parse(content) as Messages;
 * };
 * ```
 */
export type MessagesReader = (filePath: string) => Promise<Messages>;
