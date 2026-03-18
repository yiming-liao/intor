import type { CliOption } from "./options";
import type { CAC } from "cac";
import { features } from "../../constants";
import { generate } from "../../features";
import { VERSION } from "../version";
import { options } from "./options";
import { normalizeMessageFiles } from "./utils/normalize-message-files";
import { normalizeReaderOptions } from "./utils/normalize-reader-options";

export function registerGenerateCommand(cli: CAC) {
  cli
    // -----------------------------------------------------------------------
    // Command
    // -----------------------------------------------------------------------
    .command(features.generate.name, features.generate.title)

    // -----------------------------------------------------------------------
    // Option
    // -----------------------------------------------------------------------
    .option(...options.debug)
    .option(...options.messageFile)
    .option(...options.messageFiles)
    .option(...options.ext)
    .option(...options.reader)

    // -----------------------------------------------------------------------
    // Action
    // -----------------------------------------------------------------------
    .action(
      async (
        options: Pick<
          CliOption,
          "debug" | "messageFile" | "messageFiles" | "ext" | "reader"
        >,
      ) => {
        const { debug, messageFile, messageFiles, ...readerOptions } = options;

        const result = normalizeMessageFiles(messageFile, messageFiles);
        const { exts, customReaders } = normalizeReaderOptions(readerOptions);

        try {
          await generate({
            ...(debug !== undefined ? { debug } : {}),
            messageSource: result,
            ...(exts !== undefined ? { exts } : {}),
            ...(customReaders !== undefined ? { customReaders } : {}),
            toolVersion: VERSION,
          });
        } catch (error) {
          console.error(error instanceof Error ? error.message : error);
          process.exitCode = 1;
        }
      },
    );
}
