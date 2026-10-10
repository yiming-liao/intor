---
"intor": minor
---

Reject conflicting local message definitions across files instead of silently overwriting them. Duplicate leaves and object/leaf collisions throw `MessageConflictError` identifying the key and both files; locale fallback does not hide the conflict. Remove or rename conflicting definitions before upgrading. Non-conflicting object branches continue to merge.

This behavior change is intentionally included in a minor release as an explicit version-policy exception for the project's current adoption stage.
