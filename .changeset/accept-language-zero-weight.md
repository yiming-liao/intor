---
"intor": patch
---

Exclude zero-weight `Accept-Language` candidates from locale detection. Malformed weights already treated as zero are also skipped. When no acceptable supported candidate remains, existing routing resolution chooses the default locale or another configured signal.
