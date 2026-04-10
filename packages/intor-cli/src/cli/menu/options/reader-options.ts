import type { ReaderOptions } from "../../../core";
import type { ExtraExt } from "../../../shared";
import { confirm, isCancel, multiselect, text } from "@clack/prompts";
import { cancel } from "../utils/cancel";

const CUSTOM_READER_PLACEHOLDER = "md=./reader-md.ts";

export const readerOptionsOption = {
  /**
   * Prompt the reader options.
   */
  async prompt(): Promise<ReaderOptions> {
    // --------------------------------------------------
    // Enable
    // --------------------------------------------------
    const enable = await confirm({
      message: "Enable additional message readers?",
      initialValue: false,
    });
    if (isCancel(enable)) cancel();
    if (!enable) return {};

    // --------------------------------------------------
    // Select built-in formats and/or custom reader
    // --------------------------------------------------
    const selected = await multiselect<ExtraExt | "custom">({
      message: "Select message readers",
      options: [
        { value: "md", label: "Markdown (.md)" },
        { value: "yaml", label: "YAML (.yaml)" },
        { value: "toml", label: "TOML (.toml)" },
        { value: "json5", label: "JSON5 (.json5)" },
        { value: "custom", label: "Custom reader" },
      ],
      required: false,
    });
    if (isCancel(selected)) cancel();

    const exts = selected.filter(
      (value): value is ExtraExt => value !== "custom",
    );
    let customReaders: Record<string, string> = {};

    // --------------------------------------------------
    // Custom reader mappings (ext=path)
    // --------------------------------------------------
    if (selected.includes("custom")) {
      const mapping = await text({
        message: "Custom reader mappings (ext=path, comma separated)",
        placeholder: CUSTOM_READER_PLACEHOLDER,
      });
      if (isCancel(mapping)) cancel();

      customReaders = Object.fromEntries(
        mapping
          .split(",")
          .map((pair) => pair.trim())
          .filter(Boolean)
          .map((pair) => {
            const [ext, path] = pair.split("=", 2);
            if (!ext || !path) {
              throw new Error(
                `Invalid custom reader entry: "${pair}". Expected <ext=path>.`,
              );
            }
            return [ext, path];
          }),
      );
    }

    return { exts, customReaders };
  },

  /**
   * Render the extension summary row.
   */
  extsSummary(value: ReaderOptions["exts"]) {
    return ["exts", value?.join(", ") ?? "(none)"] as const;
  },

  /**
   * Render the custom readers summary row.
   */
  customReadersSummary(value: ReaderOptions["customReaders"]) {
    const keys = Object.keys(value ?? {});
    return [
      "custom readers",
      keys.length ? keys.join(", ") : "(none)",
    ] as const;
  },
};
