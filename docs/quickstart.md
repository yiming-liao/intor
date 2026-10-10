# Intor quickstart

For AI coding agents and developers integrating Intor into an existing application. This guide covers a verifiable first translation, framework integration, and type generation. Application scaffolding and product locale strategy are outside its scope.

## Scope

Based on this repository's source: `intor@2.10.0`, `intor-translator@1.6.2`, and `intor-cli@1.0.3`. These are repository versions, not a lookup of the latest npm releases.

Last reviewed: 2026-09-27. If the target application uses different versions, check their exports and APIs before adapting these examples.

## 1. Confirm integration requirements

Before making changes, inspect the target project for the following information. Ask the user about anything the project does not establish:

- Framework and version; CSR, SSR, or Edge runtime.
- Default locale, supported locales, and fallback requirements.
- Message source: static objects, local files, or a remote service.
- Whether URLs contain a locale, and the existing routing rules.
- Package manager, existing config, Provider, and type generation setup.

The minimal examples below use static messages with `en` and `zh-TW` as sample locales. Follow the project's established settings and avoid duplicate configs or Providers.

## 2. Understand the core model

Intor is an internationalization library for JavaScript and TypeScript. Data flows through **config → locale + messages → translator → UI**.

- `intor-translator`: standalone translation engine for key lookup, fallback, interpolation, and formatting.
- `intor`: configuration, message loading, locale routing, and framework integration. Install this package for typical application integrations.
- `intor-cli`: type and schema generation, translation usage checks, and message validation across locales.
- `@intor/reader-*`: server-side readers for additional file formats. JSON support is built in.

## 3. Install packages and create a config

Requires Node.js ≥20. Install in the target application using the versions represented in this repository:

````sh
pnpm add intor@2.10.0
pnpm add -D intor-cli@1.0.3
````

Create a dedicated `intor.config.ts`. The locales and messages below are examples. The outermost keys in `messages` must be locales; interpolation uses `{name}`.

````ts
import { defineIntorConfig } from "intor";

export const intorConfig = defineIntorConfig({
  defaultLocale: "en",
  supportedLocales: ["en", "zh-TW"],
  messages: {
    en: { hello: "Hello, {name}!" },
    "zh-TW": { hello: "你好，{name}！" },
  },
});
````

## 4. Integrate with the runtime

### Minimal Node.js example

In a target project with TypeScript and ESM support, create a module alongside `intor.config.ts`:

````ts
import { getTranslator } from "intor/server";
import { intorConfig } from "./intor.config";

const { t } = await getTranslator(intorConfig, { locale: "zh-TW" });
console.log(t("hello", { name: "Intor" })); // 你好，Intor！
````

Expected output: `你好，Intor！`. For browser applications, use the framework entry points below.

### Minimal React example

This client-side example targets React 19. Place `App.tsx` alongside the config. For Next.js SSR, use the Next.js adapter listed below to resolve the request locale.

````tsx
import { IntorProvider, useTranslator } from "intor/react";
import { intorConfig } from "./intor.config";

function Greeting() {
  const { t, locale, setLocale } = useTranslator();

  return (
    <>
      <p>{t("hello", { name: "Intor" })}</p>
      <button onClick={() => setLocale(locale === "en" ? "zh-TW" : "en")}>
        Switch locale
      </button>
    </>
  );
}

export default function App() {
  return (
    <IntorProvider value={{ config: intorConfig, locale: "en" }}>
      <Greeting />
    </IntorProvider>
  );
}
````

The initial text should be `Hello, Intor!`. Clicking the button should change it to `你好，Intor！`.

### Framework entry points

| Environment      | Integration                                                                                                                                                                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React 19         | Import `IntorProvider` and `useTranslator` from `intor/react`. Wrap components with `<IntorProvider value={{ config: intorConfig, locale: "en" }}>…</IntorProvider>`. Children use `const { t, locale, setLocale } = useTranslator()` to translate and switch locales. |
| Vue 3 / Svelte 5 | Use `intor/vue` and `intor/svelte`, respectively. Follow each framework's Provider and reactive APIs rather than copying the React integration.                                                                                                                        |
| Node.js / SSR    | Use `getTranslator(config, { locale })` from `intor/server` for translation. `await intor(config, locale)` produces `{ config, locale, messages }` for a Provider.                                                                                                     |
| Edge             | Use `getTranslator(config, { locale })` from `intor/edge`. Supports static messages and the root-level remote loader; local file loading is unavailable.                                                                                                               |
| Next.js 16       | `intor/next` provides handler and client navigation integration. Request-context `redirect` is imported from `intor/next/server`. `intor(config)` and `getTranslator(config)` from `intor/next/server` resolve the locale from framework context. Use `intor/react` on the client.                                                             |
| Other frameworks | Entry points: `intor/svelte-kit`, `intor/express`, `intor/fastify`, and `intor/hono`.                                                                                                                                                                                  |

## 5. Generate types and run checks

Run from the target application's root. The package is named `intor-cli`; its executable is `intor`.

````sh
pnpm exec intor discover
pnpm exec intor generate
pnpm exec intor check
pnpm exec intor validate
````

`generate` derives `.intor/types.d.ts` and `.intor/schema.json` from **defaultLocale**. Add `.intor/**/*.d.ts` to `include` in `tsconfig.json`, preserving existing entries. Regenerate after changing the base messages, and keep message structures consistent across locales.

Place configs in `.ts` or `.js` files and directly call and export the result of `defineIntorConfig(...)`. Discovery currently searches source text for the literal string `defineIntorConfig(`. Do not alias the function or hide the call behind a custom factory.

Check that `discover` lists the expected config. After `generate`, verify that the artifacts exist and run the project's existing TypeScript checks. A command finishing without an exception does not prove that the CLI found the config.

Known limitation: some consumer applications may fail to load a TS config that imports an import-only package through a helper. Debug output currently omits the original import error. If this happens, record the Node and CLI versions, module mode, and import chain. See the [CLI config loading plan](plans/cli-config-loading.md); its proposed support contract has not been confirmed or implemented.

## 6. Verify the integration

- [ ] The selected locale displays the expected messages with correct interpolation.
- [ ] If locale switching is required, switching updates the UI text.
- [ ] For SSR or locale routing, direct navigation and page refresh preserve the correct locale without hydration errors.
- [ ] The CLI discovers the intended config, generated types are included in TypeScript, and existing type checks pass.
- [ ] Issues reported by `check` and `validate` are resolved, or the remaining issues and their causes are documented.

After completing an integration, AI agents should report changed files, checks actually performed, and unfinished work. Do not report checks that were not run as passing.

## Integration constraints

- Locale cookies are disabled by default. Set `cookie.enabled: true` to enable reading and writing. Set `cookie.maxAge` in seconds for persistent cookies; omitting it uses a session cookie. Enabling cookies does not represent user consent.
- `defaultLocale` must appear in `supportedLocales`. When using multiple configs, each `id` must be unique; the default is `"default"`.
- Static `messages` work without a loader. Node loaders support `local` and `remote` sources; browser-side dynamic loading uses remote sources. Configure `fallbackLocales` explicitly when fallback is required.
- `routing.localePrefix` defaults to `"none"`. Switching the Provider locale does not perform framework URL navigation; locale-prefixed routing requires the corresponding adapter.
- Do not import `intor/server` in the browser. The root `intor` entry point exports `Translator` only as a type. To call `new Translator(...)`, import it from `intor-translator`.

## Source references

For framework details, start with the relevant entry point and API signatures:

- [Public exports](../packages/intor/export/) and [API reports](../packages/intor/api-extractor/reports/).
- [Config types](../packages/intor/src/config/types/).
- [Client integrations](../packages/intor/src/client/) and [framework adapters](../packages/intor/src/adapters/).
- [Behavior tests](../packages/intor/__test__/).

Do not assume that similarly named APIs from other i18n libraries behave the same way. For development on Intor itself, this repository uses a pnpm workspace (pnpm 10.32.0). Run `pnpm install --frozen-lockfile` and `pnpm build:all` from the root; use `pnpm run ci` for the full check suite.

## Rich messages and replacements

`tRich()` resolves `t(key, replacements)` first, then parses the resulting message for semantic tags. The following describes current behavior, rather than a guarantee that replacements are literal text.

For a message such as `Hello <b>{name}</b>!`, `name: "Alice"` renders the message-defined bold element. Ordinary comparison text such as `2 < 3 & 5 > 4` remains text and is escaped by the HTML renderer or React when serialized.

A replacement containing valid markup, such as `name: "<b>Alice</b>"`, is also parsed as rich structure. An unclosed or unmatched tag in a replacement can throw during rich parsing. Text escaping happens after parsing; it does not make replacement markup literal or sanitize the complete rich output. Pre-escaping a replacement with HTML entities is not a workaround: entity text is escaped again rather than decoded.

The HTML renderer retains parsed attributes, so `<a href="{url}">{name}</a>` interpolates both placeholders and renders the attribute. The default React renderer ignores parsed attributes. For React links, supply a tag renderer that creates the link with application-provided props:

````tsx
const url = "/pricing";
tRich("pricingLink", {
  a: (children) => <a href={url}>{children}</a>,
}, { name: "Pricing" });
````

Use a message such as `<a>{name}</a>` for this example. Attribute escaping in HTML output does not validate a URL's protocol. Custom tag renderers control their own output. When passing user-provided text, account for the current markup-parsing behavior; the rich API does not currently distinguish literal replacement text from markup.

### Formatter results

`formatHandler` receives a resolved `MessageValue` and may return another `MessageValue`. Narrow the input before passing it to a string-template formatter. Return `rawMessage` to leave the message unchanged.

A returned `null` is an intentional empty result: `t()` returns `null`, HTML `tRich()` returns an empty string, and React/Vue `tRich()` return no nodes. It does not trigger message or locale fallback. Previously, formatter `null` selected the raw message; migrate handlers that used this behavior to `return rawMessage`.

Only an unset (`undefined`) formatted result selects the raw message. `undefined` is not a valid `FormatHandler` return value. Other falsy results (`false`, `0`, and `""`) remain valid outputs. String formatter output is interpolated afterward; arrays and objects are preserved without recursive interpolation.
