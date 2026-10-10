---
"intor-translator": minor
---

Preserve `null` returned by `formatHandler` as a valid message result instead of falling back to the original message. Only an unset (`undefined`) formatted result uses the raw message. To leave a message unchanged, return `rawMessage` rather than `null`.

Direct `t()` calls can now return `null` for this case; HTML rich output is empty and React/Vue rich output contains no nodes. Other falsy values and structural outputs retain their existing behavior.

This breaking behavior correction is intentionally included in a minor release as an explicit version-policy exception for the project's current adoption stage.
