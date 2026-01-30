export type AnyRoute = {
  url: string;
  [key: string]: any;
};

export type RouteParams = Record<string, string | number | boolean | null | undefined>;

export type QueryParams = Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined>;

export interface RouteDefinition {
  url: string;
  params?: RouteParams;
  query?: QueryParams;
  fragment?: string;
  [key: string]: any;
}

export interface RouteHelperConfig {
  baseUrl?: string;
  trailingSlash?: boolean;
  validateRoutes?: boolean;
}

