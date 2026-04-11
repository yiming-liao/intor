import type { SchemaEntry } from "../types";
import { sortKeysDeep } from "../sort-keys-deep";
import { appendHeader, appendConfigBlock, appendFooter } from "./append";
import { DEFAULT_CONFIG_KEY, GENERATED_INTERFACE_NAME } from "./contract";
import { normalizeRichInferNode } from "./utils/normalize-rich-infer-node";
import { renderInferNode } from "./utils/render-infer-node";

/**
 * Builds the global TypeScript declaration from inferred typegen inputs.
 */
export function buildTypes(schemaEntries: SchemaEntry[]): string {
  const lines: string[] = [];

  // ----------------------------------------------------------------------
  // Global declaration header
  // ----------------------------------------------------------------------
  appendHeader(lines, GENERATED_INTERFACE_NAME);

  // ----------------------------------------------------------------------
  // Emit one block per config entry
  // ----------------------------------------------------------------------
  for (const [index, entry] of schemaEntries.entries()) {
    const localesType = entry.locales.map((l) => `"${l}"`).join(" | ");

    // Normalize/sort before rendering so output is deterministic.
    const messagesType = renderInferNode(sortKeysDeep(entry.shapes.messages));
    const replacementsType = renderInferNode(
      sortKeysDeep(entry.shapes.replacements),
    );
    const richType = renderInferNode(
      sortKeysDeep(normalizeRichInferNode(entry.shapes.rich)),
    );

    // First entry is mirrored as __default__ for backwards compatibility.
    if (index === 0) {
      appendConfigBlock(lines, {
        id: DEFAULT_CONFIG_KEY,
        locales: localesType,
        messages: messagesType,
        replacements: replacementsType,
        rich: richType,
      });
    }

    // Emit the concrete config block keyed by config id.
    appendConfigBlock(lines, {
      id: `"${entry.id}"`,
      locales: localesType,
      messages: messagesType,
      replacements: replacementsType,
      rich: richType,
    });
  }

  // ----------------------------------------------------------------------
  // Global declaration footer
  // ----------------------------------------------------------------------
  appendFooter(lines);

  return lines.join("\n");
}
