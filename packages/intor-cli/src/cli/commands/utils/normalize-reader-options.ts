import type { ReaderOptions } from "../../../core";
import type { ExtraExt } from "../../../shared";
import type { CliOptions } from "../options/options";
import { toArray } from "./to-array";

/**
 * Normalize CLI reader-related options
 */
export function normalizeReaderOptions({
  ext,
  reader,
}: Pick<CliOptions, "ext" | "reader">): ReaderOptions {
  const exts = toArray<ExtraExt>(ext);
  const readerList = toArray(reader);

  // Normalize custom readers
  const customReaders: Record<string, string> = {};

  if (readerList.length > 0) {
    for (const item of readerList) {
      const [key, value] = item.split("=", 2);
      if (!key || !value) {
        throw new Error(
          `Invalid --reader entry: "${item}". Each entry must be in the form: <ext=path>`,
        );
      }

      customReaders[key] = value;
    }
  }

  return {
    exts,
    customReaders,
  };
}
