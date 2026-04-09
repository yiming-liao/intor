import type { MissingReport, MissingByLocale } from "./types";
import { discoverConfigs, type ReaderOptions } from "../../core";
import { collectNonDefaultLocaleMessages } from "../../core";
import { prepareSchema } from "../../core";
import { writeJsonReport } from "../../infrastructure";
import { renderTitle } from "../../shared";
import { FEATURES } from "../../shared";
import { spinner } from "../../shared/log/spinner";
import { collectMissing } from "./missing";
import { renderConfigSummary } from "./render-config-summary";

export interface ValidateOptions extends ReaderOptions {
  format?: "human" | "json";
  output?: string;
  debug?: boolean;
}

export async function validate({
  format = "human",
  output,
  debug = false,
  ...readerOptions
}: ValidateOptions) {
  const isHuman = format === "human";
  renderTitle(FEATURES.validate.title, isHuman);

  // -----------------------------------------------------------------------
  // Discover configs from the current workspace
  // -----------------------------------------------------------------------
  const configEntries = await discoverConfigs(debug);
  if (configEntries.length === 0) throw new Error("No Intor config found.");

  try {
    // ---------------------------------------------------------------------
    // Prepares and validates generated schema
    // ---------------------------------------------------------------------
    if (isHuman) spinner.start();
    const ids = configEntries.map((e) => e.config.id);
    const { schemaEntries } = await prepareSchema(ids);
    if (isHuman) spinner.stop();

    const report: MissingReport = {};

    // Per-config processing
    for (const { config } of configEntries) {
      const { shapes } = schemaEntries.find((c) => c.id === config.id)!;

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
      // Collect missing per locale
      // -------------------------------------------------------------------
      const missingByLocale: MissingByLocale = {};

      // Per-locale processing
      for (const locale of config.supportedLocales) {
        if (locale === config.defaultLocale) continue;

        const messages = localeMessages[locale];
        if (!messages) continue;

        missingByLocale[locale] = collectMissing(shapes, messages);
      }

      // Render a grouped human summary for the current config.
      renderConfigSummary(config.id, missingByLocale, isHuman);

      report[config.id] = missingByLocale;
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
