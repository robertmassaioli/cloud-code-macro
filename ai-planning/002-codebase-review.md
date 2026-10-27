# 002: Codebase review and improvement recommendations

- **Status:** Proposal
- **Date:** 2026-10-26
- **Scope:** Whole repository (`src/`, `static/app`, manifests, CI, docs, tooling)
- **Method:** Read-only review by a sub-agent, with the load-bearing claims spot-checked
  afterwards (see "Verification"). Items marked *(suspicion)* were not confirmed.

## Summary

The live product is the `static/app` frontend plus the manifest. The Forge backend in `src/`
is dead code. The in-page editor has real save-path bugs, the Gist macro injects third-party
`document.write` output, and CI and several docs describe a four-package layout that no
longer exists. Apart from the ai-planning filename check there are no tests.

Recommended order of work:

1. Rewrite CI and delete the dead backend and unused dependencies.
2. Fix the in-page editor save logic and the code block loading flash.
3. Harden the Gist macro.
4. Trim the highlight.js bundle.
5. Add lint, formatting and real tests.
6. Feature work (see the end of this document).

## Bugs

| # | Severity | Issue | Where | Suggested fix |
|---|----------|-------|-------|---------------|
| B1 | Medium | Code block briefly renders "// No code content provided". `useConfig()` returns `undefined` until `view.getContext()` resolves, and `\|\| {}` creates a new object on every render, so the effect sets `loading` to false immediately. | `static/app/src/paste-code-macro/App.js:10-14,63-79` | Treat `undefined` config as loading; drop `\|\| {}`. |
| B2 | Medium | Theme default and migrated Connect theme names do not resolve. The config defaults to "Github Gist", which is not a key in `HIGHLIGHT_THEMES`, so rendering falls back to GitHub. Other Connect names ("Atelier ...", "Kimbie.dark") likely do too. | `paste-code-macro/Config.js:42`, `App.js:26`, `languages.js` | Add a Connect-name to hljs-theme alias map; use real keys as defaults. |
| B3 | Medium | Editor autosave can lose or duplicate data. `debounce(...)` is recreated on every render. The first-save POST has no `response.ok` check or catch, so two edits before `setData` returns send two POSTs and the second gets a 409. `data.version.number + 1` is read from a stale closure, so rapid saves hit 409 and show "out of sync". | `in-page-editor/App.js:92-138` | Create the debounce with `useMemo`/`useRef`; serialise saves with a ref queue; handle POST errors; read the version from a ref. |
| B4 | Low | A non-OK GET (403, 5xx) silently resets the editor to default text, which the next edit can then save over real content. `results.length === 1` ignores duplicates. Monaco `defaultValue`/`defaultLanguage` are uncontrolled, so a refresh does not update content. | `in-page-editor/App.js:43-71,162` | Default only on an empty result; surface errors; use controlled props. |
| B5 | Low | Gist loader leaks and races. The effect has no cleanup and overrides global `document.write`, restoring it only on load/error, so re-runs or unmounts leave it patched. Script tags are never removed. `innerHTML +=` re-parses on every write. The `.js` suffix logic breaks on a trailing slash or query string. `view.getContext` is in the dependency array. | `gist-code-macro/App.js:12-65` | Add effect cleanup; restore `document.write` in a `finally`; parse the URL with `new URL`. |
| B6 | Low | `ReactDOM.render` is deprecated in React 18. | `static/app/src/index.js:23` | Use `createRoot`. |
| B7 | Low *(suspicion)* | Bitbucket Snippet reads `extension.autoConvertLink`; unclear that autoconvert exposes it there (the Gist app uses the same path). | `bitbucket-snippet/App.js:58` | Verify in a real environment. |
| B8 | *(suspicion)* | `index.js` mounts the macro tree and calls `ForgeReconciler.addConfig` in one bundle; if the config iframe loads the same bundle, the macro app also mounts there. | `static/app/src/index.js` | Verify in a real environment. |

## Security

| # | Severity | Issue | Where | Suggested fix |
|---|----------|-------|-------|---------------|
| S1 | Low-Medium | `config.gistUrl` is user-supplied and becomes `script.src` with no host or path check. The manifest `external.scripts` list is the only guard, so any editor can load any `gist.github.com/<user>/<id>.js`, whose content anyone can author. | `gist-code-macro/App.js:16-43` | Validate: `https:`, host `gist.github.com`, path `^/[\w-]+/[0-9a-f]+(\.js)?$`. |
| S2 | Low-Medium | Gist output is injected with `innerHTML` and runs in the Forge iframe. GitHub escapes gist contents, so this is trust in GitHub rather than an observed XSS. *(exploitability is a suspicion)* | `gist-code-macro/App.js:33,37` | Render in a sandboxed `<iframe srcdoc>`. |
| S3 | Low | `content.styles: unsafe-inline` and `external.scripts` allowing all of `cdn.jsdelivr.net` (needed for the Monaco loader) are broader than necessary. | `manifest.dhall:74` and the permissions block | Self-host Monaco and drop the jsDelivr scripts entry. |
| S4 | Low | Scopes are `read:page:confluence` and `write:page:confluence`; confirm `write:page` is not wider than the property endpoints need. | `manifest.dhall:73` | Verify against the endpoints used. |
| S5 | Low (dormant) | The Bitbucket resolver fetches `file.links.self.href` from API output without host validation. Unreachable today (see T1) but exploitable if wired up. | `src/bitbucket-snippet-resolver.js:64` | Delete with the dead backend, or allow-list hosts. |

No secrets were found.

## Cleanup and tech debt

| # | Severity | Issue | Suggested fix |
|---|----------|-------|---------------|
| T1 | High | The `src/` backend is dead. `manifest.dhall` defines a `resolver` function but no macro references it. `src/index.js` is a `getText` stub returning "Hello, world!". `bitbucketSnippetHandler.fetchSnippetData` is `undefined` (the module exports a handler, not that property). The Bitbucket resolver calls `api.bitbucket.org` with no `external.fetch.backend` permission. `@forge/ui` imports in `src/index.js` are unused; `@forge/api` is imported but not a declared dependency. | Delete `src/`, the `function` module, and root deps `@forge/resolver` and `@forge/ui`. This also removes the deferred `@forge/resolver` 2 upgrade. |
| T2 | Medium | Unused `static/app` dependencies: `history`, `react-is`, `web-vitals`, `@atlaskit/css-reset`, `react-router-dom`, `@forge/ui` (no import in `static/app/src`; confirmed for each). `buffer` is used only through the webpack ProvidePlugin. | Remove them. |
| T3 | Medium | Stale docs. `README.md` describes four `static/*` packages, `start:*` scripts and ports 3001-3004; reality is one `static/app` package, one resource `app`, one tunnel port. `CONTRIBUTING.md` and `DEVELOPING.md` are empty. `README_BITBUCKET_SNIPPET.md` describes a removed module. The root write-ups (`AI_Migration_Analysis.md`, `Architecture_*.md`, `Video_Script_AI_Migration.md`) sit alongside `docs/forge-clients-migration-proposal.md` and the `ai-planning/` proposals. | Update the README; fill or delete the empty files; move or archive the root write-ups into `ai-planning/` or `docs/`. |
| T4 | Low | `baseUrl` in the Dhall `Config` type is set by dev, prod and local but never consumed. | Remove, or use it if it is meant for Connect migration. |
| T5 | Low | `manifest.yml` is gitignored and generated, so the checked-out copy is whichever environment was generated last. | Document it (done in `AGENTS.md`); consider a CI check that generation succeeds. |
| T6 | Low | Theme CSS comes from cdnjs hljs 11.11.1 (`languages.js` `themeUrl`) while the bundle uses `highlight.js ^11.9`. | Pin the same version, or bundle the themes. |
| T7 | Low | Package name `confluence-macro-custom-ui` and version `1.0.40` are meaningless for a private app. | Rename or drop the version. |
| T8 | Low | The in-page-editor, Gist and Bitbucket `Config.js` components are near-identical. The code block macro is `bodied` and also has a `codeContent` TextArea *(intent is a suspicion)*. | Extract a shared config component. |

## Tooling, CI and tests

| # | Severity | Issue | Suggested fix |
|---|----------|-------|---------------|
| C1 | High | `bitbucket-pipelines.yml` (lines 19-53) builds `static/in-page-editor`, `static/bitbucket-snippet`, `static/gist-code-macro` and `static/paste-code-macro`. None are tracked in git; they exist only as local gitignored `build/` and `node_modules/` leftovers, so those steps fail on a clean checkout. `static/app` is never built. | Rewrite: install root, install and build `static/app`, run `npm test`. Drop `docker: true` and `size: 2x` unless needed. |
| C2 | High | No real tests. Root `npm test` runs only `scripts/check-ai-planning.js`; `static/app` `test` is an `echo`. | Add Vitest or Jest with React Testing Library; cover URL parsing, the gist URL validator, and the code block state. |
| C3 | Medium | `eslint` and `eslint-plugin-react-hooks` are installed but there is no ESLint config or script; `.husky/prepare-commit-msg` only runs `jira-prepare-commit-msg`. | Add ESLint config, Prettier, and a CI lint step. |
| C4 | Medium | Plain JavaScript, no types. | Consider TypeScript or `checkJs`. |
| C5 | Low | No `engines` field next to `.nvmrc` (22). `manifest:*` scripts silently require `dhall-to-yaml-ng`. Nothing in CI validates the manifest. | Add `engines`; add `forge lint` or a Dhall type check to CI. |

## Improvements

- **Bundle size (Medium).** `import hljs from 'highlight.js'` (`paste-code-macro/App.js:3`)
  pulls in every language and is most of the ~1.8 MiB `vendors.*.js`. Use
  `highlight.js/lib/core` with lazy per-language `import()` (or `lib/common`). Lazy-load each
  macro app and move the vendor `splitChunks` group to per-route chunks so each macro
  downloads only its own code.
- **Noise (Low).** Remove `console.log` calls on every render in `paste-code-macro/App.js`
  and the Gist app. Replace `document.head` `<link>` manipulation with state and effect
  cleanup so theme links do not accumulate on fallback.
- **Theming and accessibility (Low).** Hard-coded hex colours (`#f6f8fa`, `#d1d9e0`) in the
  code block ignore Atlassian dark mode; use `--ds-*` tokens.

## Feature recommendations

Effort: S = small, M = medium, L = large.

| Effort | Feature | Rationale |
|--------|---------|-----------|
| S | Line numbers and line highlighting | Standard for code macros; cheap with hljs plugins. |
| S | "Copied" feedback on the Copy button | Currently no feedback. |
| S-M | Theme preview and automatic light/dark pairs | Follows Confluence appearance. |
| M | Collapsible blocks and word-wrap option | Long code blocks. |
| M | Self-host Monaco and highlight.js themes | Security and performance; removes jsDelivr and cdnjs from egress. |
| M | Replace the Bitbucket Snippet stub with a real egress-backed resolver, or remove the module once Connect is retired | The macro is deprecated and hidden today. |
| M | Gist file selector and single-file embeds, via a resolver with egress | Gists often hold several files. |
| M-L | A fuller "Code editor" mode: size-limited page-property storage, read-only view for viewers, property cleanup when a macro is deleted | Addresses the editor's data-loss risks. |
| L | "Insert from repo URL" (GitHub, Bitbucket, GitLab raw files) with allow-listed egress | New capability. |

## Verification

Spot-checked after the review, by reading the code:

- Confirmed: `src/index.js` is the stub described; `fetchSnippetData` is undefined;
  `manifest.dhall` defines `resolver`; CI `cd`s into the four old directories; none of the six
  listed `static/app` dependencies are imported; `debounce(2000, onUpdate)` is created in the
  render body at `in-page-editor/App.js:138`; `paste-code-macro/App.js:3` imports all of
  highlight.js.
- Correction to the raw review: a `docs/` directory does exist
  (`docs/forge-clients-migration-proposal.md`).
- Not re-verified: bug items B1-B5 beyond the lines above, and the security items
  (read from code, not exercised in a running environment).

## Suggested follow-ups

Each of these would be its own PR (and a numbered proposal where it needs design):

1. CI rewrite plus dead backend and unused dependency removal (T1, T2, C1).
2. In-page editor save and load fixes (B3, B4) with tests.
3. Gist macro hardening (B5, S1, S2).
4. Code block fixes and bundle trim (B1, B2, B6, bundle size).
5. Lint, format and test tooling (C2-C5).
