import type { MessageValue } from "../../types";
import type { TranslateContext } from "../types/context";
import { rura } from "rura";
import { makeHandlerContext } from "../utils/make-handler-context";

export const loading = rura.createHook<TranslateContext, MessageValue>(
  "loading",
  (ctx) => {
    const { config, isLoading } = ctx;
    if (!isLoading) return;

    // Use custom handler if provided
    const { loadingHandler } = config.handlers ?? {};
    if (loadingHandler) {
      return {
        early: true,
        output: loadingHandler(makeHandlerContext(ctx)),
      };
    }

    // Static message
    const { loadingMessage } = config;
    if (loadingMessage !== undefined) {
      return { early: true, output: loadingMessage };
    }

    return undefined;
  },
  300,
);
