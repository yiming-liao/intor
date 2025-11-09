/**
 * Build URLSearchParams from an object.
 * Supports string or string[] values. Ignores undefined/null.
 */
export const buildSearchParams = (
  params: Record<string, string | string[] | undefined>,
) => {
  const searchParams = new URLSearchParams();

  const appendParam = (key: string, value: string | string[] | undefined) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value) && value.length === 0) return;

    if (Array.isArray(value)) {
      value.forEach((v) => v && searchParams.append(key, v));
    } else {
      searchParams.append(key, value as string);
    }
  };

  Object.entries(params).forEach(([key, value]) => {
    appendParam(key, value);
  });

  return searchParams;
};
