import type { InferredShapes } from "../infer-shape";

/**
 * Versioned schema artifact generated from inferred semantic shapes.
 */
export interface GeneratedSchema {
  version: number;
  toolVersion?: string;
  generatedAt: string;
  entries: SchemaEntry[];
}

/**
 * A schema entry representing the inferred result of a single Intor config.
 */
export interface SchemaEntry {
  id: string;
  locales: readonly string[];
  shapes: InferredShapes;
}
