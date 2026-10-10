---
"intor": patch
---

Preserve own message keys such as `__proto__`, `constructor`, and `toString` during merging and local namespace loading. Avoid treating inherited properties as existing messages or changing the merged object's prototype.
