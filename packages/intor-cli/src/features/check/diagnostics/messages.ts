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

  REPLACEMENTS_UNUSED: {
    code: "INTOR_REPLACEMENTS_UNUSED",
    message: (extra: string[]) => `replacements unused: ${extra.join(", ")}`,
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

  RICH_UNUSED: {
    code: "INTOR_RICH_UNUSED",
    message: (extra: string[]) => `rich tags unused: ${extra.join(", ")}`,
  },
} as const;
