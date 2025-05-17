/**
 * Build URLSearchParams from an object.
 * Supports string or string[] values. Ignores undefined/null.
 *
 * @param params - Key-value pairs to convert into query string
 * @returns URLSearchParams instance
 */
export const buildSearchParams = (
  params: Record<string, string | string[] | undefined>,
) => {
  const searchParams = new URLSearchParams();

  /**
   * Append a param to searchParams, supporting string or string[]
   */
  const appendParam = (key: string, value: string | string[] | undefined) => {
    // Skip if value is undefined or null
    if (value === undefined || value === null) {
      return;
    }

    // value is a array
    if (Array.isArray(value) && value.length > 0) {
      value.forEach((v) => v && searchParams.append(key, v));
    }
    // value is a string
    else {
      searchParams.append(key, value as string);
    }
  };

  // Iterate over the additionalParams to add them to the searchParams
  Object.entries(params).forEach(([key, value]) => {
    appendParam(key, value); // Dynamically add the key-value pair to the params
  });

  return searchParams;
};
