import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { makeTranslate } from './i18n';

/**
 * Returns { t } where t(key, params) translates for the viewer's locale.
 * Needs a ViewIntlProvider (macro views) or a ConfigIntlProvider (config panels) above it. Both supply the same
 * react-intl context, so components do not care which renderer they are in.
 */
export function useTranslate() {
  const intl = useIntl();
  return useMemo(() => ({ t: makeTranslate(intl) }), [intl]);
}
