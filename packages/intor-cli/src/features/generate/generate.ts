import type { GenerateOptions } from "./types";
import type { SchemaEntry, MergeOverrides } from "../../core";
import type { LocaleMessages, MessageObject } from "intor";
import { readFile } from "node:fs/promises";
import { features } from "../../constants";
import {
  discoverConfigs,
  collectMessages,
  inferShapes,
  DEFAULT_OUT_DIR,
  DEFAULT_TYPES_FILE_PATH,
  DEFAULT_SCHEMA_FILE_PATH,
  buildTypes,
  buildSchema,
} from "../../core";
import { ensureDirAndWriteFile } from "../../infrastructure";
import { br, renderConfigs, renderTitle } from "../../render";
import { spinner } from "../shared/spinner";
import { toRelativePath } from "../shared/to-relative-path";
import { renderOverrides } from "./render-overrides";
import { renderSummary } from "./render-summary";
import { resolveMessageSource } from "./utils/resolve-message-source";
import { validateMessageSource } from "./utils/validate-message-source";

export async function generate({
  messageSource = { mode: "none" },
  debug = false,
  toolVersion = "unknown",
  ...readerOptions
}: GenerateOptions) {
  renderTitle(features.generate.title);
  const start = performance.now();

  try {
    // -----------------------------------------------------------------------
    // Discover configs from the current workspace
    // -----------------------------------------------------------------------
    const configEntries = await discoverConfigs(debug);
    if (configEntries.length === 0) throw new Error("No Intor config found.");

    // Validate messageSource against discovered configs
    validateMessageSource(messageSource, configEntries);

    br();
    renderConfigs(configEntries, debug);
    br(1, debug);

    // -----------------------------------------------------------------------
    // Collect messages and infer schemas
    // -----------------------------------------------------------------------
    const schemaEntries: SchemaEntry[] = [];

    // Per-config message collection and schema inference
    for (const { config } of configEntries) {
      const { id, supportedLocales: locales } = config;

      let messages: LocaleMessages;
      let overrides: MergeOverrides[] = [];
      const messageFilePath = resolveMessageSource(messageSource, id);

      spinner.start();
      if (messageFilePath) {
        // ----------------------------------------------------------
        // File mode
        // ----------------------------------------------------------
        const content = await readFile(messageFilePath, "utf8");
        const parsed = JSON.parse(content) as MessageObject;
        messages = { [config.defaultLocale]: parsed };
      } else {
        // ----------------------------------------------------------
        // Runtime mode (default)
        // ----------------------------------------------------------
        const result = await collectMessages(
          config.defaultLocale,
          config,
          readerOptions,
        );
        messages = result.messages;
        overrides = result.overrides.filter((o) => o.kind === "override");
      }
      spinner.stop();

      if (overrides.length > 0) renderOverrides(config.id, overrides, debug);

      const shapes = inferShapes(messages[config.defaultLocale] ?? {});
      schemaEntries.push({ id, locales, shapes });
    }

    // -----------------------------------------------------------------------
    // Build artifacts and write output
    // -----------------------------------------------------------------------
    const generatedTypes = buildTypes(schemaEntries);
    const generatedSchema = buildSchema(schemaEntries, toolVersion);

    // Write files
    spinner.start();
    await ensureDirAndWriteFile(DEFAULT_TYPES_FILE_PATH, generatedTypes);
    await ensureDirAndWriteFile(DEFAULT_SCHEMA_FILE_PATH, generatedSchema);
    spinner.stop();

    const duration = performance.now() - start;
    renderSummary(toRelativePath(DEFAULT_OUT_DIR), duration, true);
  } catch (error) {
    spinner.stop();
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
