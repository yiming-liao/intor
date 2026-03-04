// runtime > external > config
// Always resolves to a non-null message object.
export function resolveEffectiveMessages<M>(
  runtime: M | null | undefined,
  external: M | null | undefined,
  configMessages: M | null | undefined,
): M {
  return runtime ?? external ?? configMessages ?? ({} as M);
}

// external > internal
// Loading is active if either source is truthy
export function resolveEffectiveIsLoading(
  external: boolean,
  internal: boolean,
) {
  return !!external || internal;
}
