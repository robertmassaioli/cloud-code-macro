# Agent guide

Context for coding agents working in this repo. Everything below was checked
against the files cited; if something here disagrees with the code, trust the
code and fix this file.

## What this is

"Better Code Macro" (`cloud-code-macro`): an Atlassian **Forge** app providing
code-related macros for **Confluence Cloud**. It was migrated from Atlassian
Connect; `manifest.dhall` still carries an `app.connect.key` so existing
Connect installs map onto the Forge app. Runtime is `nodejs22.x`
(`manifest.dhall`); `.nvmrc` says Node 22.

Macros are declared under `modules.macro` in `manifest.dhall`, all backed by
the single resource key `app`:

| Module key | Title | Status |
|---|---|---|
| `paste-code-macro` | Better code block | Active, featured, bodied (code is the macro body) |
| `in-page-editor` | Code editor | Active, edit code in the page (Monaco editor) |
| `gist-code-macro` | GitHub Gist | Active, autoconverts `https://gist.github.com/*/*` links |
| `bitbucket-snippet-code-macro` | Bitbucket Snippet | Deprecated, `hidden = Some True`; code kept for existing content (see `README_BITBUCKET_SNIPPET.md`) |

Environment builds append a suffix to every macro key (`-dev`, `-local`; none
in prod) via `macroKeySuffix`.

## Repository layout

| Path | Purpose |
|---|---|
| `manifest.dhall` | Shared Dhall manifest template (a function of `connectKey`, `baseUrl`, `macroKeySuffix`). Source of truth. |
| `manifest.{local,dev,prod}.dhall` | Per-environment values; each applies `manifest.dhall`. |
| `manifest.yml` | **Generated and gitignored.** Never edit or commit it. |
| `src/` | Forge backend: function module `resolver` (handler `index.handler`). `index.js` is the main resolver; `bitbucket-snippet-resolver.js` fetches snippets from the Bitbucket API. |
| `static/app/` | The single unified Custom UI frontend (React 18, webpack 5, babel). Build output `static/app/build` is the manifest resource path. |
| `static/app/src/index.js` | Frontend entry; picks the macro by module key. |
| `static/app/src/<macro>/{App,Config}.js` | Per-macro view (`App`) and config panel (`Config`) for `bitbucket-snippet`, `gist-code-macro`, `in-page-editor`, `paste-code-macro`. |
| `ai-planning/` | Numbered design proposals (rules below). Currently `001-unified-frontend-proposal.md`. |
| `scripts/check-ai-planning.js` | Validates `ai-planning/` numbering; run by `npm test`. |
| `.husky/prepare-commit-msg` | Runs `npx jira-prepare-commit-msg` on commit messages. |
| `.bitbucket/` | `CODEOWNERS` and `teams.yml` (legacy Bitbucket-era ownership). |
| `renovate.json` | Extends `local>atlassian/golden-renovate-config:automated`. |
| `bitbucket-pipelines.yml` | **Stale**; see Known quirks. |
| `README.md`, `DEVELOPING.md`, `CONTRIBUTING.md` | Human docs; README is partly stale. |
| `Architecture_Before.md`, `Architecture_After.md`, `AI_Migration_Analysis.md`, `Video_Script_AI_Migration.md`, `README_BITBUCKET_SNIPPET.md`, `openapi.yml` | Migration write-ups and legacy artifacts; background only. |

There is no `docs/` directory, and `uppack/` exists only as a `.gitignore`
entry (legacy build output), not in the repo.

## Architecture

- **Manifest to frontend.** Every macro module uses resource `app`
  (`path = "static/app/build"`, `tunnel.port = 3001`). One bundle serves all
  macros.
- **Routing by module key.** `static/app/src/index.js` uses `forge-module-router`:
  - View (DOM renderer): `ForgeContextProvider` reads `view.getContext()` and
    renders only the matching `<ContextRoute moduleKey=...>`.
  - Config panel (UI Kit / Forge reconciler, not DOM): `ForgeReconciler.addConfig`
    with `createUIKitContextRoute(useProductContext, ...)` -> `UIKitContextRoute`.
  - Matching is prefix-based, so `paste-code-macro` matches `paste-code-macro-dev`.
    `allowedModuleKeys` is listed in both places, so **adding a macro means
    updating `manifest.dhall`, both key lists, and both route trees.**
  - `in-page-editor/App` is `React.lazy` so Monaco is a separate chunk.
- **Per-macro data.** Views read config via `useConfig()` from `@forge/react`
  (paste, gist) or `view.getContext()` from `@forge/bridge` (gist, bitbucket,
  in-page-editor); the in-page editor also uses `invoke` and `requestConfluence`.
- **Backend.** `src/index.js` exports `handler` (a `Resolver` with a trivial
  `getText` definition) and also exports `fetchSnippetData` from
  `src/bitbucket-snippet-resolver.js`. The manifest declares only the
  `resolver` function (`index.handler`), so `fetchSnippetData` has no manifest
  entry; verify before relying on it.
- **Permissions** (`manifest.dhall`): scopes `read:page:confluence` and
  `write:page:confluence`; external script/style allowlist covers
  `cdn.jsdelivr.net`, `gist.github.com`, `github.githubassets.com`,
  `cdnjs.cloudflare.com`; `content.styles = unsafe-inline`. Changing scopes or
  external hosts can require re-consent on install, so flag it to the user.

## Environments and deployment

Only **local**, **dev** and **prod** exist. Staging was removed in `6ac483fb`;
do not reintroduce `*:staging` scripts.

| Script | Does |
|---|---|
| `npm run deploy:local` (alias `npm run deploy`) | `build:all` -> `manifest:local` -> `forge deploy -e local` |
| `npm run deploy:dev` | `build:all` -> `manifest:dev` -> `forge deploy -e development` |
| `npm run deploy:prod` | `build:all` -> `manifest:prod` -> `forge deploy -e production` |
| `deploy-only:{local,dev,prod}` | `forge deploy` only (no build, no manifest) |
| `manifest:{local,dev,prod}` | `dhall-to-yaml-ng --file manifest.<env>.dhall --output manifest.yml` |

- `forge login` is needed once; the first install on a site uses
  `forge install -e <environment>`. After that, deploys are picked up
  automatically. **Production installs pick up `deploy:prod`, so it affects
  real customers immediately.**
- **Deploys, installs, `forge tunnel` and `forge login` are outward-facing.
  Never run them without explicit user approval.** Building and generating the
  manifest locally is fine.
- `manifest:*` needs `dhall-to-yaml-ng` on PATH and overwrites `manifest.yml`
  with whichever environment ran last.

## Build, dev and test commands

Root `package.json`:
- `npm install`, then `npm run install:app` (`cd static/app && npm install`;
  `install:all` is an alias).
- `npm run build:all` / `build:app`: `webpack --mode production` in `static/app`.
- `npm run start:all` / `start:app`: webpack dev server on port 3001 (matches
  `tunnel.port`); pair with `manifest:local` and `forge tunnel -e local`
  (user-run only).
- `npm test` -> `test:ai-planning` -> `node scripts/check-ai-planning.js`. **This
  is the only automated test.** `npm test` in `static/app` is a no-op ("No tests
  specified"), so a green run says nothing about app behavior.
- `npm run ai-planning:next` prints the next proposal number.
- `eslint` and `eslint-plugin-react-hooks` are root devDependencies, but there
  is no lint script; do not assume lint runs anywhere.

## Dependency conventions

- Two lockfiles: `package-lock.json` (root) and `static/app/package-lock.json`.
  Keep each in sync via npm; never hand-edit them.
- In-range updates of Forge packages are done (`87eec370`). **Major upgrades
  are deliberately deferred**; do not bump majors opportunistically.
- Root `package.json` has an `overrides` entry pinning `sha.js` under `@forge/ui`.
- Stale `node_modules` caused a past `createUIKitContextRoute` error (that
  export needs a recent `forge-module-router`; `static/app` requires `^1.2.0`).
  After pulling or switching branches, **run `npm install` in the root and in
  `static/app`** before debugging import errors.
- Renovate (`renovate.json`) may open dependency PRs.

## Known quirks

- `manifest.yml` is generated; if missing or built for the wrong environment,
  run the right `manifest:*` script.
- `bitbucket-pipelines.yml` is stale. It builds `static/in-page-editor`,
  `static/bitbucket-snippet`, `static/gist-code-macro` and
  `static/paste-code-macro` (with `--legacy-peer-deps`) and sources
  `.artifactory/activate.sh`. None of those directories exist (only
  `static/app` does), and the repo is hosted on GitHub. It is not working CI;
  do not copy its paths.
- `README.md` is partly stale: it still describes four sub-packages, ports
  3001-3004, and `start:<macro>` scripts that are not in `package.json`.
  `package.json`, `manifest.dhall` and `static/app/` are authoritative.
- The key suffix means the same code runs under different module keys per
  environment; never hard-code a full key such as `paste-code-macro-dev`.
- `src/bitbucket-snippet-resolver.js` imports `@forge/api`, which is not a
  direct root dependency (it is only available transitively).

## Git and PR conventions

- Remote is GitHub (`robertmassaioli/cloud-code-macro`), default branch `main`;
  use `gh` for PRs. Work on a branch; do not commit to `main`.
- Branch names: `type/short-kebab-description`, e.g. `chore/ai-planning-numbering`,
  `chore/update-forge-dependencies`, `docs/expand-agents-md`.
- Commits: Conventional-Commit style, lower-case imperative subject, e.g.
  `chore: number ai-planning proposals and enforce ordering in tests`,
  `feat: hide Bitbucket Snippet macro and sentence-case macro titles`. Older
  history uses Jira-key prefixes (`ONECLOUD-16435: ...`).
- Agent-authored commits end with a `Co-Authored-By: ... <noreply@anthropic.com>`
  trailer; PR bodies end with the Claude Code attribution line.
- PRs are merged with merge commits (`Merge pull request #N from ...`); keep
  one focused change per PR.

## Do and don't

Do:
- Read a file before claiming something about it, and cite paths.
- Keep changes small and scoped; run `npm test` after touching `ai-planning/`.
- Change `manifest.dhall`, never `manifest.yml`, and keep module keys in sync
  with `static/app/src/index.js`.
- Ask before anything that deploys, installs, tunnels, or changes scopes/egress.

Don't:
- Run `forge deploy`, `npm run deploy*`, `forge install`, `forge tunnel` or
  `forge login` without explicit approval.
- Commit `manifest.yml`, `static/app/build`, `.forge`, `.env*` or `node_modules`.
- Hand-edit lockfiles or do major dependency upgrades unprompted.
- Re-enable or promote the deprecated Bitbucket Snippet macro.
- Renumber, reuse numbers, or leave gaps in `ai-planning/`.

## AI planning proposals (`ai-planning/`)

Design proposals and planning write-ups live in `ai-planning/`.

### Naming

Every file is named `NNN-kebab-case-name.md`:

- `NNN` is a three-digit number, zero-padded, starting at `001`.
- Numbers are assigned in the order proposals are created.
- No gaps and no duplicates. Never renumber or reuse a number.
- Every file in the directory must follow this pattern (dotfiles are ignored).

Example: `001-unified-frontend-proposal.md`.

### Adding a proposal

1. Get the next number: `npm run ai-planning:next` (prints e.g. `002`).
2. Create `ai-planning/<that number>-<short-name>.md`.
3. Run `npm test` to confirm the numbering is valid.

### Enforcement

`npm test` runs `scripts/check-ai-planning.js`, which fails if a file is
misnamed, a number is duplicated, numbering does not start at `001`, or
there is a gap. `node scripts/check-ai-planning.js --next` prints the next
number and exits non-zero if the existing numbering is invalid.
