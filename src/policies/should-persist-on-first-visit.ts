/**
 * Allow locale persistence based on first-visit policy.
 */
export function shouldPersistOnFirstVisit(
  isFirstVisit: boolean,
  persistOnFirstVisit: boolean,
) {
  return !isFirstVisit || persistOnFirstVisit;
}
