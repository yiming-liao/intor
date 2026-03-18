import type { MessageSource } from "../../../features";
import { toArray } from "./to-array";

/**
 * Normalize message file CLI options into a MessageSource.
 */
export function normalizeMessageFiles(
  messageFile?: string,
  messageFiles?: string | string[],
): MessageSource {
  const messageFileList = toArray(messageFiles);

  if (messageFile && messageFileList.length > 0) {
    throw new Error(
      "Cannot use --message-file and --message-files at the same time.",
    );
  }

  // --------------------------------------------------
  // single mode
  // --------------------------------------------------
  if (messageFile) {
    return {
      mode: "single",
      file: messageFile,
    };
  }

  // --------------------------------------------------
  // mapping mode
  // --------------------------------------------------
  if (messageFileList.length > 0) {
    const files: Record<string, string> = {};

    for (const entry of messageFileList) {
      const [id, path] = entry.split("=", 2);
      if (!id || !path) {
        throw new Error(
          `Invalid --message-files entry: "${entry}". Each entry must be in the form: <configId=path>`,
        );
      }
      files[id] = path;
    }

    return {
      mode: "mapping",
      files,
    };
  }

  return { mode: "none" };
}
