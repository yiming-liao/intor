export const INTOR_PREFIX = "__intor_";

export const INTOR_MESSAGES_KIND_KEY = `${INTOR_PREFIX}kind`;

export const INTOR_MESSAGES_KIND = {
  markdown: "markdown",
} as const;

export type IntorMessagesKind =
  (typeof INTOR_MESSAGES_KIND)[keyof typeof INTOR_MESSAGES_KIND];

/**
 * Read the Intor internal kind from a message container.
 */
export function getMessagesKind(value: unknown): IntorMessagesKind | undefined {
  if (!value || typeof value !== "object") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (value as any)[INTOR_MESSAGES_KIND_KEY];
}
