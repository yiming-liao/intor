import type { GeneratedSchema, SchemaEntry } from "../types";
import { sortKeysDeep } from "../sort-keys-deep";

const VERSION = 1;

export function buildSchema(
  entries: SchemaEntry[],
  toolVersion: string,
): string {
  const generatedSchema: GeneratedSchema = {
    version: VERSION,
    toolVersion,
    entries,
  };

  return JSON.stringify(sortKeysDeep(generatedSchema), null, 2);
}
