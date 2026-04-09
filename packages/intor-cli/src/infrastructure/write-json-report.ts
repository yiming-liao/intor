import { writeFile } from "node:fs/promises";

/**
 * Write a report as formatted JSON to file or stdout.
 */
export async function writeJsonReport<T>(
  report: T,
  output?: string,
): Promise<void> {
  // ---------------------------------------------------------------------------
  // Serialize the report as formatted JSON
  // ---------------------------------------------------------------------------
  const json = JSON.stringify(report, null, 2);

  // ---------------------------------------------------------------------------
  // Write to the target output
  // ---------------------------------------------------------------------------
  if (output) {
    await writeFile(output, json, "utf8");
  } else {
    console.log(json);
  }
}
