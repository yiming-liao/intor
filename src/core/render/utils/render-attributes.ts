import { escapeHtml } from "./escape-html";

type Attributes = Record<string, string | number | boolean | null | undefined>;

export function renderAttributes(attributes?: Attributes): string {
  if (!attributes) return "";

  return Object.entries(attributes)
    .map(([key, value]) => {
      if (value === true) return ` ${key}`;
      if (value == null) return "";
      return ` ${key}="${escapeHtml(String(value))}"`;
    })
    .join("");
}
