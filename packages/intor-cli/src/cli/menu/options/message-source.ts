import type { ConfigEntry } from "../../../core";
import type { MessageSource } from "../../../features";
import { confirm, isCancel, text } from "@clack/prompts";
import { cancel } from "../utils/cancel";

const DEFAULT_MESSAGE_FILE_PATH = "messages/en/index.json";

export const messageSourceOption = {
  /**
   * Prompt the message source.
   */
  async prompt(configEntries: ConfigEntry[]): Promise<MessageSource> {
    const isSingle = configEntries.length === 1;
    const sourceMode = isSingle ? "single" : "mapping";

    // --------------------------------------------------
    // Enable
    // --------------------------------------------------
    const enable = await confirm({
      message: "Provide message files instead of using the loader?",
      initialValue: false,
    });
    if (isCancel(enable)) cancel();
    if (!enable) return { mode: "none" };

    // --------------------------------------------------
    // Single mode
    // --------------------------------------------------
    if (sourceMode === "single") {
      const filePath = await text({
        message: "Path to the message file (default locale)",
        placeholder: DEFAULT_MESSAGE_FILE_PATH,
      });
      if (isCancel(filePath)) cancel();
      return { mode: "single", file: filePath };
    }

    // --------------------------------------------------
    // Mapping mode
    // --------------------------------------------------
    const files: Record<string, string> = {};

    for (const { config } of configEntries) {
      const filePath = await text({
        message: `Message file for config "${config.id}" (default locale)`,
        placeholder: DEFAULT_MESSAGE_FILE_PATH,
      });
      if (isCancel(filePath)) cancel();
      files[config.id] = filePath;
    }

    return { mode: "mapping", files };
  },

  /**
   * Render the message source summary row.
   */
  summary(value: MessageSource) {
    if (value.mode === "single") {
      return ["message files", value.file] as const;
    }

    if (value.mode === "mapping") {
      return [
        "message files",
        Object.entries(value.files)
          .map(([id, path]) => `${id}: ${path}`)
          .join(", "),
      ] as const;
    }

    return ["message files", "(loader)"] as const;
  },
};
