import React, { useEffect, useState } from 'react';
import { view } from '@forge/bridge';
import { IntlProvider } from 'react-intl';
import { DEFAULT_LOCALE, onIntlError } from './i18n';
import { loadMessages } from './translations';

/**
 * Gives the macro views (Custom UI, rendered into the DOM) a react-intl context for the viewer's locale.
 * The locale comes from `view.getContext()`. Until it has loaded this shows a plain "Loading...", which stays English
 * because no locale is known yet.
 * https://formatjs.github.io/docs/react-intl/api/#intlprovider
 */
export function ViewIntlProvider({ children }) {
  const [loaded, setLoaded] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    view.getContext()
      .then(context => loadMessages(context && context.locale))
      .catch(() => loadMessages(undefined))
      .then(result => {
        if (!cancelled) setLoaded(result);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded) return <div>Loading...</div>;

  return (
    <IntlProvider locale={loaded.locale} defaultLocale={DEFAULT_LOCALE} messages={loaded.messages} onError={onIntlError}>
      {children}
    </IntlProvider>
  );
}
