import type { Diagnostic } from "./diagnostics";
import { extractUsages } from "../../core";
import { prepareSchema } from "../../core";
import { writeJsonReport } from "../../infrastructure";
import { renderTitle } from "../../shared";
import { FEATURES } from "../../shared";
import { spinner } from "../../shared/log/spinner";
import { collectDiagnostics, groupDiagnostics } from "./diagnostics";
import { filterUsagesByConfig } from "./filter-usages-by-config";
import { loadSourceFiles } from "./load-source-files";
import { renderConfigSummary } from "./render-config-summary";

export interface CheckOptions {
  tsconfigPath?: string;
  format?: "human" | "json";
  output?: string;
  debug?: boolean;
}

export async function check({
  tsconfigPath = "tsconfig.json",
  format = "human",
  output,
  debug = false,
}: CheckOptions) {
  const isHuman = format === "human";
  renderTitle(FEATURES.check.title, isHuman);

  try {
    // ---------------------------------------------------------------------
    // Prepares and validates generated schema
    // ---------------------------------------------------------------------
    if (isHuman) spinner.start();
    const { schemaEntries, defaultEntry } = await prepareSchema();
    if (isHuman) spinner.stop();

    // ---------------------------------------------------------------------------
    // Load source files from a tsconfig
    // ---------------------------------------------------------------------------
    const sourceFiles = loadSourceFiles(tsconfigPath, debug);
    if (sourceFiles.length === 0) {
      throw new Error(
        [
          "No source files found.",
          "",
          "Check the following:",
          "  - tsconfig.json path",
          "  - project root",
          "  - included source patterns",
        ].join("\n"),
      );
    }

    // ---------------------------------------------------------------------------
    // Extract usages from source files
    // ---------------------------------------------------------------------------
    const usages = extractUsages({
      sourceFiles,
      debug,
    });

    // ---------------------------------------------------------------------------
    // Collect diagnostics per config
    // ---------------------------------------------------------------------------
    const report: {
      configs: Array<{ id: string; diagnostics: Diagnostic[] }>;
    } = { configs: [] };

    for (const { id, shapes } of schemaEntries) {
      const scopedUsages = filterUsagesByConfig({
        usages,
        defaultConfigKey: defaultEntry.id,
        configKey: id,
      });
      const diagnostics = collectDiagnostics(shapes, scopedUsages);

      // Render a grouped human summary for the current config.
      const grouped = groupDiagnostics(diagnostics);
      renderConfigSummary(id, grouped, isHuman);

      report.configs.push({ id, diagnostics });
    }

    // ---------------------------------------------------------------------------
    // Write JSON report when requested
    // ---------------------------------------------------------------------------
    if (format === "json") await writeJsonReport(report, output);
  } catch (error) {
    if (isHuman) spinner.stop();
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
