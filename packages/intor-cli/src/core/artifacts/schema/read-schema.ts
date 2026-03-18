import type { GeneratedSchema } from "../types";
import fs from "node:fs/promises";
import path from "node:path";
import { DEFAULT_OUT_DIR, DEFAULT_SCHEMA_FILE_NAME } from "../../constants";

export async function readSchema(): Promise<GeneratedSchema> {
  const filePath = path.join(DEFAULT_OUT_DIR, DEFAULT_SCHEMA_FILE_NAME);

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
