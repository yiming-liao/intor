/* v8 ignore file */

import type { KeyUsage } from "../../../../../core";

export interface KeyUsageLike extends Omit<
  KeyUsage,
  "localName" | "factory" | "method"
> {
  method: string;
}
