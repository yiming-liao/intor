import type { ReaderOptions } from "../types";
import type { MessagesReaders } from "intor";
import { getBuiltInReaders } from "./built-in-readers";
import { resolveReaderModule } from "./resolve-reader-module";

export async function getReaders({ exts = [], customReaders }: ReaderOptions) {
  const resolvedCustomReaders: MessagesReaders = {};

  for (const [ext, filePath] of Object.entries(customReaders ?? {})) {
    const resolved = await resolveReaderModule({ filePath });
    if (resolved) resolvedCustomReaders[ext] = resolved;
  }

  return { ...getBuiltInReaders(exts), ...resolvedCustomReaders };
}
