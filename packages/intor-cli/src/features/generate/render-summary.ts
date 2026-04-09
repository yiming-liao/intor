import { createLogger } from "../../shared";
import { gray, italic, green, bold } from "../../shared";

export function renderSummary(
  outDir: string,
  duration: number, // ms
  enabled = true,
) {
  const logger = createLogger(enabled);

  // ---------------------------------------------------------------------------
  // Render the summary header
  // ---------------------------------------------------------------------------
  logger.header(bold(green("✔ intor generate completed")), {
    lineBreakAfter: 1,
  });

  // ---------------------------------------------------------------------------
  // Render the summary body
  // ---------------------------------------------------------------------------
  logger.log(gray("Output directory: ".padEnd(18)) + outDir);

  const fomattedDuration = (duration / 1000).toFixed(2);
  logger.log(gray("Time elapsed: ".padEnd(18)) + `${fomattedDuration}s`);

  // ---------------------------------------------------------------------------
  // Render the summary footer
  // ---------------------------------------------------------------------------
  logger.footer(
    italic(gray("Remember to include ")) +
      ".intor/**/*.d.ts" +
      italic(gray(" in your tsconfig.json ")),
    { lineBreakBefore: 1 },
  );
}
