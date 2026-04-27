# Proposal: Unify All Frontend Packages into a Single Static Resource

## Background

Cloud Code Macro currently ships **four separate frontend static packages**, each with its own `package.json`, `node_modules`, `webpack.config.js`, `build` output, and Forge manifest resource entry:

| Package directory              | Forge resource key        | Forge module key                    | Port |
|-------------------------------|---------------------------|--------------------------------------|------|
| `static/in-page-editor/`      | `in-page-editor`          | `in-page-editor`                     | 3001 |
| `static/bitbucket-snippet/`   | `bitbucket-snippet`       | `bitbucket-snippet-code-macro`       | 3002 |
| `static/gist-code-macro/`     | `gist-code-macro`         | `gist-code-macro`                    | 3003 |
| `static/paste-code-macro/`    | `paste-code-macro`        | `paste-code-macro`                   | 3004 |

This means four separate `npm install` runs, four separate `webpack` builds, four separate `forge tunnel` ports, and four independent dependency trees to keep up to date — all for what is fundamentally one Forge app.

---

## Proposal

Replace the four separate static packages with **a single unified frontend package** at `static/app/`, using [`forge-module-router`](https://www.npmjs.com/package/forge-module-router) to dispatch to the correct component at runtime based on which Forge module is active.

The manifest would be updated to point all four `macro` modules at the single resource, and the four separate resource entries would collapse to one.

---

## How `forge-module-router` Solves This

`forge-module-router` provides `<ForgeContextProvider>` and `<ContextRoute>`, which together read the Forge context at runtime (via `view.getContext()` from `@forge/bridge`) to determine which module is currently active, then render only the matching component tree. This is directly analogous to React Router's `<Routes>/<Route>`, but keyed on `context.moduleKey` instead of the URL path.

The unified entry point looks like:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import ForgeReconciler from '@forge/react';
import { ForgeContextProvider, ContextRoute } from 'forge-module-router';

import { InPageEditorApp, InPageEditorConfig } from './in-page-editor/App';
import { BitbucketSnippetApp, BitbucketSnippetConfig } from './bitbucket-snippet/App';
import { GistCodeMacroApp, GistCodeMacroConfig } from './gist-code-macro/App';
import { PasteCodeMacroApp, PasteCodeMacroConfig } from './paste-code-macro/App';

function App() {
  return (
    <ForgeContextProvider fallback={<div>Loading...</div>}>
      <ContextRoute moduleKey="in-page-editor">
        <InPageEditorApp />
      </ContextRoute>
      <ContextRoute moduleKey="bitbucket-snippet-code-macro">
        <BitbucketSnippetApp />
      </ContextRoute>
      <ContextRoute moduleKey="gist-code-macro">
        <GistCodeMacroApp />
      </ContextRoute>
      <ContextRoute moduleKey="paste-code-macro">
        <PasteCodeMacroApp />
      </ContextRoute>
    </ForgeContextProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// Config panels are also module-specific; ForgeReconciler.addConfig receives
// the right config for each module at runtime using the same context pattern.
ForgeReconciler.addConfig(
  <ForgeContextProvider>
    <ContextRoute moduleKey="in-page-editor">
      <InPageEditorConfig />
    </ContextRoute>
    <ContextRoute moduleKey="bitbucket-snippet-code-macro">
      <BitbucketSnippetConfig />
    </ContextRoute>
    <ContextRoute moduleKey="gist-code-macro">
      <GistCodeMacroConfig />
    </ContextRoute>
    <ContextRoute moduleKey="paste-code-macro">
      <PasteCodeMacroConfig />
    </ContextRoute>
  </ForgeContextProvider>
);
```

Because all four macro modules will point at the same resource, Forge delivers the same bundle regardless of which macro the user is viewing. `forge-module-router` then reads `context.moduleKey` and renders only the branch that matches.

---

## Target Directory Structure

```
static/
  app/                          ← new single package (replaces the four below)
    package.json
    webpack.config.js
    public/
      index.html
    src/
      index.js                  ← unified entry point (see above)
      in-page-editor/
        App.js                  ← moved from static/in-page-editor/src/App.js
        Config.js
        languages.js
      bitbucket-snippet/
        App.js
        Config.js
      gist-code-macro/
        App.js
        Config.js
      paste-code-macro/
        App.js
        Config.js
        languages.js
  in-page-editor/               ← deleted
  bitbucket-snippet/            ← deleted
  gist-code-macro/              ← deleted
  paste-code-macro/             ← deleted
```

---

## Manifest Changes

The four `resources` entries collapse to one, and each `macro` module's `resource` field points to it:

**Before** (`manifest.dhall`, resources section):
```dhall
, resources =
  [ { key = "in-page-editor",    path = "static/in-page-editor/build",    tunnel.port = 3001 }
  , { key = "bitbucket-snippet", path = "static/bitbucket-snippet/build",  tunnel.port = 3002 }
  , { key = "gist-code-macro",   path = "static/gist-code-macro/build",   tunnel.port = 3003 }
  , { key = "paste-code-macro",  path = "static/paste-code-macro/build",  tunnel.port = 3004 }
  ]
```

**After**:
```dhall
, resources =
  [ { key = "app", path = "static/app/build", tunnel.port = 3001 }
  ]
```

Each macro module's `resource` field changes from its individual key to `"app"`:
```dhall
, macro =
  [ { key = "in-page-editor" ++ ...
    , resource = "app"          -- was "in-page-editor"
    ...
    }
  , { key = "bitbucket-snippet-code-macro" ++ ...
    , resource = "app"          -- was "bitbucket-snippet"
    ...
    }
  , { key = "gist-code-macro" ++ ...
    , resource = "app"          -- was "gist-code-macro"
    ...
    }
  , { key = "paste-code-macro" ++ ...
    , resource = "app"          -- was "paste-code-macro"
    ...
    }
  ]
```

---

## New `package.json` for `static/app/`

The unified package merges all dependencies from the four existing packages. The `@forge/bridge` version should be unified to `^5.0.0` (the highest currently in use, in `gist-code-macro` and `bitbucket-snippet`). The `in-page-editor` currently uses `^3.0.0` — upgrading to `^5.0.0` should be tested but is unlikely to be breaking since the bridge API is stable.

```json
{
  "name": "app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@atlaskit/css-reset": "^6.6.2",
    "@atlaskit/section-message": "^6.4.19",
    "@forge/bridge": "^5.0.0",
    "@forge/react": "^11.3.0",
    "@forge/ui": "^1.11.0",
    "@monaco-editor/react": "^4.6.0",
    "buffer": "^6.0.3",
    "forge-module-router": "^1.0.0",
    "highlight.js": "^11.9.0",
    "history": "^5.3.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-is": "^18.2.0",
    "react-router-dom": "^6.0.0",
    "styled-components": "^6.1.8",
    "throttle-debounce": "^5.0.0",
    "ts-is-present": "^1.2.2",
    "web-vitals": "^2.1.4"
  },
  "devDependencies": {
    "@babel/core": "^7.22.0",
    "@babel/preset-env": "^7.22.0",
    "@babel/preset-react": "^7.22.0",
    "babel-loader": "^9.1.0",
    "css-loader": "^6.8.0",
    "html-webpack-plugin": "^5.5.0",
    "style-loader": "^3.3.0",
    "webpack": "^5.88.0",
    "webpack-cli": "^5.1.0",
    "webpack-dev-server": "^4.15.0"
  },
  "scripts": {
    "start": "webpack serve --mode development --port 3001",
    "build": "webpack --mode production",
    "test": "echo \"No tests specified\" && exit 0"
  }
}
```

Note: `styled-components` should be unified to `^6.x`. The `bitbucket-snippet` package currently pins `^5.3.0` while `in-page-editor` uses `^6.1.8`. Both will be consolidated to `^6.1.8` — this may require a minor update to the `bitbucket-snippet` styled components, as v6 has some breaking changes from v5 (primarily around the `as` prop and TypeScript types, neither of which are used in that component).

---

## `root package.json` Script Changes

The four sets of `install:*`, `build:*`, `start:*` scripts collapse to one:

**Before:**
```json
"install:all": "run-p install:in-page-editor install:bitbucket-snippet install:gist-code-macro install:paste-code-macro",
"build:all":   "run-p build:in-page-editor build:bitbucket-snippet build:gist-code-macro build:paste-code-macro",
```

**After:**
```json
"install:app": "cd static/app && npm install",
"build:app":   "cd static/app && npm run build",
"start:app":   "cd static/app && npm start",
"install:all": "npm run install:app",
"build:all":   "npm run build:app",
"start:all":   "npm run start:app",
```

All `deploy:*` scripts continue to work unchanged since they call `build:all`.

---

## Notable Considerations

### `styled-components` v5 → v6 in `bitbucket-snippet`
The `bitbucket-snippet` App uses `styled-components` with standard tagged-template usage only (no advanced features). Upgrading from `^5.3.0` to `^6.1.8` is low risk, but should be verified visually after migration.

### `@forge/bridge` version alignment
`in-page-editor` uses `@forge/bridge@^3.0.0`; the other three use `^5.0.0`. The API surface used (`view.getContext()`, `invoke`, `requestConfluence`) is stable across this range. Unifying to `^5.0.0` is the right move, but the `in-page-editor` integration should be smoke-tested after migration.

### `ForgeReconciler.addConfig` with context routing

> ⚠️ **This is the most important consideration in the whole migration.** The naive approach of wrapping the config components in `<ForgeContextProvider>` + `<ContextRoute>` from `forge-module-router` **will not work**, and there are three distinct options for solving it. See the dedicated section below.

### Build size
`@monaco-editor/react` (used only by `in-page-editor`) is large. Since all four macros will now share one bundle, users of `gist-code-macro` or `paste-code-macro` will download Monaco code they don't need. This is a real trade-off. Two mitigations are available:

1. **Webpack code splitting / lazy loading** — wrap `InPageEditorApp` in `React.lazy()` and `<Suspense>`. Webpack will split Monaco into a separate chunk that is only loaded when `in-page-editor` is the active module. This is the recommended approach.

2. **Accept the size increase** — Monaco's impact is only felt on first load; Forge caches static resources aggressively. Given that these macros are all authored-side UI (editing a page), users who encounter one are plausibly likely to encounter another.

Lazy loading is recommended and straightforward:

```jsx
const InPageEditorApp = React.lazy(() => import('./in-page-editor/App'));

// In the render tree:
<ContextRoute moduleKey="in-page-editor">
  <React.Suspense fallback={<div>Loading editor...</div>}>
    <InPageEditorApp />
  </React.Suspense>
</ContextRoute>
```

### `forge tunnel` — single port
With a single resource, `forge tunnel` only needs to proxy one port (3001). The current workflow of running four dev servers in parallel becomes a single `npm start` in `static/app/`.

---

## The Config Panel Problem: Three Options

### Why the naive approach fails

`ForgeReconciler.addConfig(element)` is **not** a React DOM renderer. Looking at the source in `forge/packages/forge-react/src/reconciler.ts`, it is a **custom React reconciler** that builds a `MacroConfig` Forge document tree and sends it to the Forge host via `self.__bridge.callBridge('reconcile', ...)`. It operates entirely in the **UI Kit rendering pipeline**.

This means:

1. The element you pass to `addConfig` is processed as a **UI Kit component tree** — components like `<Label>`, `<Select>`, and `<Textfield>` from `@forge/react`. These are not DOM elements; they are serialised to a Forge doc and sent over the bridge to be rendered natively by the Forge host.

2. `<ForgeContextProvider>` and `<ContextRoute>` from `forge-module-router` are **Custom UI / React DOM components**. They use `useState`, `useEffect`, and ultimately render to browser DOM. They cannot be placed inside a UI Kit reconciler tree — the two renderers are entirely separate and incompatible.

3. Therefore, passing `<ForgeContextProvider><ContextRoute ...><SomeConfig /></ContextRoute></ForgeContextProvider>` to `ForgeReconciler.addConfig` will fail silently or crash, because `<ForgeContextProvider>` renders `null` until the async context resolves, and if it ever does render children, those children are DOM-based components that the Forge reconciler doesn't know how to serialise.

### The right primitive: `useProductContext`

The correct hook for reading the Forge context inside a UI Kit component tree is `useProductContext()` from `@forge/react`. This has been validated by tracing through the full source stack:

**Call chain:**
```
useProductContext()
  → view.getContext()               [forge-bridge/src/view/getContext.ts]
    → getCallBridge()('getContext') [forge-bridge/src/bridge.ts]
      → globalThis.__bridge.callBridge('getContext')
```

**The critical finding** is in `forge-bridge/src/bridge.ts`:
```typescript
export const getCallBridge = () => {
  if (!isBridgeAvailable(globalThis.__bridge)) {
    throw new BridgeAPIError(...);
  }
  return globalThis.__bridge.callBridge;
};
```

And in the UI Kit reconciler (`forge-react/src/reconciler.ts`):
```typescript
export const callBridge: CallBridge = function (cmd, data) {
  self?.__bridge?.callBridge(cmd, data);
};
```

Both the forge-bridge package and the UI Kit reconciler read from the **same `globalThis.__bridge` / `self.__bridge` object** — these are the same global. The Forge host injects a single `__bridge` object that handles all actions: `'reconcile'` and `'onError'` (used by the UI Kit renderer) as well as `'getContext'`, `'invoke'`, `'submit'` etc. (used by `@forge/bridge`). This is confirmed by `forge-bridge/src/globals.d.ts` which declares `callBridge(action: 'getContext'): Promise<any>` alongside `callBridge(action: 'reconcile')` on the same `GlobalBridge` interface.

**The `useProductContext` test confirms this directly.** Its test renders via `ForgeTestRender.create` (the UI Kit reconciler path) and calls `setupBridge()` once to set `self.__bridge`. `useProductContext` is then called inside the reconciler-rendered component tree and successfully receives context via `view.getContext()`. The test mock context shape confirms `moduleKey` is a top-level field on `FullContext`:

```typescript
// From forge-bridge/src/types.ts — moduleKey is a required top-level field
export interface FullContext {
  moduleKey: string;   // ← exactly what we need for routing
  extension: ExtensionData;
  // ...
}
```

**Conclusion: `useProductContext()` is fully supported inside a `ForgeReconciler.addConfig` component tree.** Both use `globalThis.__bridge` under the hood, so context is always available when the Forge host has injected the bridge — which it always does before executing the app's JavaScript.

---

### Option A — `useProductContext` dispatcher (recommended)

Keep `ForgeReconciler.addConfig` with a single unified UI Kit component that reads `moduleKey` from `useProductContext()` and conditionally renders the correct config. This is the most idiomatic approach and requires no additional packages or architecture.

```jsx
import { useProductContext, Label, Select, Textfield, TextArea } from '@forge/react';
import { InPageEditorConfig } from './in-page-editor/Config';
import { BitbucketSnippetConfig } from './bitbucket-snippet/Config';
import { GistCodeMacroConfig } from './gist-code-macro/Config';
import { PasteCodeMacroConfig } from './paste-code-macro/Config';

const UnifiedConfig = () => {
  const context = useProductContext();

  // context is undefined while loading — return null to render nothing
  if (!context) return null;

  switch (context.moduleKey) {
    case 'in-page-editor':           return <InPageEditorConfig />;
    case 'bitbucket-snippet-code-macro': return <BitbucketSnippetConfig />;
    case 'gist-code-macro':          return <GistCodeMacroConfig />;
    case 'paste-code-macro':         return <PasteCodeMacroConfig />;
    default:                         return null;
  }
};

ForgeReconciler.addConfig(<UnifiedConfig />);
```

**Pros:**
- Entirely within the UI Kit reconciler — no mixing of rendering contexts
- `useProductContext` is the correct, officially-supported hook for this situation
- Config components (`Config.js` files) continue to use `@forge/react` UI Kit components unchanged
- Zero new dependencies

**Cons:**
- The `moduleKey` switch must be kept in sync with the manifest macro keys (minor maintenance concern, same as any routing table)
- There is a brief render where `context` is `undefined` and `null` is returned — this is fine since the Forge host controls config panel lifecycle and won't show a partially-loaded config

---

### Option B — One manifest config function per macro, shared config utilities

Instead of a single unified config component, keep four separate `config` entry points in the manifest but have them all call into shared utility modules. Each macro's `config` field in the manifest points to a different Forge function; each function renders its own dedicated config component. The shared code (e.g. a `languageOptions` helper used by both `in-page-editor` and `paste-code-macro`) lives in a shared module imported by both.

This means:
- The **App** side (Custom UI) is still unified using `forge-module-router` as proposed
- The **Config** side stays as four separate UI Kit entrypoints, but they share code via the unified package's module system

In `manifest.dhall`, each macro keeps its own `config` function key:

```dhall
{ key = "in-page-editor" ++ ...
, resource = "app"           -- unified Custom UI
, config = "in-page-editor-config-fn"   -- separate UI Kit config function
, ...
}
```

And the backend (`src/index.js`) would export four config handlers using `@forge/resolver` or similar.

Actually, in Forge's Custom UI macro model, `config: True` means the config panel is rendered by the **same static resource** as the macro body using `ForgeReconciler.addConfig`. There is no separate function for config. So this option reduces to: have the unified `index.js` call `ForgeReconciler.addConfig` four times with different module key guards — but `addConfig` can only be called once per page load, so this doesn't work cleanly either.

**Verdict: Option B is not viable** in the Custom UI macro config model. `ForgeReconciler.addConfig` is called once from the single static resource entry point. There is no mechanism to have per-macro config entrypoints in Custom UI macros.

---

### Option C — Separate the App and Config entry points via multiple webpack outputs

Keep the config panels as a **separate webpack bundle** (`config.js`) with its own entry point, and configure webpack to produce two outputs from the same source tree: `main.js` (Custom UI, uses `ReactDOM.render` + `forge-module-router`) and `config.js` (UI Kit, uses `ForgeReconciler.addConfig` + `useProductContext`). The `public/index.html` loads only `main.js`; the config entry point is a separate file that the Forge host loads when it needs to render the config panel.

However, Forge Custom UI does **not** support separate entry points for the config panel — the same `index.html` and its loaded scripts are used for both the macro body and the config panel rendering context. The `ForgeReconciler.addConfig` call must happen in the same script that `ReactDOM.render` runs in.

**Verdict: Option C is not viable** given how Forge's static resource model works — one `index.html`, one set of scripts, used for all rendering contexts of that resource.

---

### Summary and Recommendation

| Option | Viable? | Complexity | Notes |
|--------|---------|------------|-------|
| A — `useProductContext` dispatcher | ✅ Yes | Low | Recommended |
| B — Separate config entrypoints | ❌ No | — | Forge doesn't support per-macro config functions in Custom UI |
| C — Multiple webpack outputs | ❌ No | — | Forge loads one `index.html` for both body and config rendering |

**Go with Option A.** The unified `index.js` calls `ReactDOM.render` with a `<ForgeContextProvider>`-wrapped tree for the Custom UI macro body, and also calls `ForgeReconciler.addConfig` with a `useProductContext`-based `<UnifiedConfig />` for the config panel. The two calls use different React renderers but both correctly read the Forge context via `view.getContext()`.

The final unified `index.js` structure is:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import ForgeReconciler from '@forge/react';
import { ForgeContextProvider, ContextRoute } from 'forge-module-router';
import { useProductContext } from '@forge/react';

// Custom UI app components (DOM-rendered)
import { InPageEditorApp } from './in-page-editor/App';
import { BitbucketSnippetApp } from './bitbucket-snippet/App';
import { GistCodeMacroApp } from './gist-code-macro/App';
import { PasteCodeMacroApp } from './paste-code-macro/App';

// UI Kit config components (Forge reconciler-rendered)
import { InPageEditorConfig } from './in-page-editor/Config';
import { BitbucketSnippetConfig } from './bitbucket-snippet/Config';
import { GistCodeMacroConfig } from './gist-code-macro/Config';
import { PasteCodeMacroConfig } from './paste-code-macro/Config';

// ── Custom UI (DOM renderer) ──────────────────────────────────────────────────
const InPageEditorAppLazy = React.lazy(() => import('./in-page-editor/App'));

ReactDOM.render(
  <ForgeContextProvider fallback={<div>Loading...</div>}>
    <ContextRoute moduleKey="in-page-editor">
      <React.Suspense fallback={<div>Loading editor...</div>}>
        <InPageEditorAppLazy />
      </React.Suspense>
    </ContextRoute>
    <ContextRoute moduleKey="bitbucket-snippet-code-macro">
      <BitbucketSnippetApp />
    </ContextRoute>
    <ContextRoute moduleKey="gist-code-macro">
      <GistCodeMacroApp />
    </ContextRoute>
    <ContextRoute moduleKey="paste-code-macro">
      <PasteCodeMacroApp />
    </ContextRoute>
  </ForgeContextProvider>,
  document.getElementById('root')
);

// ── UI Kit config panel (Forge reconciler — NOT DOM) ─────────────────────────
// useProductContext() is the correct hook here; forge-module-router's
// ForgeContextProvider cannot be used inside the Forge reconciler tree.
const UnifiedConfig = () => {
  const context = useProductContext();
  if (!context) return null;

  switch (context.moduleKey) {
    case 'in-page-editor':               return <InPageEditorConfig />;
    case 'bitbucket-snippet-code-macro': return <BitbucketSnippetConfig />;
    case 'gist-code-macro':              return <GistCodeMacroConfig />;
    case 'paste-code-macro':             return <PasteCodeMacroConfig />;
    default:                             return null;
  }
};

ForgeReconciler.addConfig(<UnifiedConfig />);
```

---

## Migration Steps

1. **Create `static/app/`** with the merged `package.json`, a single `webpack.config.js` (based on the existing `in-page-editor` config, which is the most complete), and `public/index.html`.

2. **Move and re-namespace source files** — copy each `App.js`, `Config.js`, and any supporting files (`languages.js`, etc.) into their respective subdirectories under `static/app/src/`.

3. **Write the unified `index.js`** entry point using `forge-module-router` as shown above, with `React.lazy` wrapping for `in-page-editor`.

4. **Upgrade `styled-components`** in the bitbucket-snippet component to v6; verify the deprecation notice renders correctly.

5. **Update `manifest.dhall`** — collapse the four resource entries to one and update all four macro `resource` fields to `"app"`.

6. **Update root `package.json` scripts** to remove the four-package pattern.

7. **Delete** `static/in-page-editor/`, `static/bitbucket-snippet/`, `static/gist-code-macro/`, and `static/paste-code-macro/`.

8. **Test** — run `npm run build:all` from the root, then `forge deploy` to a dev environment and verify each macro renders correctly.

---

## Summary of Benefits

| Concern                     | Before                              | After                          |
|-----------------------------|-------------------------------------|--------------------------------|
| `npm install` runs          | 4                                   | 1                              |
| Webpack builds              | 4 (run in parallel)                 | 1                              |
| `node_modules` trees        | 4                                   | 1                              |
| Forge manifest resources    | 4                                   | 1                              |
| `forge tunnel` ports        | 4                                   | 1                              |
| Dependency version drift    | Each package drifts independently   | Single source of truth         |
| Adding a new macro          | New package + new resource          | New `<ContextRoute>` branch    |
| Shared utility code         | Copy-pasted across packages         | Directly importable            |
