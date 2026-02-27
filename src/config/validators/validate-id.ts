import { IntorError, INTOR_ERROR_CODE } from "../../core";

/**
 * Validates that the given id is a non-empty string.
 *
 * Fails fast if the id is empty or whitespace-only.
 */
export const validateId = (id: string): string => {
  if (id.trim() === "") {
    throw new IntorError({
      id,
      code: INTOR_ERROR_CODE.CONFIG_INVALID_ID,
      message: `"id" must be a non-empty string.`,
    });
  }

  return id;
};
