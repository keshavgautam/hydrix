import { j as a, u as j } from "./jsx-runtime-ChNbD13L.js";
import { Routes as E, Route as S, useNavigate as T, BrowserRouter as _ } from "react-router-dom";
import { useState as l, useRef as A, useEffect as H } from "react";
import { hydrateRoot as I, createRoot as $ } from "react-dom/client";
function k({ routes: t }) {
  return /* @__PURE__ */ a.jsx(E, { children: t.map((e) => /* @__PURE__ */ a.jsx(
    S,
    {
      path: e.path,
      element: /* @__PURE__ */ a.jsx(e.component, {}),
      children: e.children && /* @__PURE__ */ a.jsx(k, { routes: e.children })
    },
    e.path
  )) });
}
function P() {
  const t = T();
  return (e, o) => {
    t(e, o);
  };
}
const c = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
function B(t) {
  if (typeof window > "u") return;
  const e = window.__HYDRIX_DATA__;
  return e == null ? void 0 : e[t];
}
function X(t, e = {}) {
  const { strategy: o = "client-first", initialData: s, dedupe: r = !0 } = e, i = j(t), u = s ?? i ?? B(t), [x, h] = l(u ?? null), [D, f] = l(o !== "server-only" && !u), [R, p] = l(null), m = A(0);
  async function w() {
    if (o === "server-only") return;
    const g = v.get(t);
    o === "stale-while-revalidate" && g ? (h(g.data), f(!1)) : f(!0);
    try {
      let n;
      r && c.has(t) ? n = c.get(t) : (n = fetch(t).then((d) => {
        if (!d.ok) throw new Error(`HTTP ${d.status}: ${t}`);
        return d.json();
      }), r && (c.set(t, n), n.finally(() => c.delete(t))));
      const y = await n;
      v.set(t, { data: y, fetchedAt: Date.now() }), h(y), p(null);
    } catch (n) {
      p(n instanceof Error ? n : new Error(String(n)));
    } finally {
      f(!1);
    }
  }
  return H(() => {
    w();
  }, [t, m.current]), {
    data: x,
    loading: D,
    error: R,
    revalidate: () => {
      m.current += 1, w();
    }
  };
}
function Y(t, e = {}) {
  const { mode: o = "full", rootId: s = "root" } = e, r = document.getElementById(s);
  if (!r)
    throw new Error(`[hydrix] Root element #${s} not found`);
  const i = /* @__PURE__ */ a.jsx(_, { children: t });
  o === "full" ? I(r, i) : $(r).render(i);
}
export {
  k as H,
  P as a,
  Y as m,
  X as u
};
//# sourceMappingURL=hydrate-BNlpFsd-.js.map
