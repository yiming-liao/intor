# Messages Loader

This directory defines the **server-side message loading pipeline**.

It is responsible for **loading locale messages** according to the resolved
Intor loader configuration (local or remote).

---

## Entry

### `loadMessages`

Top-level orchestration entry.

- Resolves loader strategy (`local` / `remote`)
- Dispatches to the appropriate loader
- Passes through cache and loader-specific options

```
loadMessages
├─ loadLocalMessages
│    └─ readLocaleMessages
│         ├─ collectFileEntries
│         └─ parseFileEntries
└─ loadRemoteMessages (core)
```

---

## Local loader flow

### `loadLocalMessages`

Orchestration layer for local filesystem loading.

- Applies fallback locale order
- Coordinates cache read / write
- Controls concurrency

Delegates actual IO work downstream.

### › `readLocaleMessages`

Single-locale reader.

- Collects file metadata
- Parses files into a `Messages` object
- Wraps result under `{ [locale]: Messages }`

### › › `collectFileEntries`

Filesystem traversal utility.

- Recursively collects message file metadata
- Filters by namespace and extension

_No parsing is performed here._

### › › `parseFileEntries`

Message parser.

- Reads files (JSON or custom reader)
- Validates message shape
- Builds nested objects from file paths
- Merges by namespace

_Returns a single-locale `Messages` object._

---

## Design principles

- **Orchestration vs implementation are strictly separated**
- Each layer has a single responsibility
- No layer knows more than it needs to
