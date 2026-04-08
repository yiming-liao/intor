export const DIAGNOSTIC_MESSAGES = {
  // --------------------------------------------------
  // PreKey
  // --------------------------------------------------
  PRE_KEY_NOT_FOUND: {
    code: "INTOR_PRE_KEY_NOT_FOUND",
    message: () => "preKey does not exist",
  },

  // --------------------------------------------------
  // Message key
  // --------------------------------------------------
  KEY_NOT_FOUND: {
    code: "INTOR_KEY_NOT_FOUND",
    message: () => "key does not exist",
  },

  KEY_EMPTY: {
    code: "INTOR_KEY_EMPTY",
    message: () => "key cannot be empty",
  },

  // --------------------------------------------------
  // Replacements
  // --------------------------------------------------
  REPLACEMENTS_NOT_ALLOWED: {
    code: "INTOR_REPLACEMENTS_NOT_ALLOWED",
    message: () => "replacements are not allowed",
  },

  REPLACEMENTS_MISSING: {
    code: "INTOR_REPLACEMENTS_MISSING",
    message: (missing: string[]) =>
      `replacements missing: ${missing.join(", ")}`,
  },

  REPLACEMENTS_UNEXPECTED: {
    code: "INTOR_REPLACEMENTS_UNEXPECTED",
    message: (extra: string[]) =>
      `replacements unexpected: ${extra.join(", ")}`,
  },

  // --------------------------------------------------
  // Rich tags
  // --------------------------------------------------
  RICH_NOT_ALLOWED: {
    code: "INTOR_RICH_NOT_ALLOWED",
    message: () => "rich tags are not allowed",
  },

  RICH_MISSING: {
    code: "INTOR_RICH_MISSING",
    message: (missing: string[]) => `rich tags missing: ${missing.join(", ")}`,
  },

  RICH_UNEXPECTED: {
    code: "INTOR_RICH_UNEXPECTED",
    message: (extra: string[]) => `rich tags unexpected: ${extra.join(", ")}`,
  },
} as const;
