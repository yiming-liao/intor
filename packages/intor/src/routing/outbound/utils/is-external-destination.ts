/**
 * Determines whether a navigation target should bypass app routing.
 *
 * Any value with an explicit scheme (e.g. http:, https:, mailto:)
 * is treated as external navigation.
 */
export const isExternalDestination = (destination: string): boolean => {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(destination);
};
