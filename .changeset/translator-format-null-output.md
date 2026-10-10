---
"intor-translator": major
---

Preserve `null` returned by `formatHandler` as a valid message result instead of falling back to the original message. Only an unset (`undefined`) formatted result uses the raw message. To leave a message unchanged, return `rawMessage` rather than `null`.

Direct `t()` calls can now return `null` for this case; HTML rich output is empty and React/Vue rich output contains no nodes. Other falsy values and structural outputs retain their existing behavior.
