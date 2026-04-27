import React from 'react';
import ReactDOM from 'react-dom';
import ForgeReconciler, { useProductContext } from '@forge/react';
import { ForgeContextProvider, ContextRoute } from 'forge-module-router';

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
  <ForgeContextProvider fallback={<div>Loading...</div>}>
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
// Instead, useProductContext() from @forge/react reads view.getContext() via
// the same globalThis.__bridge that the reconciler uses — it is fully supported
// inside a ForgeReconciler tree. moduleKey is a top-level field on FullContext.
const UnifiedConfig = () => {
  const context = useProductContext();

  // context is undefined while the bridge call is in flight; return null so the
  // Forge host renders nothing until the correct config panel is known.
  if (!context) return null;

  switch (context.moduleKey) {
    case 'in-page-editor':
      return <InPageEditorConfig />;
    case 'bitbucket-snippet-code-macro':
      return <BitbucketSnippetConfig />;
    case 'gist-code-macro':
      return <GistCodeMacroConfig />;
    case 'paste-code-macro':
      return <PasteCodeMacroConfig />;
    default:
      return null;
  }
};

ForgeReconciler.addConfig(<UnifiedConfig />);
