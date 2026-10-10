---
"intor": patch
---

Validate complete `Accept-Language` weights instead of accepting numeric prefixes. Skip entries with out-of-range weights, invalid precision, unknown parameters, or repeated weights while retaining other candidates and existing locale fallback. Valid case-insensitive `q` parameters and RFC weight forms remain supported.
