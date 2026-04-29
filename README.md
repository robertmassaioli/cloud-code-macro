# Better Code Macro for Confluence

Better Code Macro is a free Atlassian Forge app for Confluence Cloud that provides a suite of enhanced code-related macros. It was designed from the ground up for the Confluence Cloud environment, offering a richer authoring and viewing experience than the built-in code block macro.

## Macros

The app provides four Confluence macros:

### Better Code Block
The flagship macro. A bodied macro (meaning it wraps page content) for formatting blocks of source code or markup with syntax highlighting. This is the recommended macro for pasting code directly into a Confluence page.

### Code Editor
An in-page editor experience that allows authors to write and edit code directly within the Confluence editor, with a richer editing experience than the standard macro editor.

### GitHub Gist
Embeds a GitHub Gist directly into a Confluence page. Supports automatic URL conversion — paste a Gist URL (`https://gist.github.com/*/*`) into the page and it will automatically be converted into the macro.

### Bitbucket Snippet _(Deprecated)_
Previously allowed embedding Bitbucket Snippets into Confluence pages. This macro is no longer supported due to technical limitations with the Bitbucket Snippets API and is retained only for backwards compatibility with existing pages.

---

## Architecture

This is a [Forge](https://developer.atlassian.com/platform/forge/) app using the Custom UI approach. Each macro has its own self-contained React frontend, built with webpack and served as a Forge static resource.

```
├── manifest.dhall              # Shared Dhall manifest template
├── manifest.local.dhall        # Environment config for local development
├── manifest.dev.dhall          # Environment config for development
├── manifest.prod.dhall         # Environment config for production
├── src/
│   ├── index.js                # Forge resolver entry point
│   └── bitbucket-snippet-resolver.js
└── static/
    ├── in-page-editor/         # Code Editor macro frontend (React)
    ├── bitbucket-snippet/      # Bitbucket Snippet macro frontend (React)
    ├── gist-code-macro/        # GitHub Gist macro frontend (React)
    └── paste-code-macro/       # Better Code Block macro frontend (React)
```

### Manifest

The app manifest is written in [Dhall](https://dhall-lang.org/) to allow environment-specific configuration (base URL, connect key, macro key suffix) to be composed from a single shared template (`manifest.dhall`). Before deploying, the appropriate Dhall file is compiled to `manifest.yml` using `dhall-to-yaml-ng`.

Each environment's Dhall file passes a different config to the shared template:

| File | Environment | Macro key suffix |
|---|---|---|
| `manifest.local.dhall` | Local tunnel | `-local` |
| `manifest.dev.dhall` | Development | `-dev` |
| `manifest.prod.dhall` | Production | _(none)_ |

### Runtime

The app runs on the **Node.js 22** (`nodejs22.x`) Forge runtime.

---

## Requirements

- [Node.js](https://nodejs.org/) (see `.nvmrc` for the recommended version)
- [Forge CLI](https://developer.atlassian.com/platform/forge/cli-reference/) — install with `npm install -g @forge/cli`
- [dhall-to-yaml-ng](https://github.com/tewtal/dhall-to-yaml-ng) — used to compile the Dhall manifest to YAML

---

## Setup

### 1. Install root dependencies

```bash
npm install
```

### 2. Install sub-package dependencies

Each macro frontend is a separate npm package. Install all of them in parallel:

```bash
npm run install:all
```

> **Note:** If you encounter peer dependency errors, use the `--legacy-peer-deps` flag for each sub-package:
> ```bash
> cd static/in-page-editor && npm install --legacy-peer-deps
> cd static/bitbucket-snippet && npm install --legacy-peer-deps
> cd static/gist-code-macro && npm install --legacy-peer-deps
> cd static/paste-code-macro && npm install --legacy-peer-deps
> ```

### 3. Log in to Forge

```bash
forge login
```

---

## Development

To run a macro frontend locally with hot reloading, start the dev server for that package and use `forge tunnel` to proxy requests:

```bash
# In one terminal — start the frontend dev server(s)
npm run start:paste-code-macro   # starts on port 3004
npm run start:in-page-editor     # starts on port 3001
npm run start:gist-code-macro    # starts on port 3003
npm run start:bitbucket-snippet  # starts on port 3002

# Or start all at once
npm run start:all

# In another terminal — start the Forge tunnel (after generating a manifest)
npm run manifest:local
forge tunnel -e local
```

Tunnel ports are defined in `manifest.dhall` and map to each macro's dev server:

| Macro | Port |
|---|---|
| in-page-editor | 3001 |
| bitbucket-snippet | 3002 |
| gist-code-macro | 3003 |
| paste-code-macro | 3004 |

---

## Build & Deployment

The deployment process has three sequential steps:
1. **Build** all static React frontends with webpack
2. **Generate** `manifest.yml` from the appropriate Dhall environment file
3. **Deploy** to Forge using the Forge CLI

Convenience npm scripts handle all three steps for each environment.

### Deploy to local (tunnel)

```bash
npm run deploy:local
```

### Deploy to development

```bash
npm run deploy:dev
```

### Deploy to staging

```bash
npm run deploy:stg
```

### Deploy to production

```bash
npm run deploy:prod
```

### Running steps individually

If you only want to run a specific step (e.g. you've already built and just want to redeploy):

```bash
# Build all frontends
npm run build:all

# Generate manifest for a specific environment
npm run manifest:dev    # or manifest:local / manifest:stg / manifest:prod

# Deploy only (no build or manifest generation)
npm run deploy-only:dev    # or deploy-only:local / deploy-only:stg / deploy-only:prod
```

### First-time installation

After deploying for the first time to a new environment, install the app on your Atlassian site:

```bash
forge install -e development
```

Once installed, subsequent `forge deploy` runs are picked up automatically — no need to reinstall.

---

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help with Forge development, or refer to the [Forge documentation](https://developer.atlassian.com/platform/forge/) for full reference material.
