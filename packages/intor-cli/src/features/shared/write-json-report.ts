import { writeFile } from "node:fs/promises";

/**
 * Write a report as formatted JSON.
 * - If output is provided, write to file
 * - Otherwise, write to stdout
 */
export async function writeJsonReport<T>(
  report: T,
  output?: string,
): Promise<void> {
  const json = JSON.stringify(report, null, 2);

  if (output) {
    await writeFile(output, json, "utf8");
  } else {
    console.log(json);
  }
}
