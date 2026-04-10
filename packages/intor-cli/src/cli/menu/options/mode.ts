import { isCancel, select } from "@clack/prompts";
import { cancel } from "../utils/cancel";

export const modeOption = {
  /**
   * Prompt the interaction mode.
   */
  async prompt(): Promise<"default" | "custom"> {
    const mode = await select<"default" | "custom">({
      message: "Select a mode",
      options: [
        { value: "default", label: "Default" },
        { value: "custom", label: "Custom" },
      ],
    });
    if (isCancel(mode)) cancel();
    return mode;
  },
};
