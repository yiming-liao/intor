/**
 * Determine whether locale synchronization is required.
 */
export function shouldSyncLocale(currentLocale: string, targetLocale: string) {
  return currentLocale !== targetLocale;
}
