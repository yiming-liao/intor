import fs from "node:fs/promises";
import path from "node:path";

export async function ensureAndWrite(
  filePath: string,
  content: string,
): Promise<string> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
  return filePath;
}
