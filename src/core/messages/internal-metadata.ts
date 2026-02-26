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

  const kind = (value as Record<string, unknown>)[INTOR_MESSAGES_KIND_KEY];

  return typeof kind === "string" &&
    Object.values(INTOR_MESSAGES_KIND).includes(kind as IntorMessagesKind)
    ? (kind as IntorMessagesKind)
    : undefined;
}
