import type { InferNode } from "../../../../infer-shape";
import { indent } from "./indent";

export function renderInferNode(node: InferNode, indentLevel = 4): string {
  switch (node.kind) {
    case "none": {
      return "unknown";
    }
    case "primitive": {
      return node.type;
    }
    case "array": {
      return `${renderInferNode(node.element, indentLevel)}[]`;
    }
    case "record": {
      // Rich leaf nodes must be non-indexable to preserve
      // key narrowing and autocomplete behavior
      return "Record<string, never>";
    }
    case "object": {
      return `{
${Object.entries(node.properties)
  .map(
    ([k, v]) =>
      `${indent(indentLevel)}  "${k}": ${renderInferNode(v, indentLevel + 1)};`,
  )
  .join("\n")}
${indent(indentLevel)}}`;
    }
  }
}
