---
"intor-translator": major
---

Correct FormatHandler.rawMessage from string to MessageValue, matching the existing runtime behavior. Handlers must narrow the input before using string-only operations or ICU formatters. Runtime handling of non-string messages remains unchanged. Update the ICU example to format strings and preserve other values. Existing TypeScript string-only handlers need an input guard.
