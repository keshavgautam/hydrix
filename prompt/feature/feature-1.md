You are a senior staff engineer and framework architect with deep expertise in React, SSR, Vite, and modern web architecture.

I want to design and build a new SSR framework for React from scratch. The goal is NOT to copy Next.js, but to improve on its limitations — especially around unnecessary server re-renders and lack of control over SSR behavior.

## 🎯 Core Goals

1. Fine-grained control over SSR:

   * ssr: "always" | "once" | "never"
2. Avoid unnecessary server execution after initial render
3. Enable client-first navigation by default
4. Provide a clean and minimal developer experience
5. Support hybrid rendering (SSR + SPA behavior)

## 🚨 Problems I want to solve

* In Next.js App Router, server components re-run too often
* No equivalent of shallow routing
* Difficult to control caching vs revalidation
* Over-fetching on navigation

## 🧩 What I want you to design

### 1. Architecture

* Define core layers:

  * Rendering engine (React SSR)
  * Routing system
  * Data fetching layer
  * Cache system
  * Hydration strategy
* Explain how they interact

### 2. SSR Control System (VERY IMPORTANT)

Design a flexible system like:

export const ssr = {
mode: "once", // or "always", "never"
revalidate: 60
}

Explain:

* How this is implemented internally
* How it avoids repeated SSR

### 3. Routing System

* File-based or config-based?
* How client navigation works WITHOUT triggering SSR
* How to sync server + client routes

### 4. Data Fetching Model

Design a hook or API like:

useData("/api/products", {
strategy: "client-first" // or server-only, stale-while-revalidate
})

Explain:

* How caching works
* When server is called vs client
* How to prevent duplicate fetches

### 5. Hydration Strategy

* Full vs partial hydration
* How to minimize JS execution
* Optional: island architecture

### 6. Minimal Working Prototype

Provide:

* Folder structure
* Example server (Node/Express or similar)
* Example React app
* Basic routing implementation

### 7. Trade-offs

* Compare with Next.js
* What we lose vs what we gain

### 8. Step-by-step Implementation Plan

Break into phases:

* MVP
* Intermediate
* Advanced

## ⚙️ Constraints

* Use React + Vite (not Webpack)
* Keep system simple and extensible
* Avoid unnecessary abstractions
* Focus on performance and control

## 🧠 Thinking Style

* Think deeply before answering
* Prioritize clarity + architecture over hype
* Use diagrams or structured explanations where helpful
* Provide code where necessary, but focus on system design

Your goal is to help me design a real, usable framework — not just a theoretical idea.
