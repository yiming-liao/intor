/** HTTP headers used for remote message loading. */
export interface RemoteHeaders {
  /** Authorization header (e.g. Bearer token). */
  authorization?: string;
  /** API key header. */
  "x-api-key"?: string;
  /** Custom headers. */
  [key: string]: string | undefined;
}

/** Base options shared by all message loaders. */
type BaseLoaderOptions = {
  /** Root location for resolving message loading sources. */
  rootDir?: string;
  /** Namespaces to load for all routes. */
  namespaces?: string[];
  /** Maximum number of concurrent loading tasks. */
  concurrency?: number;
};

/** Local message loader options. */
type LocalLoader = BaseLoaderOptions & {
  /** Use local filesystem-based message loading. */
  type: "local";
};

/** Remote message loader options. */
export type RemoteLoader = BaseLoaderOptions & {
  /** Use remote API-based message loading. */
  type: "remote";
  /** Base URL for fetching remote messages. */
  remoteUrl: string;
  /** Optional headers sent with remote requests. */
  remoteHeaders?: RemoteHeaders;
  /** Use full page reload for client-side navigation. */
  fullReload?: boolean;
};

// Loader options (Local / Remote)
export type LoaderOptions = LocalLoader | RemoteLoader;
