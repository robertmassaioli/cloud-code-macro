# 003: Internationalise the macros the way `localised-date-time` does

- **Status:** Proposal
- **Date:** 2026-10-28
- **Scope:** Macro titles and descriptions, config panels, view-time messages, locale files, manifest, tests
- **Reference implementation:** the sibling repository `localised-date-time` (`src/i18n.js`, `src/frontend/MacroIntlProvider.jsx`, `src/frontend/useTranslate.js`, `locales/`, `src/__tests__/locales.test.js`, and its proposal `ai-proposals/005-i18n-all-locales.md`)

## Summary

Every user-visible string in this app is hard-coded English: four macro titles and descriptions in `manifest.dhall`, the config panel labels and placeholders, and a handful of messages shown on the page. `localised-date-time` already solved this for Forge with one translation file per supported Forge locale, loaded on demand for the viewer, formatted with `react-intl` (ICU MessageFormat), and guarded by a test that keeps every locale file complete.

This proposal copies that design and adapts it to the one real difference between the two apps. `localised-date-time` is pure UI Kit. This app is **mixed**: the macro views are Custom UI rendered into the DOM, and the config panels are UI Kit rendered by `ForgeReconciler`. That means two translation entry points, not one.

## How `localised-date-time` does it

Read from its source and `AGENTS.md`:

1. **One file per Forge locale.** `locales/<code>.json` for all 26 codes on the [Forge supported locale codes](https://developer.atlassian.com/platform/forge/manifest-reference/forge-supported-locale-codes/) page, nested keys (`config.time.label`), all registered under `translations.resources` in `manifest.yml` with `translations.fallback.default: en-GB`.
2. **Manifest strings are keys.** Macro `title` and `description` use `i18n: macro.nonrepeating.title`, so Confluence's macro browser shows them translated.
3. **Only the viewer's file is fetched.** `MacroIntlProvider` calls `i18n.getTranslations(locale)` from `@forge/bridge` and wraps children in react-intl's `IntlProvider`. It renders a `<Spinner />` while loading and falls back to showing keys if loading fails.
4. **`resolveLocale()` bridges a platform gap.** `view.getContext()` passes unmapped locales (`en-AU`, `de-AT`, `fr-CA`) through unchanged, which would otherwise fall back to English. `resolveLocale` maps exact match, then overrides (`nb` to `no-NO`, `zh-HK` to `zh-TW`), then same language, then the default.
5. **`t(key, params)` everywhere.** `useTranslate()` returns `t` for components. `createTranslator(locale, translations)` builds the same function outside React. Messages are ICU, so `{name}` placeholders, plurals and selects work. `flattenMessages` turns the nested file into react-intl's flat ids. A missing translation returns the key silently, and any other formatting error is logged with `console.warn`.
6. **A test keeps the locales honest** (`locales.test.js`): valid JSON, every registered file exists with no orphans, key sets equal the default locale's, `{placeholders}` match per key, no empty values, every `i18n:` key in the manifest and every `t('...')` key used in `src/` exists in the default locale, the manifest lists exactly the 26 expected codes, and the combined size stays under Forge's 100 KB limit (about 91 KB across its 26 files today, so the limit matters).
7. **Convention in `AGENTS.md`:** never hard-code English; a new key goes into every locale file; do not put plain strings back in the manifest.
8. **Translation quality:** text written by a model in a formal-neutral register, with one term per concept per language, and the PR says native-speaker review is still needed.

## How this app differs

| Concern | `localised-date-time` | This repo (`cloud-code-macro`) |
|---------|----------------------|-------------------------------|
| Renderer | UI Kit only | Custom UI for macro views (`ReactDOM.render` in `static/app/src/index.js`), UI Kit for config (`ForgeReconciler.addConfig`) |
| Provider | One `MacroIntlProvider` using `useProductContext()` | Two: a DOM provider for views (locale from `view.getContext()`) and a UI Kit provider for config (locale from `useProductContext()`) |
| Manifest | Hand-written `manifest.yml` | Generated from `manifest.dhall` (`dhall-to-yaml-ng`), so the translations block and `i18n:` keys come from Dhall |
| Strings | About 39 keys, mostly config | Fewer, but a mix of config labels, view messages, and the manifest |
| Server side | An ADF export function needs a translator | No resolver in use (see proposal 002, T1), so no server-side translator is needed |
| Versions | `@forge/react` 12, `@forge/bridge` 7 | `@forge/react` 11.17, `@forge/bridge` 5.17. Both already export what is needed: `i18n` from the bridge, and `useTranslation` and `I18nProvider` from `@forge/react` |

## String inventory

| # | Area | Files | Strings |
|---|------|-------|---------|
| 1.1 | Macro `title` and `description` (4 macros) | `manifest.dhall` | "Code editor", "Bitbucket Snippet", "GitHub Gist", "Better code block" plus a description each |
| 1.2 | Code block config labels and placeholders | `paste-code-macro/Config.js` | "Code Content", "Language", "Title", "Theme", "Paste your code here...", "Optional title for your code block" |
| 1.3 | Gist and Bitbucket config | `gist-code-macro/Config.js`, `bitbucket-snippet/Config.js` | "Gist URL", "Snippet URL" and their placeholders (the URL examples stay literal) |
| 1.4 | In-page editor config | `in-page-editor/Config.js` | "Language" |
| 1.5 | Code block view | `paste-code-macro/App.js` | "// No code content provided / // Please add code content in the macro configuration", "Failed to load macro data", "Error: {error}", the "Copy" button label and its "Copy to clipboard" tooltip |
| 1.6 | In-page editor view | `in-page-editor/App.js` | "Loading context...", "Loading data...", "Data out of sync", the explanatory paragraph and two bullets, "Refresh" |
| 1.7 | Gist view | `gist-code-macro/App.js` | "Error loading gist" (currently built as an HTML string) |
| 1.8 | Bitbucket deprecation notice | `bitbucket-snippet/App.js` | Title, two paragraphs, "View Snippet on Bitbucket" |
| 1.9 | Router fallbacks | `static/app/src/index.js` | "Loading...", "Loading editor..." |

Not translated:

- The language and theme lists in `languages.js`. These are proper nouns ("JavaScript", "Dracula", "GitHub"), and highlight.js identifiers must stay as they are.
- Log messages (`console.*`).
- Code the user typed or pasted.
- The Connect-era theme names kept for migration (see proposal 002, B2).

Estimate: about 40 keys per locale, so roughly 26 files of 2 to 4 KB each, comfortably below the 100 KB combined limit.

## Design

### 1. Dependencies

Add `react-intl` to `static/app` only (the repo has no live backend, so nothing is needed at the root). Use the same major as the reference, `react-intl@^12`, and confirm it bundles under webpack 5 without extra polyfills. Note the existing bundle-size concern (proposal 002, "Bundle size"): `react-intl` is a modest addition next to the 1.8 MiB highlight.js problem, and per-locale message files are fetched on demand, not bundled.

### 2. Shared module `static/app/src/i18n.js`

Port, trimmed to what this app needs:

- `DEFAULT_LOCALE = 'en-GB'` and `SUPPORTED_LOCALES` (the 26 codes).
- `resolveLocale()` exactly as in the reference, with its overrides and `PREFERRED_FOR_LANGUAGE`.
- `flattenMessages()`, `onIntlError()` and `makeTranslate()`.
- Skip `formattingLocale()` and `createTranslator()`: this app formats no dates and has no non-React caller.

Keep `localised-date-time` as the source of truth for the locale list and mapping rules, and note in the file header where it was ported from. Copying is acceptable for now. If a third app needs it, extract a shared package.

### 3. Two providers, one `t`

- **`ViewIntlProvider` (Custom UI).** Same as the reference's `MacroIntlProvider`, but reads the locale from `view.getContext()` instead of `useProductContext()`, and renders a plain `<div>Loading...</div>` instead of a UI Kit `Spinner`. Mount it once inside `ForgeContextProvider` so all four view apps share one fetch.
- **`ConfigIntlProvider` (UI Kit).** Confirmed by the step 1 spike: `react-intl`'s `IntlProvider` and `useIntl()` work under `ForgeReconciler`, so wrap the config tree in `IntlProvider` directly. It takes the locale from `useProductContext()`, passes it through `resolveLocale`, and loads messages with `i18n.getTranslations`. Macro config renders only a restricted set of components (see "Step 1 spike results"), so show a plain `Label` while loading, not a `Spinner` or `Stack` (a `Spinner` is untested there). Forge's own `I18nProvider` and `useTranslation` also work and remain the fallback, but they do not interpolate placeholders, so `react-intl` is preferred.
- Both expose the same `useTranslate()` hook returning `{ t }`, so components do not care which renderer they are in.

`forge-module-router`'s `createUIKitContextRoute` already runs `useProductContext()` for routing, so the config provider can sit inside `UnifiedConfig` in `index.js` without a second context lookup.

### 4. Manifest and Dhall

- Add a `translations` block to `manifest.dhall` with `fallback.default = "en-GB"` (the schema requires `fallback`, and rejects a bare `default`, as `forge lint` found in the step 1 spike) and one `resources` entry per code. Generate the 26 entries from a `List Text` of codes with `List/map`, so the codes appear once. The generated `manifest.yml` then matches the reference's shape (`key: fr-FR`, `path: locales/fr-FR.json`).
- Change each macro's `title` and `description` from `Text` to an i18n reference. Forge expects `title: { i18n: macro.codeBlock.title }`. In Dhall that means changing the macro record type for those two fields (a small `I18nText = { i18n : Text }` record), and updating the four macros. `Config` (`connectKey`, `baseUrl`, `macroKeySuffix`) is unaffected.
- Keep `locales/*.json` at the repo root and reference them as `locales/<code>.json`, as the reference does. Forge reads these paths relative to the app root, so no build step is needed.

### 5. Key naming

Follow the reference's nesting, grouped by macro so ownership is clear:

```
macro.codeBlock.title / .description
macro.codeEditor.title / .description
macro.gist.title / .description
macro.bitbucketSnippet.title / .description
config.codeBlock.{codeContent,language,title,theme}.{label,placeholder}
config.gist.url.{label,placeholder}
config.bitbucketSnippet.url.{label,placeholder}
config.codeEditor.language.label
view.codeBlock.{noContent,loadFailed,error,copy,copyTooltip}
view.codeEditor.{loadingContext,loadingData,outOfSync.*,refresh}
view.gist.loadError
view.bitbucketSnippet.{title,line1,line2,link}
common.loading
```

Parameterise anything that interpolates (`view.codeBlock.error` takes `{error}`). Do not build sentences by concatenation, for the grammar reasons the reference documents.

### 6. Locales and translation approach

- Create all 26 files. Start with `en-GB.json` as the default and the source of truth (the manifest default and fallback), then `en-US.json` (spelling differences only), then the other 24.
- Same sourcing as the reference: model-written, formal-neutral register, one term per concept per language, `{placeholders}` preserved verbatim, and the PR states native-speaker review is needed. List the languages reviewers should check.
- Technical terms such as "gist", "Bitbucket", "GitHub" and language names stay in their original form.
- `pt-PT` is on the reference's list at the maintainer's request even though Confluence falls back to `pt-BR`. Decide the same here (see Open questions).

### 7. Loading and error behaviour

The view providers must never leave the macro on a blank frame. As in the reference: show a loading element until translations resolve, and on failure log a warning and render with an empty message set so keys show rather than nothing. Messages that appear before translations load (the router's "Loading..." fallbacks) are the one place English is acceptable, because no locale is known yet. Leave those two strings untranslated deliberately and say so in the code.

### 8. Tests

This repo has no test runner (proposal 002, C2), so this change introduces one:

- Add Jest with Babel (`@babel/preset-env`, `@babel/preset-react`), configured in `static/app`, and a `test` script. Wire root `npm test` to run the ai-planning check and then the app tests.
- Port `locales.test.js`: JSON validity, registered files and no orphans, key parity with `en-GB`, placeholder parity, no empty values, manifest `i18n:` keys exist, every `t('...')` key used in `src/` exists, the 26 expected codes, combined size under 100 KB. Read the registered resources from the generated `manifest.yml`, so the test needs `npm run manifest:dev` to have run (or check `manifest.dhall` directly via a small parser). Decide which in implementation. Prefer reading the Dhall output in CI.
- Port `i18n.test.js` for `resolveLocale` (exact, override, same-language, default, `_` versus `-`, malformed input) and `flattenMessages`.
- Add component tests for both providers with `@forge/bridge` mocked (loading state, success, failure fallback, locale change). `@forge/bridge` and `@forge/react` need the Forge runtime or a browser, so mock them, as the reference does.
- Mutation-check the new tests by deliberately dropping a key and changing a placeholder, then confirming the test fails.

### 9. Documentation

- Add an "Internationalisation" section to `AGENTS.md` mirroring the reference: never hard-code English, a new key goes in every locale file, titles and descriptions are `i18n:` keys, and always call `resolveLocale` before `getTranslations`.
- Update `README.md` with how to add a locale or a string.

## Step 1 spike results

Run on 2026-10-28 against the development app (version 6.14.0), in the Code editor macro's config panel on `rmassaioli-development`, with a viewer locale of `en-GB` and time zone `Australia/Sydney`. All nine checks passed. Forge CLI 12.14.1, `@forge/react` 11.17.0, `@forge/bridge` 5.17.0, `react-intl` 12.1.5.

| Check | What it showed |
|-------|----------------|
| A1 | The config sandbox has `window`, `document` and `navigator`. `useProductContext()` gives `locale`, `timezone`, `moduleKey` (`in-page-editor-dev`) and `extension.type`. |
| B1 | `resolveLocale` maps `en-AU` to `en-GB`, `de-AT` to `de-DE`, `fr-CA` to `fr-FR`, `nb-NO` to `no-NO`, `zh-HK` to `zh-TW`, `pt` to `pt-BR`, `en_US` to `en-US`, and unknown or empty to `en-GB`. |
| C1 to C4 | `i18n.getTranslations` from `@forge/bridge` works in a UI Kit panel. Passing `null` returns the viewer's locale. A forced `fr-FR` returns the French file. An unmapped `en-AU` returns the default `en-GB` file without throwing. The first fetch took about 2 s, a repeat about 0 ms, a new locale about 1 s. |
| D1 | `react-intl` formats ICU placeholders and plurals in the sandbox ("Hello Forge", "5 files"). |
| E1 | **`IntlProvider` and `useIntl()` render under `ForgeReconciler`.** The proposal's design stands. |
| F1 | `@forge/react`'s `I18nProvider` and `useTranslation` also work (`ready` goes from `false` to `true`). Its `t()` does not interpolate: `Hello {name}` came back literally. |

Findings that change the design:

1. **Macro config allows only a restricted set of components.** A panel using `Stack` failed with "Stack components are not supported in macro config". Config panels must stay with form components and `Label` (the existing panels use `Label`, `Textfield`, `Select` and `TextArea`). Any config-side loading or error state has to use those.
2. **The config tree also runs in the macro's view iframe on page load.** The spike logged when the page loaded, before the config panel was opened, because one bundle runs both `ReactDOM.render` and `ForgeReconciler.addConfig`. Translation fetches therefore happen on every view of the macro as well. Keep the providers cheap, fetch once per locale, and consider splitting the bundle so views do not run config code (see `002-codebase-review.md`, B8).
3. **Forge does not map unmapped locales to the same language.** `en-AU` returned `en-GB` only because that is the default. `de-AT` would return the default English file, not German, so `resolveLocale` is needed here as it is in the reference app.
4. **`forge lint` requires `translations.fallback.default`**, not `translations.default`.

Not covered by the spike: rendering with a non-English viewer through the React providers. The French file was fetched (C3), but E1 and F1 ran with `en-GB`. Check this in step 7 by switching a Confluence profile to a non-English language.

## Work plan

| # | Step | Notes |
|---|------|-------|
| 1 | Spike: render a UI Kit config panel under `react-intl`'s `IntlProvider` in a `forge tunnel` session | **Done 2026-10-28.** `react-intl`'s `IntlProvider` works in config panels. See "Step 1 spike results". |
| 2 | Add `react-intl`, `src/i18n.js`, both providers and `useTranslate` | Port from the reference |
| 3 | Add the Jest setup and the i18n and provider tests | Needs proposal 002's test tooling item, or lands first as its start |
| 4 | Extract strings into `locales/en-GB.json` and replace literals with `t()` across the four macros | Mechanical, one macro at a time |
| 5 | Dhall: `translations` block and `I18nText` titles and descriptions | Regenerate `manifest.yml`, run `forge lint` |
| 6 | Create the other 25 locale files and the locales test | Includes the size check |
| 7 | Deploy to development, test with a non-English Confluence profile and an unmapped locale such as `en-AU` | Confirms `resolveLocale` is needed here too |
| 8 | Docs: `AGENTS.md` and `README.md` | |

Steps 2 to 4 and 5 are independent enough to be separate PRs. Do not merge the Dhall change until the locale files exist, because Forge rejects a manifest that points at missing files.

## Risks

| Risk | Mitigation |
|------|-----------|
| `IntlProvider` may not work under `ForgeReconciler` (UI Kit reconciler) | **Resolved by the step 1 spike:** it works. `I18nProvider` and `useTranslation` stay as an untested-in-production fallback. |
| Macro config rejects most UI Kit components (`Stack` failed to load) | Keep config panels to form components and `Label`. Show a `Label`, not a `Spinner`, while translations load. |
| The config tree runs in the view iframe on every page load, so translation fetches run per view | Fetch once per locale; consider splitting views from config in the bundle. |
| Bundle growth from `react-intl` | Small relative to highlight.js. Measure before and after. Locale files are fetched per viewer, not bundled. |
| Manifest generation breaks when titles become records | Change the Dhall type in one place, regenerate and diff `manifest.yml`, run `forge lint`. |
| Combined locale size over 100 KB | Test enforces it. About 40 short keys is well under (the reference's 26 files total about 91 KB with more keys). |
| Machine-written translations contain errors | PR says so and lists languages for review. |
| `view.getContext()` returns an unmapped locale (`en-AU`) | `resolveLocale`, with a test, exactly as in the reference. |
| Overlap with proposal 002 work (editor and code block rewrites) | Land the CI and dead-code cleanup first, and do the string extraction per macro so conflicts stay small. |
| Deprecated Bitbucket Snippet macro is hidden but still renders its notice for existing pages | Translate its notice, but treat it as lowest priority and remove it with the macro when Connect support ends. |

## Open questions

1. Keep `pt-PT` in the locale list as the reference does, or follow Forge's page and omit it?
2. Should the macros' view text be translated at all for the Custom UI macros, or only titles, descriptions and config panels? The view messages are few, so the recommendation is to translate them for consistency.
3. Is a shared package for `i18n.js` and the locales test worth creating now, or copy for now and extract when a third app needs it?
4. Does the Bitbucket Snippet notice justify 26 translations, or should the macro stay English-only until it is removed?
5. Who reviews translations? The reference leaves this open too.
