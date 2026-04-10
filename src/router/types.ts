import type { ComponentType } from "react";
import type { SSRConfig } from "../ssr/types.js";

export interface RouteDefinition {
  path: string;
  component: ComponentType;
  ssr?: SSRConfig;
  children?: RouteDefinition[];
}

export interface RouterConfig {
  routes: RouteDefinition[];
  basename?: string;
}
