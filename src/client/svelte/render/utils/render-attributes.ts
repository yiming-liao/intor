import { escapeHtml } from "@/client/svelte/render/utils/escape-html";

type Attributes = Record<string, string | number | boolean | null | undefined>;

export function renderAttributes(attributes?: Attributes): string {
  if (!attributes) return "";

  return Object.entries(attributes)
    .map(([key, value]) =>
      value === true
        ? ` ${key}`
        : value != null
          ? ` ${key}="${escapeHtml(String(value))}"`
          : "",
    )
    .join("");
}
