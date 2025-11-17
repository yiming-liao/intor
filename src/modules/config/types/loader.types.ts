/**
 * ```ts
 * {
 *  default: ["ui", "meta"],
 *  "/auth": ["auth", "admin"],
 * }
 * // When pathname is "/" => namespaces: ["ui", "meta"]
 * // When pathname is "/auth" => namespaces: ["ui", "meta", "auth", "admin"]
 * ```
 */
export type RouteNamespaces =
  | { [key: string]: string[] }
  | { [key: string]: string[]; default: string[] };

export interface RemoteHeaders {
  authorization?: string; // Bearer token
  "x-api-key"?: string; // API Key
  [key: string]: string | undefined; // Custom header
}

type BaseLoaderOptions = {
  rootDir?: string;
  namespaces?: string[];
  routeNamespaces?: RouteNamespaces;
  concurrency?: number;
  lazyLoad?: boolean;
};

// Local loader
type LocalLoader = BaseLoaderOptions & {
  type: "local";
};

// Remote loader
export type RemoteLoader = BaseLoaderOptions & {
  type: "remote";
  remoteUrl: string;
  remoteHeaders?: RemoteHeaders;
  fullReload?: boolean;
};

// Loader options (Local / Remote)
export type LoaderOptions = LocalLoader | RemoteLoader;
