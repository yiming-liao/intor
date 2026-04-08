## Extract Targets

#### • Translator Bindings (collectTranslatorBindings)

Extracts translator method bindings from destructured calls of supported Intor translator factories.

- Only named imports from `intor` / `intor/*` are supported.
- Aliased imports are supported.

```ts
// ✅ Supported
import { useTranslator as useT } from "intor/react";

const { t, hasKey } = useTranslator();
const { tRich } = useT();
t("home.title");
hasKey("home.title");

// ❌ Not supported
const translator = useTranslator();
translator.t("home.title");

function useTranslator() {
  return { t() {} };
}
const { t: localT } = useTranslator();
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

#### • Trans Usages (collectTransUsages)

Extracts static `i18nKey` values from Intor `<Trans />` components.

- Only named imports from `intor` / `intor/*` are supported.
- Aliased imports are supported.

```tsx
// ✅ Supported
import { Trans } from "intor/vue";
import { Trans as IntorTrans } from "intor/vue";

<Trans i18nKey="home.title" />;
<IntorTrans i18nKey={"profile.name"} />;

// ❌ Not supported
import { Trans } from "./ui";
<Trans i18nKey="home.title" />;

<Intor.Trans i18nKey="home.title" />;
<Trans i18nKey={key} />;
```

#### • Replacement Usages (collectReplacementUsages)

Extracts static replacement keys based on method semantics.

- For `t`: from the second argument.
- For `tRich`: from the object-literal argument following rich tag definitions.

```ts
// ✅ Supported
t("title", { name: "John", count: 3 });
tRich("title", { link: () => null }, { name: "John" });

// ❌ Not supported
t("title");
t("title", replacements);
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

1. If the first argument is a static string literal, use it as `preKey`.
2. Otherwise, if the last argument is an object literal containing a static `preKey`, use it.
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
