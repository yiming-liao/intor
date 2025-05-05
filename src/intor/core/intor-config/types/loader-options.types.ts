/**
 * routeNamespaces: {
 *  default: ['ui', 'error']
 *  '/': ['home-page']
 *  '/about': ['about-page']
 * }
 */
export type RouteNamespaces =
  | { [key: string]: string[] }
  | { [key: string]: string[]; default: string[] };

type BaseLoaderOptions = {
  basePath?: string;
  namespaces?: string[];
  routeNamespaces?: RouteNamespaces;
  concurrency?: number;
};

// Import loader
type ImportLoader = BaseLoaderOptions & {
  type: "import";
};

// Api loader
export type ApiLoader = BaseLoaderOptions & {
  type: "api";
  apiUrl: string;
};

// Loader options (Import / Api)
export type LoaderOptions = ImportLoader | ApiLoader;

export type ResolvedLoaderOptions = Required<BaseLoaderOptions>;
