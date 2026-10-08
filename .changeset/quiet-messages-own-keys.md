---
"intor-translator": patch
---

Ignore inherited object properties when looking up message keys, allowing missing messages to resolve through configured fallback locales instead of returning prototype values. Explicitly defined keys with the same names remain supported.
