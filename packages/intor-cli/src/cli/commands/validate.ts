import type { CliOptions } from "./options/options";
import type { CAC } from "cac";
import { features } from "../../constants";
import { validate } from "../../features";
import { options } from "./options";
import { normalizeReaderOptions } from "./utils/normalize-reader-options";

export function registerValidateCommand(cli: CAC) {
  cli
    // -----------------------------------------------------------------------
    // Command
    // -----------------------------------------------------------------------
    .command(features.validate.name, features.validate.title)

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
        const { debug, format, output, ...readerOptions } = options;

        const { exts, customReaders } = normalizeReaderOptions(readerOptions);

        try {
          await validate({
            ...(debug !== undefined ? { debug } : {}),
            ...(format !== undefined ? { format } : {}),
            ...(output !== undefined ? { output } : {}),
            ...(exts !== undefined ? { exts } : {}),
            ...(customReaders !== undefined ? { customReaders } : {}),
          });
        } catch (error) {
          console.error(error instanceof Error ? error.message : error);
          process.exitCode = 1;
        }
      },
    );
}
