import type { KeyUsage } from "../../../../../core";

export interface KeyUsageLike extends Omit<
  KeyUsage,
  "localName" | "factory" | "method"
> {
  origin: string;
}
