import type { CliOptions } from "./options";
import type { CAC } from "cac";
import { discover } from "../../features";
import { FEATURES } from "../../shared";
import { options } from "./options";

export function registerDiscoverCommand(cli: CAC) {
  cli
    // -----------------------------------------------------------------------
    // Command
    // -----------------------------------------------------------------------
    .command(FEATURES.discover.name, FEATURES.discover.title)

    // -----------------------------------------------------------------------
    // Options
    // -----------------------------------------------------------------------
    .option(...options.debug)

    // -----------------------------------------------------------------------
    // Action
    // -----------------------------------------------------------------------
    .action(async (options: Pick<CliOptions, "debug">) => {
      const { debug } = options;

      try {
        await discover({
          ...(debug !== undefined ? { debug } : {}),
        });
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
      }
    });
}
