export type RuntimeFetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;
