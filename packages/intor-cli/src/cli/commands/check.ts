import type { CliOption } from "./options";
import type { CAC } from "cac";
import { features } from "../../constants";
import { check } from "../../features";
import { options } from "./options";

export function registerCheckCommand(cli: CAC) {
  cli
    // -----------------------------------------------------------------------
    // Command
    // -----------------------------------------------------------------------
    .command(features.check.name, features.check.title)

    // -----------------------------------------------------------------------
    // Options
    // -----------------------------------------------------------------------
    .option(...options.debug)
    .option(...options.tsconfig)
    .option(...options.format)
    .option(...options.output)

    // -----------------------------------------------------------------------
    // Action
    // -----------------------------------------------------------------------
    .action(
      async (
        options: Pick<CliOption, "debug" | "tsconfig" | "format" | "output">,
      ) => {
        const { debug, tsconfig, format, output } = options;

        try {
          await check({
            ...(debug !== undefined ? { debug } : {}),
            ...(tsconfig !== undefined ? { tsconfigPath: tsconfig } : {}),
            ...(format !== undefined ? { format } : {}),
            ...(output !== undefined ? { output } : {}),
          });
        } catch (error) {
          console.error(error instanceof Error ? error.message : error);
          process.exitCode = 1;
        }
      },
    );
}
