import type { Format } from "../../../shared";
import { isCancel, select } from "@clack/prompts";
import { cancel } from "../utils/cancel";

export const formatOption = {
  /**
   * Prompt the output format.
   */
  async prompt(): Promise<Format> {
    const format = await select<Format>({
      message: "Choose an output format",
      options: [
        { value: "human", label: "Human-readable" },
        { value: "json", label: "JSON (machine-readable)" },
      ],
      initialValue: "human",
    });
    if (isCancel(format)) cancel();
    return format;
  },

  /**
   * Render the format summary row.
   */
  summary(value: Format) {
    return ["format", value] as const;
  },
};
