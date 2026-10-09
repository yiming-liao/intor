import type { FormatHandler, MessageValue } from "../../../dist";
import { expectError, expectType } from "tsd";

const stringOnly = (value: string) => value.toUpperCase();

const handler: FormatHandler = ({ rawMessage }) => {
  expectType<MessageValue>(rawMessage);
  expectError(stringOnly(rawMessage));
  if (typeof rawMessage === "string") {
    expectType<string>(rawMessage);
    return rawMessage.toUpperCase();
  }
  return rawMessage;
};

expectType<FormatHandler>(handler);
