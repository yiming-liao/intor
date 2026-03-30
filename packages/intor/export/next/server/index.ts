// intor / next / server

export * from "../../shared-types";

export {
  intor,
  getLocale,
  getTranslator,
  readIntorUrlState,
} from "../../../src/adapters/next/server";

export type {
  IntorValue,
  IntorOptions,
  GetTranslatorParams,
} from "../../../src/server";
