import type { CliOption } from "./options";
import type { CAC } from "cac";
import { features } from "../../constants";
import { discover } from "../../features";
import { options } from "./options";

export function registerDiscoverCommand(cli: CAC) {
  cli
    // -----------------------------------------------------------------------
    // Command
    // -----------------------------------------------------------------------
    .command(features.discover.name, features.discover.title)

    // -----------------------------------------------------------------------
    // Options
    // -----------------------------------------------------------------------
    .option(...options.debug)

    // -----------------------------------------------------------------------
    // Action
    // -----------------------------------------------------------------------
    .action(async (options: Pick<CliOption, "debug">) => {
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
