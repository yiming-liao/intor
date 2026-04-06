import type { GeneratedSchema } from "../types";
import fs from "node:fs/promises";
import { DEFAULT_SCHEMA_FILE_PATH } from "../../constants";

export async function readSchema(): Promise<GeneratedSchema> {
  const filePath = DEFAULT_SCHEMA_FILE_PATH;

  let raw: string;

  // ------------------------------------------------------------------
  // Read file
  // ------------------------------------------------------------------
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    throw new Error(
      `Failed to read Intor schema file at "${filePath}".\n` +
        `Have you run "intor generate"?`,
    );
  }

  // ------------------------------------------------------------------
  // Parse JSON
  // ------------------------------------------------------------------
  try {
    return JSON.parse(raw) as GeneratedSchema;
  } catch {
    throw new Error(
      `Invalid JSON format in Intor schema file at "${filePath}".`,
    );
  }
}
