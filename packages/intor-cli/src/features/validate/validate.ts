import type {
  MissingReport,
  MissingRequirementsByLocale,
  ValidateOptions,
} from "./types";
import { features } from "../../constants";
import { discoverConfigs, readSchema } from "../../core";
import { collectNonDefaultLocaleMessages } from "../../core";
import { renderMissingConfigSchema, renderTitle } from "../../render";
import { spinner } from "../shared/spinner";
import { writeJsonReport } from "../shared/write-json-report";
import { collectMissingRequirements } from "./missing/collect-missing-requirements";
import { renderConfigSummary } from "./render-config-summary";

export async function validate({
  format = "human",
  output,
  debug,
  ...readerOptions
}: ValidateOptions) {
  const isHuman = format === "human";
  renderTitle(features.validate.title, isHuman);

  // -----------------------------------------------------------------------
  // Discover configs from the current workspace
  // -----------------------------------------------------------------------
  const configEntries = await discoverConfigs(debug);
  if (configEntries.length === 0) throw new Error("No Intor config found.");

  try {
    // ---------------------------------------------------------------------
    // Read generated schema
    // ---------------------------------------------------------------------
    const schema = await readSchema();
    const report: MissingReport = {};

    // Per-config processing
    for (const { config } of configEntries) {
      const schemaConfig = schema.entries.find((c) => c.id === config.id);
      if (!schemaConfig) {
        renderMissingConfigSchema(config.id, isHuman);
        continue;
      }
      const { shapes } = schemaConfig;

      // -------------------------------------------------------------------
      // Load all non-default locale messages
      // -------------------------------------------------------------------
      if (isHuman) spinner.start();
      const localeMessages = await collectNonDefaultLocaleMessages(
        config,
        readerOptions,
      );
      if (isHuman) spinner.stop();

      // -------------------------------------------------------------------
      // Collect missing requirements per locale
      // -------------------------------------------------------------------
      const missingByLocale: MissingRequirementsByLocale = {};
      for (const locale of config.supportedLocales) {
        if (locale === config.defaultLocale) continue;
        const messages = localeMessages[locale];
        if (!messages) continue;
        missingByLocale[locale] = collectMissingRequirements(shapes, messages);
      }

      report[config.id] = missingByLocale;
      renderConfigSummary(config.id, missingByLocale, isHuman);
    }

    if (format === "json") await writeJsonReport(report, output);
  } catch (error) {
    if (isHuman) spinner.stop();
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
