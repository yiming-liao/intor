import { IntorError, IntorErrorCode } from "@/core";

/**
 * Validates that the given id is a non-empty string.
 *
 * Fails fast if the id is empty or whitespace-only.
 */
export const validateId = (id: string): string => {
  if (id.trim() === "") {
    throw new IntorError({
      id,
      code: IntorErrorCode.INVALID_CONFIG_ID,
      message: `"id" must be a non-empty string.`,
    });
  }

  return id;
};
