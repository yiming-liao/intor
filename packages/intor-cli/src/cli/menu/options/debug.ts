import { confirm, isCancel } from "@clack/prompts";
import { cancel } from "../utils/cancel";

export const debugOption = {
  /**
   * Prompt the debug flag.
   */
  async prompt(): Promise<boolean> {
    const enable = await confirm({
      message: "Enable debug mode?",
      initialValue: false,
    });
    if (isCancel(enable)) cancel();
    return enable;
  },

  /**
   * Render the debug summary row.
   */
  summary(value: boolean) {
    return ["debug", value ? "on" : "off"] as const;
  },
};
