# intor

## 2.12.0

### Minor Changes

- 152ead7: Reject conflicting local message definitions across files instead of silently overwriting them. Duplicate leaves and object/leaf collisions throw `MessageConflictError` identifying the key and both files; locale fallback does not hide the conflict. Remove or rename conflicting definitions before upgrading. Non-conflicting object branches continue to merge.

  This behavior change is intentionally included in a minor release as an explicit version-policy exception for the project's current adoption stage.

- 95b784c: Move the request-context redirect helper from `intor/next` to `intor/next/server` so client navigation imports do not pull in `next/headers`. Update imports to `import { redirect } from "intor/next/server"`. The helper remains server-only in capability: locale resolution, function signatures and redirect behavior are unchanged. Use `useRouter` from `intor/next` for client event navigation.

  Mark `useRouter` as a client boundary for Next.js server consumers.

  This breaking import change is intentionally included in a minor release as an explicit version-policy exception for the project's current adoption stage.

### Patch Changes

- 57dbf03: Validate complete `Accept-Language` weights instead of accepting numeric prefixes. Skip entries with out-of-range weights, invalid precision, unknown parameters, or repeated weights while retaining other candidates and existing locale fallback. Valid case-insensitive `q` parameters and RFC weight forms remain supported.
- ec44378: Exclude zero-weight `Accept-Language` candidates from locale detection. Malformed weights already treated as zero are also skipped. When no acceptable supported candidate remains, existing routing resolution chooses the default locale or another configured signal.
- 2a95318: Continue resolving the browser locale when a locale cookie is unsupported, and ignore malformed cookie encoding instead of throwing during client locale initialization.
- 2233a7b: Distinguish unrestricted local message loading from an explicit empty namespace selection in production cache keys. Preserve root-only loading for `namespaces: []` and cache reuse for reordered namespace selections.
- cae74f8: Preserve configured fallback locale priority when loading local messages and distinguish different priorities in cache keys. Avoid mutating fallback locale and namespace arrays during cache key construction.
- e20f575: Preserve own message keys such as `__proto__`, `constructor`, and `toString` during merging and local namespace loading. Avoid treating inherited properties as existing messages or changing the merged object's prototype.
- f5c8da7: Preserve fallback locale messages returned by loaders during server translator initialization and client refetch. Merge loaded overrides with static messages under their original locale without changing the requested locale or the public single-locale merge contract.
- Updated dependencies [0e2fe9a]
- Updated dependencies [4869270]
- Updated dependencies [4b7a652]
  - intor-translator@1.7.0

## 2.11.0

### Minor Changes

- eb7b068: Re-export `LocalizedKey` so consumers can derive message key unions with `LocalizedKey<GenMessages<ConfigKey>>` directly from `intor`.

## 2.10.0

### Minor Changes

- 5f39e84: **Behavior change:** Locale cookies are now disabled by default. Intor no longer reads or writes locale cookies unless the application explicitly sets `cookie.enabled: true`.

  To retain cookie-based locale persistence, enable it in your config. Set `cookie.maxAge` (in seconds) when persistent storage is needed; omitting it continues to use a session cookie.

  This change is intentionally released in 2.10.0 as a versioning-policy exception. It changes the previous default behavior despite being a minor release.
