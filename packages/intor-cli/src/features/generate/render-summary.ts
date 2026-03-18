import { createLogger } from "../../logger";
import { gray, italic, green, bold } from "../../render";

export function renderSummary(
  outDir: string,
  duration: number, // ms
  enabled = true,
) {
  const logger = createLogger(enabled);

  // Log header
  logger.header(bold(green("✔ intor generate completed")), {
    lineBreakAfter: 1,
  });

  logger.log(gray("Output directory: ".padEnd(18)) + outDir);

  const fomattedDuration = (duration / 1000).toFixed(2);
  logger.log(gray("Time elapsed: ".padEnd(18)) + `${fomattedDuration}s`);

  // Log footer
  logger.footer(
    italic(gray("Remember to include ")) +
      ".intor/**/*.d.ts" +
      italic(gray(" in your tsconfig.json ")),
    { lineBreakBefore: 1 },
  );
}
