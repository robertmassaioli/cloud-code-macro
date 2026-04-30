import React from 'react';
import ReactDOM from 'react-dom';
import ForgeReconciler, { useProductContext } from '@forge/react';
import { ForgeContextProvider, ContextRoute, createUIKitContextRoute } from 'forge-module-router';

import BitbucketSnippetApp from './bitbucket-snippet/App';
import GistCodeMacroApp from './gist-code-macro/App';
import PasteCodeMacroApp from './paste-code-macro/App';

import BitbucketSnippetConfig from './bitbucket-snippet/Config';
import GistCodeMacroConfig from './gist-code-macro/Config';
import InPageEditorConfig from './in-page-editor/Config';
import PasteCodeMacroConfig from './paste-code-macro/Config';

// in-page-editor is lazy-loaded because @monaco-editor/react is large.
// This causes webpack to split Monaco into a separate chunk that is only
// downloaded when the in-page-editor module is active.
const InPageEditorApp = React.lazy(() => import('./in-page-editor/App'));

// ── Custom UI (DOM renderer) ──────────────────────────────────────────────────
// forge-module-router reads view.getContext() to determine which macro module
// is active and renders only the matching <ContextRoute> branch.
ReactDOM.render(
  <ForgeContextProvider
    fallback={<div>Loading...</div>}
    allowedModuleKeys={[
      'in-page-editor',
      'bitbucket-snippet-code-macro',
      'gist-code-macro',
      'paste-code-macro',
    ]}
  >
    <ContextRoute moduleKey="in-page-editor">
      <React.Suspense fallback={<div>Loading editor...</div>}>
        <InPageEditorApp />
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
// ForgeReconciler.addConfig uses a custom React reconciler that serialises UI
// Kit components into a Forge doc sent over self.__bridge. forge-module-router's
// ForgeContextProvider is a DOM-based component and cannot be used here.
//
// createUIKitContextRoute wraps useProductContext() and applies the same
// environment-aware prefix-matching as <ContextRoute>, so moduleKey="paste-code-macro"
// correctly matches "paste-code-macro-dev" in development environments.
const { UIKitContextRoute } = createUIKitContextRoute(useProductContext, {
  allowedModuleKeys: [
    'in-page-editor',
    'bitbucket-snippet-code-macro',
    'gist-code-macro',
    'paste-code-macro',
  ],
});

const UnifiedConfig = () => (
  <>
    <UIKitContextRoute moduleKey="in-page-editor">
      <InPageEditorConfig />
    </UIKitContextRoute>
    <UIKitContextRoute moduleKey="bitbucket-snippet-code-macro">
      <BitbucketSnippetConfig />
    </UIKitContextRoute>
    <UIKitContextRoute moduleKey="gist-code-macro">
      <GistCodeMacroConfig />
    </UIKitContextRoute>
    <UIKitContextRoute moduleKey="paste-code-macro">
      <PasteCodeMacroConfig />
    </UIKitContextRoute>
  </>
);

ForgeReconciler.addConfig(<UnifiedConfig />);
