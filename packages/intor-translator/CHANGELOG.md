# intor-translator

## 1.7.0

### Minor Changes

- 4869270: Correct FormatHandler.rawMessage from string to MessageValue, matching the existing runtime behavior. Handlers must narrow the input before using string-only operations or ICU formatters. Runtime handling of non-string messages remains unchanged. Update the ICU example to format strings and preserve other values. Existing TypeScript string-only handlers need an input guard.

  This breaking type correction is intentionally included in a minor release as an explicit version-policy exception for the project's current adoption stage.

- 4b7a652: Preserve `null` returned by `formatHandler` as a valid message result instead of falling back to the original message. Only an unset (`undefined`) formatted result uses the raw message. To leave a message unchanged, return `rawMessage` rather than `null`.

  Direct `t()` calls can now return `null` for this case; HTML rich output is empty and React/Vue rich output contains no nodes. Other falsy values and structural outputs retain their existing behavior.

  This breaking behavior correction is intentionally included in a minor release as an explicit version-policy exception for the project's current adoption stage.

### Patch Changes

- 0e2fe9a: Ignore inherited object properties when looking up message keys, allowing missing messages to resolve through configured fallback locales instead of returning prototype values. Explicitly defined keys with the same names remain supported.
