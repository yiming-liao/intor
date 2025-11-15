type IntorErrorOptions = {
  message: string;
  code?: string;
  id?: string;
};

export class IntorError extends Error {
  readonly code?: string;
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
  // intor-config
  MISSING_SUPPORTED_LOCALES = "INTOR_MISSING_SUPPORTED_LOCALES",
  MISSING_DEFAULT_LOCALE = "INTOR_MISSING_DEFAULT_LOCALE",
  UNSUPPORTED_DEFAULT_LOCALE = "INTOR_UNSUPPORTED_DEFAULT_LOCALE",
  // message-loader
  INVALID_MESSAGE_FORMAT = "INTOR_INVALID_MESSAGE_FORMAT",
}
