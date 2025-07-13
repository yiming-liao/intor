export type IntorErrorOptions = {
  message: string;
  code?: string;
  id?: string;
};

export enum IntorErrorCode {
  // intor-config
  MISSING_DEFAULT_LOCALE = "INTOR_MISSING_DEFAULT_LOCALE",
  UNSUPPORTED_DEFAULT_LOCALE = "INTOR_UNSUPPORTED_DEFAULT_LOCALE",
  MISSING_SUPPORTED_LOCALES = "INTOR_MISSING_SUPPORTED_LOCALES",
  // intor, intor-runtime
  UNSUPPORTED_ADAPTER = "INTOR_UNSUPPORTED_ADAPTER",
  // intor-runtime -> createAdapterRuntimeLoader
  ADAPTER_RUNTIME_LOAD_FAILED = "INTOR_ADAPTER_RUNTIME_LOAD_FAILED",
  // intor-messages-loader
  UNKNOWN_LOADER_TYPE = "INTOR_UNKNOWN_LOADER_TYPE",
}
