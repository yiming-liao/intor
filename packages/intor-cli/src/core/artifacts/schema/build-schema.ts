import type { GeneratedSchema, SchemaEntry } from "../types";

export function buildSchema(
  entries: SchemaEntry[],
  toolVersion?: string,
): GeneratedSchema {
  return {
    version: 1,
    ...(toolVersion !== undefined ? { toolVersion } : {}),
    generatedAt: new Date().toISOString(),
    entries,
  };
}
