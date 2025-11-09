/**
 * @example
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

type BaseLoaderOptions = {
  basePath?: string;
  namespaces?: string[];
  routeNamespaces?: RouteNamespaces;
  concurrency?: number;
  lazyLoad?: boolean;
};

// Import loader
type ImportLoader = BaseLoaderOptions & {
  type: "import";
};

// Api loader
export type ApiLoader = BaseLoaderOptions & {
  type: "api";
  apiUrl: string;
  fullReload?: boolean;
};

// Loader options (Import / Api)
export type LoaderOptions = ImportLoader | ApiLoader;
