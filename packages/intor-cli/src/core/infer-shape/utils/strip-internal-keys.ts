import { INTOR_PREFIX } from "intor/internal";

/**
 * Remove internal Intor keys from inferred schema objects.
 *
 * This runs after schema inference to avoid leaking
 * internal metadata into generated types.
 */
export function stripInternalKeys(target: unknown): void {
  if (!target || typeof target !== "object") return;

  // Handle arrays explicitly
  if (Array.isArray(target)) {
    for (const item of target) {
      stripInternalKeys(item);
    }
    return;
  }

  const record = target as Record<string, unknown>;

  for (const key of Object.keys(record)) {
    if (key.startsWith(INTOR_PREFIX)) {
      delete record[key];
      continue;
    }

    stripInternalKeys(record[key]);
  }
}
