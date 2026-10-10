---
"intor": minor
---

Move the request-context redirect helper from `intor/next` to `intor/next/server` so client navigation imports do not pull in `next/headers`. Update imports to `import { redirect } from "intor/next/server"`. The helper remains server-only in capability: locale resolution, function signatures and redirect behavior are unchanged. Use `useRouter` from `intor/next` for client event navigation.

Mark `useRouter` as a client boundary for Next.js server consumers.

This breaking import change is intentionally included in a minor release as an explicit version-policy exception for the project's current adoption stage.
