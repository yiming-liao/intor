import type { RichReplacement } from "../../../types/message-structure-types";

// Translator handlers
export type TranslatorHandlers<MF = unknown, MK = unknown, PH = unknown> = {
  messageFormatter?: MessageFormatter<MF>;
  loadingMessageHandler?: LoadingMessageHandler<MK>;
  placeholderHandler?: PlaceholderHandler<PH>;
};

export type MessageFormatter<ReturnType = unknown> = (
  ctx: Omit<TranslatorHandlerContext, "message"> & { message: string },
) => ReturnType;

export type LoadingMessageHandler<ReturnType = unknown> = (
  ctx: TranslatorHandlerContext,
) => ReturnType;

export type PlaceholderHandler<ReturnType = unknown> = (
  ctx: TranslatorHandlerContext,
) => ReturnType;

export type TranslatorHandlerContext = {
  message?: string;
  locale: string;
  key?: string;
  replacements?: RichReplacement;
  params?: Record<string, unknown>;
};
