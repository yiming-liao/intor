interface IntorErrorOptions {
  message: string;
  code?: IntorErrorCode;
  id?: string;
}

export class IntorError extends Error {
  readonly code?: IntorErrorCode;
  readonly id?: string;

  constructor({ message, code, id }: IntorErrorOptions) {
    const fullMessage = id ? `[${id}] ${message}` : message;
    super(fullMessage);
    this.name = "IntorError";
    this.id = id;
    this.code = code;

    Object.setPrototypeOf(this, new.target.prototype); // Fix prototype
  }
}

export enum IntorErrorCode {
  // config
  INVALID_CONFIG_ID = "INTOR_INVALID_CONFIG_ID",
  MISSING_SUPPORTED_LOCALES = "INTOR_MISSING_SUPPORTED_LOCALES",
  UNSUPPORTED_DEFAULT_LOCALE = "INTOR_UNSUPPORTED_DEFAULT_LOCALE",
  // runtime
  RUNTIME_NOT_INITIALIZED = "INTOR_RUNTIME_NOT_INITIALIZED",
}
