import type { ConfigEntry } from "./core";
import pc from "picocolors";
import { toRelativePath } from "./features/shared/to-relative-path";
import { createLogger } from "./logger";

// Formatting utilities
export const dim = pc.dim;
export const cyan = pc.cyan;
export const green = pc.green;
export const bold = pc.bold;
export const italic = pc.italic;
export const gray = pc.gray;
export const yellow = pc.yellow;
export const red = pc.red;
export const bgBlack = pc.bgBlack;

// Layout helpers
export function br(count = 1, enabled = true) {
  if (!enabled) return;
  for (let i = 0; i < count; i++) console.log();
}

// Render feature title
export function renderTitle(title = "", enabled = true) {
  if (!enabled) return;
  console.log(" " + bgBlack(` ${title} `));
}

// Render discovered Intor configs
export function renderConfigs(configEntries: ConfigEntry[], enabled = true) {
  if (!enabled) return;
  const logger = createLogger();

  // Log header
  logger.header(`Discovered ${yellow(configEntries.length)} Intor config(s):`, {
    lineBreakAfter: 1,
  });

  for (const { filePath, config } of configEntries) {
    logger.log(`${cyan(config.id)}  ${dim(`⚲ ${toRelativePath(filePath)}`)}`);
  }

  // Log footer
  logger.footer("", { lineBreakBefore: 1 });
}

// Render schema-not-found message for config
export function renderMissingConfigSchema(configId: string, enabled = true) {
  if (!enabled) return;
  const logger = createLogger();

  br();
  logger.error(
    cyan(configId) +
      `: schema not found, run ${italic("intor generate")} and retry`,
  );
}
