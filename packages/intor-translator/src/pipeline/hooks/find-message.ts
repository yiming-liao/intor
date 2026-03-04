import type { MessageValue } from "../../types";
import type { TranslateContext } from "../types/context";
import { rura } from "rura";
import { findMessageInLocales } from "../../shared/utils/find-message-in-locales";

export const findMessage = rura.createHook<TranslateContext, MessageValue>(
  "findMessage",
  (ctx) => {
    const found = findMessageInLocales({
      messages: ctx.messages,
      candidateLocales: ctx.candidateLocales,
      key: ctx.key,
    });

    if (found !== undefined) {
      ctx.rawMessage = found;
    }
  },
  200,
);
