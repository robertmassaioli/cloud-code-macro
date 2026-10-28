import React, { useEffect, useState } from 'react';
import { Label, useProductContext } from '@forge/react';
import { IntlProvider } from 'react-intl';
import { DEFAULT_LOCALE, onIntlError } from './i18n';
import { loadMessages } from './translations';

/**
 * Gives the macro config panels (UI Kit, rendered by ForgeReconciler) a react-intl context for the viewer's locale.
 * The locale comes from `useProductContext()`. Macro config renders only a restricted set of components (a `Stack`
 * fails with "not supported in macro config"), so the loading state is a `Label`. It stays English because no locale
 * is known yet. react-intl renders no markup of its own, so it works under ForgeReconciler (proposal 003, step 1).
 */
export function ConfigIntlProvider({ children }) {
  const context = useProductContext();
  const hasContext = Boolean(context);
  const requestedLocale = context && context.locale;
  const [loaded, setLoaded] = useState(undefined);

  useEffect(() => {
    if (!hasContext) return undefined;
    let cancelled = false;
    loadMessages(requestedLocale).then(result => {
      if (!cancelled) setLoaded(result);
    });
    return () => {
      cancelled = true;
    };
  }, [hasContext, requestedLocale]);

  if (!loaded) return <Label>Loading...</Label>;

  return (
    <IntlProvider locale={loaded.locale} defaultLocale={DEFAULT_LOCALE} messages={loaded.messages} onError={onIntlError}>
      {children}
    </IntlProvider>
  );
}
