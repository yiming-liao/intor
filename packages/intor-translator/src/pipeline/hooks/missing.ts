import type { MessageValue } from "../../types";
import type { TranslateContext } from "../types/context";
import { rura } from "rura";
import { makeHandlerContext } from "../utils/make-handler-context";

export const missing = rura.createHook<TranslateContext, MessageValue>(
  "missing",
  (ctx) => {
    const { config, key, rawMessage } = ctx;
    if (rawMessage !== undefined) return;

    // Use custom handler if provided
    const { missingHandler } = config.handlers ?? {};
    if (missingHandler) {
      return {
        early: true,
        output: missingHandler(makeHandlerContext(ctx)),
      };
    }

    // Static message
    const { missingMessage } = config;
    if (missingMessage !== undefined) {
      return { early: true, output: missingMessage };
    }

    // Fallback to key
    return { early: true, output: key };
  },
  400,
);
