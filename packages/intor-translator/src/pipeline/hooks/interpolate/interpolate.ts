import type { MessageValue } from "../../../types";
import type { TranslateContext } from "../../types/context";
import { rura } from "rura";
import { replaceValues } from "./replace-values";

export const interpolate = rura.createHook<TranslateContext, MessageValue>(
  "interpolate",
  (ctx) => {
    const { rawMessage, formattedMessage, replacements } = ctx;
    const message = formattedMessage ?? rawMessage;

    // Interpolation applies only to string messages with replacement values.
    // Structural or function-based replacements are handled later.
    if (typeof message !== "string" || !replacements) {
      if (message !== undefined) {
        ctx.finalMessage = message;
      }
      return;
    }

    // Replace `{key}` placeholders with primitive values only.
    ctx.finalMessage = replaceValues(message, replacements);
  },
  600,
);
