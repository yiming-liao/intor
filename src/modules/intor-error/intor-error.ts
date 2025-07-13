import { IntorErrorOptions } from "@/modules/intor-error/intor-error-types";

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
