import type { MockLocaleNamespaceMessages } from "./locale-namespace-messages.mock";
import type { FallbackLocalesMap } from "@/intor/types/message-structure-types";

export const mockFallbackLocales: FallbackLocalesMap<MockLocaleNamespaceMessages> =
  {
    "en-US": ["fr-FR", "zh-TW"],
    "fr-FR": ["en-US"],
    "zh-TW": ["en-US"],
    "ja-JP": [],
  };
