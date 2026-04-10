import { confirm, isCancel, text } from "@clack/prompts";
import { cancel } from "../utils/cancel";

const DEFAULT_OUTPUT_PATH = "report.json";

export const outputOption = {
  /**
   * Prompt the output path.
   */
  async prompt(): Promise<string> {
    const enable = await confirm({
      message: "Write the output to a file?",
      initialValue: false,
    });
    if (isCancel(enable)) return cancel();
    if (!enable) return "";

    const output = await text({
      message: "Output file path",
      placeholder: DEFAULT_OUTPUT_PATH,
      defaultValue: DEFAULT_OUTPUT_PATH,
    });
    if (isCancel(output)) return cancel();
    return output;
  },

  /**
   * Render the output summary row.
   */
  summary(value?: string) {
    return ["output", value ?? "stdout"] as const;
  },
};
