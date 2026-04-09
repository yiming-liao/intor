import type { ReaderOptions } from "../../../../core";
import type { ExtraExt } from "../../../../shared";
import { confirm, multiselect, text, isCancel } from "@clack/prompts";

type FormatOption = ExtraExt | "custom";

export async function promptReaderOptions(): Promise<ReaderOptions | null> {
  const enable = await confirm({
    message: "Enable additional message readers?",
    initialValue: false,
  });
  if (isCancel(enable)) return null;
  if (!enable) return { exts: [] };

  // --------------------------------------------------
  // Select built-in formats and/or custom reader
  // --------------------------------------------------
  const selected = await multiselect<FormatOption>({
    message: "Select message readers",
    options: [
      { value: "md", label: "Markdown (.md)" },
      { value: "yaml", label: "YAML (.yaml/.yml)" },
      { value: "toml", label: "TOML (.toml)" },
      { value: "json5", label: "JSON5 (.json5)" },
      { value: "custom", label: "Custom reader" },
    ],
    required: false,
  });
  if (isCancel(selected)) return null;

  // Extract built-in extensions
  const exts = selected.filter((v): v is ExtraExt => v !== "custom");

  let customReaders: Record<string, string> = {};

  // --------------------------------------------------
  // Custom reader mappings (ext=path)
  // --------------------------------------------------
  if (selected.includes("custom")) {
    const mapping = await text({
      message: "Custom reader mappings (ext=path, comma separated)",
      placeholder: "md=./reader-md.ts",
    });
    if (isCancel(mapping)) return null;

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
}
