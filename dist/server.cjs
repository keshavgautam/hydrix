"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const o=require("./jsx-runtime-C2yK6HZh.cjs"),p=require("react-dom/server"),f=require("react"),i=require("react-router-dom");function v(e){const r=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const t in e)if(t!=="default"){const a=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,a.get?a:{enumerable:!0,get:()=>e[t]})}}return r.default=e,Object.freeze(r)}const g=v(f);/**
 * @remix-run/router v1.23.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */var l;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(l||(l={}));var d;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(d||(d={}));const m=["post","put","patch","delete"];new Set(m);const w=["get",...m];new Set(w);function y({basename:e,children:r,location:t="/",future:a}){typeof t=="string"&&(t=i.parsePath(t));let s=l.Pop,n={pathname:t.pathname||"/",search:t.search||"",hash:t.hash||"",state:t.state!=null?t.state:null,key:t.key||"default"},c=b();return g.createElement(i.Router,{basename:e,children:r,location:n,navigationType:s,navigator:c,future:a,static:!0})}function b(){return{createHref:S,encodeLocation:R,push(e){throw new Error(`You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(e)})\` somewhere in your app.`)},replace(e){throw new Error(`You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(e)}, { replace: true })\` somewhere in your app.`)},go(e){throw new Error(`You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${e})\` somewhere in your app.`)},back(){throw new Error("You cannot use navigator.back() on the server because it is a stateless environment.")},forward(){throw new Error("You cannot use navigator.forward() on the server because it is a stateless environment.")}}}function S(e){return typeof e=="string"?e:i.createPath(e)}function R(e){let r=typeof e=="string"?e:i.createPath(e);r=r.replace(/ $/,"%20");let t=D.test(r)?new URL(r):new URL(r,"http://localhost");return{pathname:t.pathname,search:t.search,hash:t.hash}}const D=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;class E{constructor(){this.store=new Map}get(r){const t=this.store.get(r);return t?t.expiresAt!==null&&Date.now()>t.expiresAt?(this.store.delete(r),null):t.html:null}set(r,t,a){this.store.set(r,{html:t,expiresAt:a!=null?Date.now()+a:null})}invalidate(r){this.store.delete(r)}invalidateAll(){this.store.clear()}size(){return this.store.size}}const h=new E;async function j(e,r,t={mode:"always"}){const a=r.url;if(t.mode==="never")return{html:"",fromCache:!1};if(t.mode==="once"){const n=h.get(a);if(n)return{html:n,fromCache:!0}}const s=p.renderToString(o.jsxRuntimeExports.jsx(o.SSRDataContext.Provider,{value:r.ssrData??{},children:o.jsxRuntimeExports.jsx(y,{location:r.url,children:e})}));if(t.mode==="once"){const n=t.revalidate?t.revalidate*1e3:void 0;h.set(a,s,n)}return{html:s,fromCache:!1}}function x(e,{title:r="Hydrix App",scripts:t=[],styles:a=[],initialData:s={}}={}){const n=t.map(u=>`<script type="module" src="${u}"><\/script>`).join(`
`),c=a.map(u=>`<link rel="stylesheet" href="${u}">`).join(`
`);return`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${r}</title>
    ${c}
  </head>
  <body>
    <div id="root">${e}</div>
    <script>window.__HYDRIX_DATA__ = ${JSON.stringify(s)};<\/script>
    ${n}
  </body>
</html>`}exports.SSRDataContext=o.SSRDataContext;exports.createHtmlDocument=x;exports.renderPage=j;exports.ssrCache=h;
//# sourceMappingURL=server.cjs.map
