/**
 * Initialization options for creating an IntorError.
 *
 * Defines the structured data used to construct a framework-level error.
 *
 * @public
 */
export interface IntorErrorOptions {
  message: string;
  code?: IntorErrorCode;
  id?: string;
}

/**
 * Framework-level error used by Intor.
 *
 * Extends the native Error with optional structured metadata.
 *
 * @public
 */
export class IntorError extends Error {
  readonly code?: IntorErrorCode;
  readonly id?: string;

  constructor({ message, code, id }: IntorErrorOptions) {
    const fullMessage = id ? `[${id}] ${message}` : message;
    super(fullMessage);
    this.name = "IntorError";
    if (id) this.id = id;
    if (code) this.code = code;

    Object.setPrototypeOf(this, new.target.prototype); // Fix prototype
    if (Error.captureStackTrace) Error.captureStackTrace(this, IntorError);
  }
}

/**
 * Built-in error codes used by Intor.
 *
 * @public
 */
export const INTOR_ERROR_CODE = {
  CONFIG_INVALID_ID: "INTOR_CONFIG_INVALID_ID",
  CONFIG_MISSING_SUPPORTED_LOCALES: "INTOR_CONFIG_MISSING_SUPPORTED_LOCALES",
  CONFIG_UNSUPPORTED_DEFAULT_LOCALE: "INTOR_CONFIG_UNSUPPORTED_DEFAULT_LOCALE",
} as const;

/**
 * Union of all built-in Intor error codes.
 *
 * @public
 */
export type IntorErrorCode =
  (typeof INTOR_ERROR_CODE)[keyof typeof INTOR_ERROR_CODE];
