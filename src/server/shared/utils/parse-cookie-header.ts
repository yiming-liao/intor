/**
 * Parse a raw HTTP Cookie header into a key-value record.
 */
export function parseCookieHeader(
  cookieHeader: string | undefined,
): Record<string, string> {
  if (!cookieHeader) return {};

  const record: Record<string, string> = {};

  // Split the Cookie header into individual key-value pairs
  const pairs = cookieHeader.split(";");

  for (const pair of pairs) {
    // Locate the first "=" to separate key and value
    const index = pair.indexOf("=");
    if (index === -1) continue;

    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();

    record[key] = decodeURIComponent(value);
  }

  return record;
}
