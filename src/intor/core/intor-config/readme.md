## intor-config

A minimal and structured configuration layer for the Intor internationalization system.

---

### ✨ Purpose

intor-config helps you:

- ✅ Validate supported and default locales
- ✅ Resolve fallback, translator, cookie, and routing options
- ✅ Generate a lightweight, ready-to-use config object for your i18n setup

---

### ⚙️ Basic Usage

- Use static messages

```javascript
import { defineIntorConfig } from "@your-scope/intor";

const intorConfig = defineIntorConfig({
  id: "🌐 Web",
  messages: { en: {...}, zh: {...}, fr: {...} }, // Static messages
  defaultLocale: "en",
  supportedLocales: ["en", "zh", "fr"],
});
```

- Use dynamic messages

```javascript
import { defineIntorConfig } from "@your-scope/intor";

const intorConfig = defineIntorConfig({
  id: "🌐 Web",
  // Dynamic loader
  loaderOptions: {
    type: "import", // "import" | "api"
    basePath: "messages", //
    // apiUrl: "http://localhost:3000/api/get-messages", // Required when using "api"
  },
  defaultLocale: "en",
  supportedLocales: ["en", "zh", "fr"],
});
```

- Detailed config

```javascript
import { defineIntorConfig } from "@your-scope/intor";

const intorConfig = defineIntorConfig({
  id: "🌐 Web",
  messages: { en: { test: "value" } },
  loaderOptions: {
    type: "api", // "import" | "api"
    basePath: "messages",
    apiUrl: "http://localhost:3000/api/get-messages",
    routeNamespaces: {
      default: ["ui", "error"],
      "/cms": ["cms"], // Namespces: "cms", "ui", "error"
      "/*": ["main"], // Namespces: "main", "ui", "error"
    },
    namespaces: ["cms", "main"], // fallback
    concurrency: 10,
  },
  defaultLocale: "en",
  supportedLocales: ["en", "zh", "fr"],
  fallbackLocales: { en: ["zh", "fr"], zh: ["default"], fr: [] }, // "default" means defaultLocale
  translator: {
    loadingMessage: "Loading...",
    placeholder: "The message is missing",
  },
  cookie: {
    name: "myapp.i18n.locale", // Cookie name
    autoSetCookie: true, // Default to true
    disabled: false, // Default to false
  },
  routing: {
    basePath: "/",
    prefix: "all",
    firstVisit: { localeSource: "default" },
  },
  adapter: "next-server",
  log: { level: "debug" }, // Log level: debug -> info -> warn -> error -> silent
  prefixPlaceHolder: "{{locale}}",
});
```
