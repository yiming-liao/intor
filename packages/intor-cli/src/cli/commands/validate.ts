import type { CliOptions } from "./options";
import type { CAC } from "cac";
import { validate } from "../../features";
import { FEATURES } from "../../shared";
import { options } from "./options";
import { normalizeReaderOptions } from "./utils/normalize-reader-options";

export function registerValidateCommand(cli: CAC) {
  cli
    // -----------------------------------------------------------------------
    // Command
    // -----------------------------------------------------------------------
    .command(FEATURES.validate.name, FEATURES.validate.title)

    // -----------------------------------------------------------------------
    // Option
    // -----------------------------------------------------------------------
    .option(...options.debug)
    .option(...options.ext)
    .option(...options.reader)
    .option(...options.format)
    .option(...options.output)

    // -----------------------------------------------------------------------
    // Action
    // -----------------------------------------------------------------------
    .action(
      async (
        options: Pick<
          CliOptions,
          "debug" | "ext" | "reader" | "format" | "output"
        >,
      ) => {
        const { debug, format, output, ...rawReaderOptions } = options;

        try {
          const readerOptions = normalizeReaderOptions(rawReaderOptions);

          await validate({
            ...(debug !== undefined ? { debug } : {}),
            ...(format !== undefined ? { format } : {}),
            ...(output !== undefined ? { output } : {}),
            ...readerOptions,
          });
        } catch (error) {
          console.error(error instanceof Error ? error.message : error);
          process.exitCode = 1;
        }
      },
    );
}
