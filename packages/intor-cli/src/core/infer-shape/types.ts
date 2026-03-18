/**
 * Result of a semantic inference step.
 *
 * - none: no meaningful type could be inferred (intentionally skipped)
 * - inferred: contains a concrete TypeScript type representation
 */

export type InferNode =
  | InferNoneNode
  | InferPrimitiveNode
  | InferArrayNode
  | InferObjectNode
  | InferRecordNode;

export interface InferNoneNode {
  kind: "none";
}

export interface InferPrimitiveNode {
  kind: "primitive";
  type: "string" | "number" | "boolean" | "null";
}

export interface InferArrayNode {
  kind: "array";
  element: InferNode;
}

export interface InferObjectNode {
  kind: "object";
  properties: Record<string, InferNode>;
}

export interface InferRecordNode {
  kind: "record";
}

export interface InferredShapes {
  messages: InferNode;
  replacements: InferNode;
  rich: InferNode;
}
