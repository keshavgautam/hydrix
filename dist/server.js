import { j as h, S as p } from "./jsx-runtime-ChNbD13L.js";
import { renderToString as v } from "react-dom/server";
import * as f from "react";
import { parsePath as w, Router as g, createPath as d } from "react-router-dom";
/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
var c;
(function(e) {
  e.Pop = "POP", e.Push = "PUSH", e.Replace = "REPLACE";
})(c || (c = {}));
var l;
(function(e) {
  e.data = "data", e.deferred = "deferred", e.redirect = "redirect", e.error = "error";
})(l || (l = {}));
const m = ["post", "put", "patch", "delete"];
new Set(m);
const y = ["get", ...m];
new Set(y);
function b({
  basename: e,
  children: r,
  location: t = "/",
  future: a
}) {
  typeof t == "string" && (t = w(t));
  let s = c.Pop, n = {
    pathname: t.pathname || "/",
    search: t.search || "",
    hash: t.hash || "",
    state: t.state != null ? t.state : null,
    key: t.key || "default"
  }, i = S();
  return /* @__PURE__ */ f.createElement(g, {
    basename: e,
    children: r,
    location: n,
    navigationType: s,
    navigator: i,
    future: a,
    static: !0
  });
}
function S() {
  return {
    createHref: E,
    encodeLocation: R,
    push(e) {
      throw new Error(`You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(e)})\` somewhere in your app.`);
    },
    replace(e) {
      throw new Error(`You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(e)}, { replace: true })\` somewhere in your app.`);
    },
    go(e) {
      throw new Error(`You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${e})\` somewhere in your app.`);
    },
    back() {
      throw new Error("You cannot use navigator.back() on the server because it is a stateless environment.");
    },
    forward() {
      throw new Error("You cannot use navigator.forward() on the server because it is a stateless environment.");
    }
  };
}
function E(e) {
  return typeof e == "string" ? e : d(e);
}
function R(e) {
  let r = typeof e == "string" ? e : d(e);
  r = r.replace(/ $/, "%20");
  let t = $.test(r) ? new URL(r) : new URL(r, "http://localhost");
  return {
    pathname: t.pathname,
    search: t.search,
    hash: t.hash
  };
}
const $ = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
class A {
  constructor() {
    this.store = /* @__PURE__ */ new Map();
  }
  get(r) {
    const t = this.store.get(r);
    return t ? t.expiresAt !== null && Date.now() > t.expiresAt ? (this.store.delete(r), null) : t.html : null;
  }
  set(r, t, a) {
    this.store.set(r, {
      html: t,
      expiresAt: a != null ? Date.now() + a : null
    });
  }
  invalidate(r) {
    this.store.delete(r);
  }
  invalidateAll() {
    this.store.clear();
  }
  size() {
    return this.store.size;
  }
}
const u = new A();
async function Y(e, r, t = { mode: "always" }) {
  const a = r.url;
  if (t.mode === "never")
    return { html: "", fromCache: !1 };
  if (t.mode === "once") {
    const n = u.get(a);
    if (n) return { html: n, fromCache: !0 };
  }
  const s = v(
    /* @__PURE__ */ h.jsx(p.Provider, { value: r.ssrData ?? {}, children: /* @__PURE__ */ h.jsx(b, { location: r.url, children: e }) })
  );
  if (t.mode === "once") {
    const n = t.revalidate ? t.revalidate * 1e3 : void 0;
    u.set(a, s, n);
  }
  return { html: s, fromCache: !1 };
}
function _(e, {
  title: r = "Hydrix App",
  scripts: t = [],
  styles: a = [],
  initialData: s = {}
} = {}) {
  const n = t.map((o) => `<script type="module" src="${o}"><\/script>`).join(`
`), i = a.map((o) => `<link rel="stylesheet" href="${o}">`).join(`
`);
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${r}</title>
    ${i}
  </head>
  <body>
    <div id="root">${e}</div>
    <script>window.__HYDRIX_DATA__ = ${JSON.stringify(s)};<\/script>
    ${n}
  </body>
</html>`;
}
export {
  p as SSRDataContext,
  _ as createHtmlDocument,
  Y as renderPage,
  u as ssrCache
};
//# sourceMappingURL=server.js.map
