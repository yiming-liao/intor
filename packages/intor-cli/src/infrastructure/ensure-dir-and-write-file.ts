import fs from "node:fs/promises";
import path from "node:path";

/**
 * Ensure the target directory exists before writing a file.
 */
export async function ensureDirAndWriteFile(
  filePath: string,
  content: string,
): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
}
