## 📝 Future Work (Design Notes)

#### • Unsafe Translation APIs

In some dynamic scenarios (e.g. CMS-driven keys, feature flags),
compile-time key safety may not be feasible.

For these cases, Intor may expose an explicit `unsafe` namespace
to allow dynamic key access while keeping the default APIs strict.

```ts
/**
 * Unsafe translation APIs.
 *
 * These methods bypass compile-time key safety.
 * Prefer the safe `t()` and `hasKey()` APIs whenever possible.
 */
unsafe: {
  hasKey: (dynamicKey: string, targetLocale?: Locale<M>) => boolean;
  t: (dynamicKey: string, replacements?: Replacement) => string;
}
```

> Not sure if this should exist yet.  
> Keeping this note here to avoid revisiting the same discussion.
