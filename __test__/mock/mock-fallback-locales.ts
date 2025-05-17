import type { FallbackLocalesMap } from "../../src/intor/types/message-structure-types";

export const mockFallbackLocales: FallbackLocalesMap = {
  "en-US": ["fr-FR", "zh-TW"],
  "fr-FR": ["en-US"],
  "zh-TW": ["en-US"],
  "ja-JP": [],
};
