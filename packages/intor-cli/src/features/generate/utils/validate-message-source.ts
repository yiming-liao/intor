import type { ConfigEntry } from "../../../core";
import type { MessageSource } from "../types";

/**
 * Validate that the provided MessageSource is compatible with
 * the discovered Intor configs in the workspace.
 */
export function validateMessageSource(
  source: MessageSource,
  configEntries: ConfigEntry[],
) {
  if (source.mode === "none") return;

  const configIds = configEntries.map(({ config }) => config.id);
  const knownIds = new Set(configIds);

  // ----------------------------------------------------------
  // single mode: only allowed for single-config projects
  // ----------------------------------------------------------
  if (source.mode === "single") {
    if (configIds.length !== 1) {
      throw new Error(
        [
          "--message-file can only be used when exactly one Intor config is found.",
          "",
          "Detected configs:",
          ...configIds.map((id) => `  - ${id}`),
          "",
          "Use --message-files <configId=path> to provide messages per config.",
        ].join("\n"),
      );
    }
    return;
  }

  // ----------------------------------------------------------
  // mapping mode: all keys must refer to existing config ids
  // ----------------------------------------------------------
  if (source.mode === "mapping") {
    for (const id of Object.keys(source.files)) {
      if (knownIds.has(id)) continue;

      throw new Error(
        [
          `Unknown config id in --message-files: ${id}`,
          "",
          "Known config ids:",
          ...configIds.map((knownId) => `  - ${knownId}`),
        ].join("\n"),
      );
    }
  }
}
