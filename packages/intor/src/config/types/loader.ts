/**
 * HTTP headers used for remote loading.
 *
 * @public
 */
export interface RemoteHeaders {
  /** Authorization header (e.g. Bearer token). */
  authorization?: string;
  /** API key header. */
  "x-api-key"?: string;
  /** Additional custom headers. */
  [key: string]: string | undefined;
}

/**
 * Local loader configuration.
 *
 * @public
 */
export interface LocalLoader {
  /** Use local filesystem-based message loading. */
  mode: "local";
  /** Namespaces to load for all routes. */
  namespaces?: string[];
  /** Maximum number of concurrent loading tasks. */
  concurrency?: number;
  /** Root location for resolving message loading sources. */
  rootDir?: string;
}

/**
 * Remote loader configuration.
 *
 * @public
 */
export interface RemoteLoader {
  /** Use remote API-based message loading. */
  mode: "remote";
  /** Namespaces to load for all routes. */
  namespaces?: string[];
  /** Maximum number of concurrent loading tasks. */
  concurrency?: number;
  /** Base URL for fetching remote messages. */
  url: string;
  /** Optional headers sent with remote requests. */
  headers?: RemoteHeaders;
}

/**
 * Loader configuration.
 *
 * @public
 */
export type LoaderOptions = LocalLoader | RemoteLoader;

/**
 * Server-side loader configuration.
 *
 * @public
 */
export type ServerLoaderOptions = LoaderOptions;

/**
 * Client-side loader configuration.
 *
 * @public
 */
export type ClientLoaderOptions = Omit<RemoteLoader, "mode">;
