## Extract Targets

#### • Translator Usages (collectTranslatorUsages)

Extracts translator method bindings only from destructured calls of registered translator factories.

```ts
// ✅ Supported
const { t, hasKey } = useTranslator();
t("home.title");
hasKey("home.title");

// ❌ Not supported
const translator = useTranslator();
translator.t("home.title");
```

#### • Key Usages (collectKeyUsages)

Extracts static string literal keys from the first argument of registered translator method calls.

```ts
// ✅ Supported
t("title");
t(`title`);

// ❌ Not supported
t(key);
t(getTitle());
t(`title.${key}`);
```

#### • Replacement Usages (collectReplacementUsages)

Extracts static replacement keys based on method semantics.

- For `t`: from the last object-literal argument.
- For `tRich`: from the object-literal argument following rich tag definitions.

```ts
// ✅ Supported
t("title", { name: "John", count: 3 });
t("title", options, { name: "John" });

// ❌ Not supported
t("title");
t("title", replacements);
t("title", { name: getName() });
tRich("title", { link: () => null });
```

#### • Rich Usages (collectRichUsages)

Extracts static rich tag names from `tRich` calls only.

```ts
// ✅ Supported
tRich("title", {
  link: () => <a>Link</a>,
  strong: () => <strong>Text</strong>,
});

// ❌ Not supported
tRich("title", richTags);
```

#### • PreKeys (collectPreKeys)

1. If the first argument is a static string literal, use it as preKey.
2. Otherwise, if the last argument is an object literal containing a static preKey, use it.
3. Ignore all other cases.

```ts
// ✅ Supported (positional)
const { t, hasKey } = useTranslator("home");

// ✅ Supported (options object)
const { tRich } = getTranslator(_, _, { preKey: "dashboard" });

// ❌ Not supported
const { t } = useTranslator(prefix);
const { t } = getTranslator({ preKey: dynamic });
const translator = useTranslator("home"); // non-destructured binding
```
