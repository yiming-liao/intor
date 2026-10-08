---
"intor": patch
---

Preserve fallback locale messages returned by loaders during server translator initialization and client refetch. Merge loaded overrides with static messages under their original locale without changing the requested locale or the public single-locale merge contract.
