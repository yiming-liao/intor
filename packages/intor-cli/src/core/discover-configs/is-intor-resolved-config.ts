import type { IntorResolvedConfig } from "intor";

export function isIntorResolvedConfig(
  value: unknown,
): value is IntorResolvedConfig {
  if (!value || typeof value !== "object") return false;

  const config = value as IntorResolvedConfig;

  return (
    typeof config.id === "string" &&
    typeof config.defaultLocale === "string" &&
    Array.isArray(config.supportedLocales)
  );
}
