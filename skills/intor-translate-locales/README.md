# intor-translate-locales

Generate translated message files for other locales by using the default locale messages directory as the source of truth.

## Quick Start

Use the skill with a short prompt like this:

```text
Use the skill in skills/intor-translate-locales/SKILL.md.
Default locale messages path: ./messages/en
Target locales: zh-TW, fr-FR, ja
```

## What It Does

- Reads the default locale files first
- Mirrors the same file structure in each target locale
- Preserves keys, nested structure, replacements, rich tags, ICU syntax, and markdown structure
- Translates only user-facing text

## Notes

- The default locale is treated as the source of truth.
- Missing target locale files should be created by following the default locale structure.
- Review generated translations before finalizing them.
