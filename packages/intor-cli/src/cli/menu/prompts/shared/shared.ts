import { select, isCancel, confirm, text, note } from "@clack/prompts";

// ------------------------------------------------------------------
// Mode
// ------------------------------------------------------------------
export async function promptMode(): Promise<"default" | "custom" | null> {
  const mode = await select({
    message: "Mode?",
    options: [
      { value: "default", label: "Default (recommended)" },
      { value: "custom", label: "Custom configuration" },
    ],
  });
  if (isCancel(mode)) return null;
  return mode;
}

// ------------------------------------------------------------------
// Format
// ------------------------------------------------------------------
export async function promptFormat(): Promise<"human" | "json" | null> {
  const format = await select({
    message: "Select output format",
    options: [
      { value: "human", label: "Human-readable" },
      { value: "json", label: "JSON (machine-readable)" },
    ],
    initialValue: "human",
  });
  if (isCancel(format)) return null;
  return format as "human" | "json";
}

// ------------------------------------------------------------------
// Output
// ------------------------------------------------------------------
export async function promptOutput(): Promise<string | undefined | null> {
  const writeToFile = await confirm({
    message: "Write output to a file?",
    initialValue: false,
  });
  if (isCancel(writeToFile)) return null;

  if (writeToFile) {
    const output = await text({
      message: "Output file path",
      placeholder: "check-report.json",
      defaultValue: "check-report.json",
    });
    if (isCancel(output)) return null;
    return output || undefined;
  }
  return undefined;
}

// ------------------------------------------------------------------
// Debug
// ------------------------------------------------------------------
export async function promptDebug(): Promise<boolean | null> {
  const debug = await confirm({
    message: "Enable debug mode?",
    initialValue: false,
  });
  if (isCancel(debug)) return null;
  return debug;
}

// ------------------------------------------------------------------
// Summary
// ------------------------------------------------------------------
export function printOptionsSummary(
  title: string,
  lines: Array<[string, string]>,
) {
  note(lines.map(([k, v]) => `${k}: ${v}`).join("\n"), title);
}
