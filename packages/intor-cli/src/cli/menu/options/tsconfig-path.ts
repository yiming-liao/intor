import { confirm, isCancel, text } from "@clack/prompts";
import { cancel } from "../utils/cancel";

const DEFAULT_TSCONFIG_PATH = "tsconfig.json";

export const tsconfigPathOption = {
  /**
   * Prompt the tsconfig path.
   */
  async prompt(): Promise<string> {
    const enable = await confirm({
      message: "Use a custom tsconfig file?",
      initialValue: false,
    });
    if (isCancel(enable)) cancel();
    if (!enable) return "";

    const path = await text({
      message: "Path to tsconfig file",
      placeholder: DEFAULT_TSCONFIG_PATH,
      defaultValue: DEFAULT_TSCONFIG_PATH,
    });
    if (isCancel(path)) cancel();
    return path;
  },

  /**
   * Render the tsconfig summary row.
   */
  summary(value?: string) {
    return ["tsconfig", value ?? DEFAULT_TSCONFIG_PATH] as const;
  },
};
