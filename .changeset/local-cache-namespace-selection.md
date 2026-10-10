---
"intor": patch
---

Distinguish unrestricted local message loading from an explicit empty namespace selection in production cache keys. Preserve root-only loading for `namespaces: []` and cache reuse for reordered namespace selections.
