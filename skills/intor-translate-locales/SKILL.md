---
name: intor-translate-locales
description: Translate Intor locale files from a default locale messages directory while preserving keys, structure, replacements, rich tags, ICU syntax, and file layout.
---

# Intor Locale Translation Skill

Use this skill when translating locale files for an Intor-based project.

The goal is to create or update target locale files by following the default locale messages directory as the source of truth.

## Scope

This skill is for file-based locale translation workflows such as:

- Translate `./messages/en` into `./messages/zh-TW`
- Fill in missing locale files by mirroring the default locale folder structure
- Update existing translated files while preserving the Intor message shape

This skill is not for:

- Refactoring application code
- Renaming message keys
- Changing locale folder layout
- Rewriting translation semantics beyond the source meaning

## Intor Guarantees

When working with Intor messages, always preserve the following:

- The default locale is the source of truth for message shape.
- Message keys must not be added, removed, or renamed.
- Nested object structure must remain identical.
- The target locale should mirror the default locale file layout unless explicitly instructed otherwise.

## File Handling Rules

Treat the default locale messages directory as the canonical source.

Example:

- Default locale path: `./messages/en`
- Target locale path: `./messages/zh-TW`

Rules:

- Read the default locale files first.
- Mirror the same directory and file structure in the target locale.
- Process one message file at a time.
- Prefer JSON-based translation workflows for v1 unless the user explicitly asks for another format.
- Do not invent new files that do not exist in the default locale tree.
- If a target locale file does not exist, create it by following the default locale path.

## Translation Rules

Translate only user-facing message text.

Never change:

- Message keys
- Object structure
- Placeholder names
- Rich text tag names
- ICU argument names
- ICU control syntax
- Markdown structure unless only the human-readable text is being translated

Preserve the meaning, tone, and formatting intent of the source text.

If a term is ambiguous:

- Prefer a conservative translation
- Preserve product names, API names, and brand names unless the user explicitly wants them localized
- Keep the original source text when uncertainty would otherwise break correctness

Prefer natural, product-quality phrasing over literal translation.

Rules:

- Translate for real user interfaces, not word-for-word parity.
- Preserve meaning, intent, and level of formality.
- Rewrite sentence order when needed for the target language, as long as structure and syntax constraints remain valid.
- Avoid awkward literal translations when a more natural equivalent exists.
- When the source text is simple UI copy, prefer concise and idiomatic target-language phrasing.

## Replacements

Replacements are plain placeholders such as:

- `{name}`
- `{count}`
- `{price}`
- `{date}`

Rules:

- Preserve replacement names exactly.
- Do not translate replacement names.
- Do not remove or duplicate placeholders.
- Reorder surrounding words only if the target language requires it.

Examples:

- `"Welcome back, {name}!"`
- `"You have {count} items."`
- `"Price: {price}"`

## Rich Text

Rich text messages may contain tags such as:

- `<link>...</link>`
- `<strong>...</strong>`
- `<em>...</em>`
- `<paragraph>...</paragraph>`

Rules:

- Preserve tag names exactly.
- Preserve opening and closing tag balance.
- Translate only the human-readable text inside or around the tags.
- Do not replace rich tags with plain text.
- Do not convert plain text messages into rich text messages unless the source already uses rich tags.

Examples:

- `"Read our <link>documentation</link>."`
- `"<strong>Welcome</strong> back, {name}!"`

## ICU Messages

ICU syntax must remain structurally valid.

Common ICU forms include:

- plural
- select
- selectordinal
- date/time/number formatting

Rules:

- Preserve the ICU message structure.
- Preserve argument names exactly.
- Translate only the human-readable branches and text fragments.
- Do not alter ICU keywords such as `plural`, `select`, `one`, `other`, `male`, `female`.
- Do not remove required branches.
- When the target language needs a different natural phrasing, rewrite the branch text while keeping the ICU structure valid.
- Do not keep English-oriented phrasing patterns if they sound unnatural in the target language.

Examples:

- `"{count, plural, =0 {No messages} one {# message} other {# messages}}"`
- `"{gender, select, male {He updated the document.} female {She updated the document.} other {They updated the document.}}"`
- `"Total: {amount, number, ::currency/USD}"`

## Markdown Messages

Some message values may contain Markdown.

Rules:

- Preserve Markdown syntax and structure.
- Translate the readable text inside headings, lists, emphasis, and links.
- Do not corrupt Markdown formatting.
- Do not convert Markdown messages into plain text.

## Localization Quality

Translations should feel like they were written for native speakers of the target locale.

Rules:

- Prefer natural phrasing over rigid source-language word order.
- Keep UI labels concise.
- Keep notifications clear and conversational.
- Keep validation messages direct and conventional for the target locale.
- Keep error messages short, precise, and user-friendly.

Examples:

- Prefer a natural equivalent of `"See you later"` over a rigid literal translation.
- Prefer target-locale wording for ordinals, pluralized nouns, and system messages when the source language pattern does not map naturally.

## Recommended Workflow

Follow this order:

1. Identify the default locale directory and target locale directory.
2. Enumerate the default locale files.
3. For each file, read and parse the message content.
4. Translate the content while preserving Intor structure and syntax rules.
5. Write the translated content to the mirrored target locale path.
6. Repeat until all files are processed.
7. Validate the final target locale files if validation tooling is available.
8. Review the output for awkward literal phrasing, especially in ICU branches and short UI labels.

## Output Expectations

The final translated result should satisfy all of the following:

- Same keys as the default locale
- Same nested structure as the default locale
- Same placeholders, rich tags, and ICU argument names
- Same file layout as the default locale
- Natural target-language text for user-facing content

## Hard Constraints

Never do any of the following:

- Rename keys
- Drop keys
- Add extra keys
- Break JSON syntax
- Break Markdown syntax
- Break rich tag structure
- Break ICU syntax
- Translate placeholder names
- Change file paths without explicit instruction
- Preserve awkward source-language wording when a natural target-language phrasing is possible without breaking structure

## Decision Policy

When forced to choose between fluency and structural safety:

- Prefer structural safety

When forced to choose between a risky translation and preserving the source:

- Prefer preserving the source text

When a translation would require changing message structure:

- Do not change the structure
