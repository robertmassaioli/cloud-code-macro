/**
 * SPIKE for ai-planning/003-internationalisation.md, step 1. Temporary: delete once step 1 is answered.
 *
 * Runs inside a UI Kit config panel (rendered by ForgeReconciler, not the DOM) and answers:
 *   A  what does the config sandbox look like (locale, React, window/document/navigator)?
 *   B  does resolveLocale map the locales Forge passes through unchanged?
 *   C  does `i18n.getTranslations` from @forge/bridge work in a UI Kit panel, and for which locales?
 *   D  does react-intl format ICU messages here at all (no React)?
 *   E  does react-intl's <IntlProvider> + useIntl() render under ForgeReconciler?  <- the main question
 *   F  does @forge/react's own <I18nProvider> + useTranslation() work?              <- the fallback
 *
 * Every result is shown on screen (PASS / FAIL), logged with the prefix "[i18n-spike]", and collected into
 * one JSON block at the bottom that can be copied whole.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { CodeBlock, Heading, I18nProvider, Inline, Lozenge, Stack, Text, useProductContext, useTranslation } from '@forge/react';
import { i18n } from '@forge/bridge';
import { IntlProvider, createIntl, createIntlCache, useIntl } from 'react-intl';
import { DEFAULT_LOCALE, flattenMessages, onIntlError, resolveLocale } from '../i18n';

const TAG = '[i18n-spike]';

const errorText = error => (error && error.message ? error.message : String(error));

function useReport() {
  const [results, setResults] = useState([]);
  const report = useCallback((id, ok, detail) => {
    const entry = { id, ok: Boolean(ok), detail: typeof detail === 'string' ? detail : JSON.stringify(detail) };
    console.log(TAG, entry.ok ? 'PASS' : 'FAIL', entry.id, entry.detail);
    setResults(previous => [...previous.filter(r => r.id !== id), entry].sort((a, b) => a.id.localeCompare(b.id)));
  }, []);
  return [results, report];
}

// Catches a provider that throws while rendering, so one failing test cannot blank the whole panel.
class Boundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    this.props.onError(errorText(error));
  }

  render() {
    return this.state.error ? <Text>Render failed: {errorText(this.state.error)}</Text> : this.props.children;
  }
}

// E: react-intl under ForgeReconciler
function IntlProbe({ report }) {
  const intl = useIntl();
  const hello = intl.formatMessage({ id: 'spike.hello' }, { name: 'Forge' });
  const one = intl.formatMessage({ id: 'spike.files' }, { count: 1 });
  const many = intl.formatMessage({ id: 'spike.files' }, { count: 5 });
  const source = intl.messages['spike.source'];
  const ok = hello.includes('Forge') && many.includes('5') && source !== undefined;
  useEffect(() => {
    report('E1', ok, { providerLocale: intl.locale, source, hello, one, many });
  }, [report, ok, intl.locale, source, hello, one, many]);
  return <Text>E1 IntlProvider renders: {hello} / {one} / {many} (file: {String(source)})</Text>;
}

// F: Forge's own provider, the fallback if E fails
function ForgeProbe({ report }) {
  const translation = useTranslation();
  const source = translation.t('spike.source');
  const hello = translation.t('spike.hello');
  const ok = translation.ready && source !== 'spike.source';
  useEffect(() => {
    report('F1', ok, { ready: translation.ready, locale: translation.locale, source, hello });
  }, [report, ok, translation.ready, translation.locale, source, hello]);
  return <Text>F1 I18nProvider renders: ready={String(translation.ready)} locale={String(translation.locale)} file={source}</Text>;
}

const LOCALE_SAMPLES = ['en-AU', 'de-AT', 'fr-CA', 'nb-NO', 'zh-HK', 'pt', 'en_US', 'xx-YY', ''];

async function fetchTranslations(report, id, requested) {
  const started = Date.now();
  try {
    const result = await i18n.getTranslations(requested);
    const flat = flattenMessages(result.translations);
    report(id, flat['spike.source'] !== undefined, {
      requested,
      returnedLocale: result.locale,
      source: flat['spike.source'],
      keys: Object.keys(flat).length,
      ms: Date.now() - started
    });
    return result;
  } catch (error) {
    report(id, false, { requested, error: errorText(error), ms: Date.now() - started });
    return undefined;
  }
}

export default function I18nSpike() {
  const context = useProductContext();
  const contextLocale = context && context.locale;
  const [results, report] = useReport();
  const [loaded, setLoaded] = useState(undefined);
  const [startedAt] = useState(() => new Date().toISOString());

  useEffect(() => {
    if (!context) return;
    (async () => {
      const resolved = resolveLocale(contextLocale);

      // A: environment
      let intlLocale;
      try {
        intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
      } catch (error) {
        intlLocale = `error: ${errorText(error)}`;
      }
      report('A1', true, {
        contextLocale,
        timeZone: context.timezone || context.timeZone,
        moduleKey: context.moduleKey,
        extensionType: context.extension && context.extension.type,
        react: React.version,
        window: typeof window,
        document: typeof document,
        navigator: typeof navigator,
        navigatorLanguage: typeof navigator !== 'undefined' ? navigator.language : undefined,
        intlLocale,
        bridgeI18nGetTranslations: typeof i18n.getTranslations
      });

      // B: locale resolution
      report('B1', true, {
        contextLocale,
        resolved,
        samples: Object.fromEntries(LOCALE_SAMPLES.map(sample => [sample || '(empty)', resolveLocale(sample)]))
      });

      // C: the bridge fetch, for the viewer, the resolved locale, a forced locale and an unmapped one
      await fetchTranslations(report, 'C1', null);
      const forViewer = await fetchTranslations(report, 'C2', resolved);
      await fetchTranslations(report, 'C3', 'fr-FR');
      await fetchTranslations(report, 'C4', 'en-AU');

      // D: react-intl without React
      try {
        const intl = createIntl(
          { locale: forViewer ? forViewer.locale : DEFAULT_LOCALE, messages: flattenMessages(forViewer && forViewer.translations), onError: onIntlError },
          createIntlCache()
        );
        const hello = intl.formatMessage({ id: 'spike.hello' }, { name: 'Forge' });
        const many = intl.formatMessage({ id: 'spike.files' }, { count: 5 });
        report('D1', hello.includes('Forge') && many.includes('5'), { hello, many, pluralRules: typeof Intl.PluralRules });
      } catch (error) {
        report('D1', false, { error: errorText(error) });
      }

      // Hand the viewer's messages to the React probes
      if (forViewer) setLoaded({ locale: forViewer.locale, messages: flattenMessages(forViewer.translations) });
      else report('E1', false, 'Not run: the C2 fetch failed, so there were no messages to give IntlProvider.');
    })();
  }, [context ? 1 : 0, contextLocale, report]);

  const failed = id => (results.find(r => r.id === id) || {}).ok === false;
  const passed = id => (results.find(r => r.id === id) || {}).ok === true;
  const verdict = passed('E1')
    ? 'USE react-intl IntlProvider in config panels (proposal design stands)'
    : passed('F1')
      ? 'FALL BACK to @forge/react I18nProvider + useTranslation for config panels'
      : failed('E1') || failed('F1') || failed('C2')
        ? 'NEITHER provider worked: see the FAIL lines'
        : 'Still running: wait a few seconds';

  const reportText = JSON.stringify({ spike: 'proposal-003-step-1', startedAt, verdict, results }, null, 2);

  return (
    <Stack space="space.100">
      <Heading as="h3">i18n spike (proposal 003, step 1)</Heading>
      <Text>Confluence reports locale: {String(contextLocale)}. Verdict: {verdict}</Text>
      {results.map(result => (
        <Inline key={result.id} space="space.100" alignBlock="center">
          <Lozenge appearance={result.ok ? 'success' : 'removed'}>{result.ok ? 'PASS' : 'FAIL'}</Lozenge>
          <Text>{result.id}: {result.detail}</Text>
        </Inline>
      ))}
      {loaded && (
        <Boundary onError={message => report('E1', false, { renderError: message })}>
          <IntlProvider locale={loaded.locale} defaultLocale={DEFAULT_LOCALE} messages={loaded.messages} onError={onIntlError}>
            <IntlProbe report={report} />
          </IntlProvider>
        </Boundary>
      )}
      <Boundary onError={message => report('F1', false, { renderError: message })}>
        <I18nProvider>
          <ForgeProbe report={report} />
        </I18nProvider>
      </Boundary>
      <Heading as="h4">Report (copy everything in this box)</Heading>
      <CodeBlock text={reportText} language="json" />
    </Stack>
  );
}
