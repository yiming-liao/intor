import type { SchemaEntry } from "../../types";
import { appendHeader, appendConfigBlock, appendFooter } from "./output";
import { normalizeRichInferNode } from "./utils/normalize-rich-infer-node";
import { renderInferNode } from "./utils/render-infer-node";

const GENERATED_INTERFACE_NAME = "IntorGeneratedTypes";

/**
 * Builds the global TypeScript declaration from inferred typegen inputs.
 */
export function buildTypes(schemaEntries: SchemaEntry[]): string {
  const lines: string[] = [];

  // Global declaration header
  appendHeader(lines, GENERATED_INTERFACE_NAME);

  // Per-config processing
  for (const [index, entry] of schemaEntries.entries()) {
    const localesType = entry.locales.map((l) => `"${l}"`).join(" | ");

    const messagesType = renderInferNode(entry.shapes.messages);
    const replacementsType = renderInferNode(entry.shapes.replacements);
    const richType = renderInferNode(normalizeRichInferNode(entry.shapes.rich));

    if (index === 0) {
      appendConfigBlock(lines, {
        id: "__default__",
        locales: localesType,
        messages: messagesType,
        replacements: replacementsType,
        rich: richType,
      });
    }

    appendConfigBlock(lines, {
      id: `"${entry.id}"`,
      locales: localesType,
      messages: messagesType,
      replacements: replacementsType,
      rich: richType,
    });
  }

  // Global declaration footer
  appendFooter(lines);

  return lines.join("\n");
}
