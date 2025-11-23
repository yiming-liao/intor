import type { NestedMessage } from "intor-translator";

/**
 * Represents a collection of localized messages.
 *
 * - Each key is a namespace or message identifier, and the value is a
 * `NestedMessage` object that can contain nested message structures.
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
 * - This function is expected to return a `Promise` that resolves to a `Messages` object.
 * - It can be implemented to support different file formats such as JSON, YAML, or others.
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
