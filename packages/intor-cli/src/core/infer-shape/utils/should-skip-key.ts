/**
 * Determine whether a message object key should be ignored during schema inference.
 *
 * - Internal Intor metadata keys (`__intor_*`) are never part of semantic schemas
 * - Markdown payload (`content`) is only meaningful in Messages schema,
 *   and must be excluded from Replacements / Rich inference
 */
export function shouldSkipKey(
  key: string,
  mode: "messages" | "replacements" | "rich",
) {
  if (key.startsWith("__intor_")) return true;
  if (mode !== "messages" && key === "content") return true;
  return false;
}
