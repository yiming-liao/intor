/** HTTP headers used for remote message loading. */
export interface RemoteHeaders {
  /** Authorization header (e.g. Bearer token). */
  authorization?: string;
  /** API key header. */
  "x-api-key"?: string;
  /** Additional custom headers. */
  [key: string]: string | undefined;
}

/** Local message loader options. */
interface LocalLoader {
  /** Use local filesystem-based message loading. */
  type: "local";
  /** Root location for resolving message loading sources. */
  rootDir?: string;
  /** Namespaces to load for all routes. */
  namespaces?: string[];
  /** Maximum number of concurrent loading tasks. */
  concurrency?: number;
}

/** Remote message loader options. */
export interface RemoteLoader {
  /** Use remote API-based message loading. */
  type: "remote";
  /** Root location for resolving message loading sources. */
  rootDir?: string;
  /** Namespaces to load for all routes. */
  namespaces?: string[];
  /** Base URL for fetching remote messages. */
  url: string;
  /** Optional headers sent with remote requests. */
  headers?: RemoteHeaders;
}

// Loader options (Local / Remote)
export type LoaderOptions = LocalLoader | RemoteLoader;

export type ServerLoaderOptions = LoaderOptions;
export type ClientLoaderOptions = Omit<RemoteLoader, "type">;
