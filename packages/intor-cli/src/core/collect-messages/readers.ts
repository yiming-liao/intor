import type { ExtraExt } from "../../core/constants";
import type { MessagesReader, MessagesReaders } from "intor";
import { json5Reader } from "@intor/reader-json5";
import { mdReader } from "@intor/reader-md";
import { tomlReader } from "@intor/reader-toml";
import { yamlReader } from "@intor/reader-yaml";

export const BUILTIN_READERS: Record<ExtraExt, MessagesReader> = {
  md: mdReader,
  yaml: yamlReader,
  toml: tomlReader,
  json5: json5Reader,
};

export const getBuiltInReaders = (
  exts: readonly ExtraExt[],
): MessagesReaders => {
  // Map to [ext, reader]
  const entries = exts
    .map((ext) => {
      const reader = BUILTIN_READERS[ext];
      return reader ? [ext, reader] : null;
    })
    .filter((e): e is [ExtraExt, MessagesReader] => e !== null);

  // Entries to object
  return Object.fromEntries(entries);
};
