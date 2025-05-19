import type { RichReplacement } from "../../../types/message-structure-types";

// Translator handlers
export type TranslatorHandlers<MF = unknown, MK = unknown, PH = unknown> = {
  messageFormatter?: MessageFormatter<MF>;
  loadingMessageHandler?: LoadingMessageHandler<MK>;
  placeholderHandler?: PlaceholderHandler<PH>;
};

/**
 * Custom formatter for translation messages.
 *
 * You can use this to integrate ICU libraries like `intl-messageformat`.
 *
 * @param ctx - Context object containing:
 * - `message` (string): The raw message string to format.
 * - `locale` (string): Current active locale.
 * - `key` (string | undefined): The message key, if provided.
 * - `replacements` (object | undefined): Replacement values for variables in the message.
 *
 * @returns The formatted message, usually a string.
 */
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
