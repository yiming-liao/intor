---
"@intor/reader-json5": patch
"@intor/reader-md": patch
"@intor/reader-toml": patch
"@intor/reader-yaml": patch
---

Add verified support for Intor 2.12.0 to the explicit peer dependency range.
All four readers pass packed runtime and TypeScript Bundler compatibility
checks, including Markdown metadata from `intor/internal`.
