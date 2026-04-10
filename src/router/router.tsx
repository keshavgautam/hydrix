import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import type { RouteDefinition, RouterConfig } from "./types.js";

/**
 * Renders a route tree from a config array.
 * Client navigation uses react-router-dom and never triggers SSR.
 */
export function HydrixRoutes({ routes }: Pick<RouterConfig, "routes">) {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<route.component />}
        >
          {route.children && <HydrixRoutes routes={route.children} />}
        </Route>
      ))}
    </Routes>
  );
}

/**
 * Client-side navigation hook — navigates without server round-trips.
 */
export function useNavigateTo() {
  const navigate = useNavigate();
  return (to: string, options?: { replace?: boolean; state?: unknown }) => {
    navigate(to, options);
  };
}

export { useLocation };
