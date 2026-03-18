import type { CheckOptions, CheckReport } from "./types";
import { features } from "../../constants";
import { extractUsages, readSchema } from "../../core";
import { loadSourceFiles } from "../../core/scan";
import { renderTitle } from "../../render";
import { spinner } from "../shared/spinner";
import { writeJsonReport } from "../shared/write-json-report";
import { buildScopeUsages } from "./build-scoped-usages";
import { collectDiagnostics, groupDiagnostics } from "./diagnostics";
import { renderConfigSummary } from "./render-config-summary";

export async function check({
  tsconfigPath = "tsconfig.json",
  format = "human",
  output,
  debug,
}: CheckOptions) {
  const isHuman = format === "human";
  renderTitle(features.check.title, isHuman);

  try {
    // Read generated schema
    if (isHuman) spinner.start();
    const schema = await readSchema();
    if (isHuman) spinner.stop();

    const firstEntry = schema.entries.at(0);
    if (!firstEntry) {
      throw new Error(
        "No generated config schema found. Run `intor generate` first.",
      );
    }

    // Load source files
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

    // Extract usages from source files
    const usages = extractUsages({
      sourceFiles,
      ...(debug !== undefined ? { debug } : {}),
    });

    // Use first config's id as default key
    const defaultConfigKey = firstEntry.id;

    const report: CheckReport = { configs: [] };

    // Per-config processing
    for (const config of schema.entries) {
      const configKey = config.id;

      // per-config usages
      const scopedUsages = buildScopeUsages({
        usages,
        defaultConfigKey,
        configKey,
      });

      // Diagnostic
      const diagnostics = collectDiagnostics(config.shapes, scopedUsages);
      report.configs.push({ id: config.id, diagnostics });
      renderConfigSummary(config.id, groupDiagnostics(diagnostics), isHuman);
    }

    // JSON output
    if (format === "json") await writeJsonReport(report, output);
  } catch (error) {
    if (isHuman) spinner.stop();
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
