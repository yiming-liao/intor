# intor

## 2.11.0

### Minor Changes

- eb7b068: Re-export `LocalizedKey` so consumers can derive message key unions with `LocalizedKey<GenMessages<ConfigKey>>` directly from `intor`.

## 2.10.0

### Minor Changes

- 5f39e84: **Behavior change:** Locale cookies are now disabled by default. Intor no longer reads or writes locale cookies unless the application explicitly sets `cookie.enabled: true`.

  To retain cookie-based locale persistence, enable it in your config. Set `cookie.maxAge` (in seconds) when persistent storage is needed; omitting it continues to use a session cookie.

  This change is intentionally released in 2.10.0 as a versioning-policy exception. It changes the previous default behavior despite being a minor release.
