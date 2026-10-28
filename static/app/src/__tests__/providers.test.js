import React from 'react';
import { act, create } from 'react-test-renderer';
import { i18n, view } from '@forge/bridge';
import { useProductContext } from '@forge/react';
import { ViewIntlProvider } from '../ViewIntlProvider';
import { ConfigIntlProvider } from '../ConfigIntlProvider';
import { useTranslate } from '../useTranslate';

jest.mock('@forge/bridge', () => ({
  i18n: { getTranslations: jest.fn() },
  view: { getContext: jest.fn() }
}));
// @forge/react needs the Forge runtime, so stand in for the two things the providers use
jest.mock('@forge/react', () => ({
  Label: ({ children }) => require('react').createElement('label', null, children),
  useProductContext: jest.fn()
}));

const FRENCH = { locale: 'fr-FR', translations: { config: { language: { label: 'Langue' } }, greet: 'Bonjour {name}' } };

function Probe() {
  const { t } = useTranslate();
  return React.createElement('span', null, `${t('config.language.label')}|${t('greet', { name: 'Forge' })}|${t('no.such.key')}`);
}

const text = renderer => JSON.stringify(renderer.toJSON());
const flush = () => act(async () => {});

beforeEach(() => {
  jest.resetAllMocks();
  i18n.getTranslations.mockResolvedValue(FRENCH);
});

describe('ViewIntlProvider', () => {
  test('shows loading, then translates for the context locale', async () => {
    view.getContext.mockResolvedValue({ locale: 'fr-CA' });
    let renderer;
    await act(async () => {
      renderer = create(React.createElement(ViewIntlProvider, null, React.createElement(Probe)));
    });
    await flush();
    expect(i18n.getTranslations).toHaveBeenCalledWith('fr-FR');
    expect(text(renderer)).toContain('Langue|Bonjour Forge|no.such.key');
  });

  test('renders Loading... before the context resolves', () => {
    view.getContext.mockReturnValue(new Promise(() => {}));
    const renderer = create(React.createElement(ViewIntlProvider, null, React.createElement(Probe)));
    expect(text(renderer)).toContain('Loading...');
    renderer.unmount();
  });

  test('falls back to message keys when translations cannot be loaded', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    view.getContext.mockResolvedValue({ locale: 'ja-JP' });
    i18n.getTranslations.mockRejectedValue(new Error('offline'));
    let renderer;
    await act(async () => {
      renderer = create(React.createElement(ViewIntlProvider, null, React.createElement(Probe)));
    });
    await flush();
    expect(text(renderer)).toContain('config.language.label|greet|no.such.key');
  });

  test('falls back to the viewer\'s own locale when the context cannot be read', async () => {
    view.getContext.mockRejectedValue(new Error('no context'));
    await act(async () => {
      create(React.createElement(ViewIntlProvider, null, React.createElement(Probe)));
    });
    await flush();
    expect(i18n.getTranslations).toHaveBeenCalledWith(null);
  });
});

describe('ConfigIntlProvider', () => {
  test('renders a Label while there is no product context, then translates', async () => {
    useProductContext.mockReturnValue(undefined);
    let renderer;
    await act(async () => {
      renderer = create(React.createElement(ConfigIntlProvider, null, React.createElement(Probe)));
    });
    expect(text(renderer)).toContain('"type":"label"');
    expect(i18n.getTranslations).not.toHaveBeenCalled();

    useProductContext.mockReturnValue({ locale: 'fr-FR' });
    await act(async () => {
      renderer.update(React.createElement(ConfigIntlProvider, null, React.createElement(Probe)));
    });
    await flush();
    expect(i18n.getTranslations).toHaveBeenCalledWith('fr-FR');
    expect(text(renderer)).toContain('Langue|Bonjour Forge|no.such.key');
  });

  test('refetches when the locale changes', async () => {
    useProductContext.mockReturnValue({ locale: 'fr-FR' });
    let renderer;
    await act(async () => {
      renderer = create(React.createElement(ConfigIntlProvider, null, React.createElement(Probe)));
    });
    await flush();
    useProductContext.mockReturnValue({ locale: 'de-AT' });
    i18n.getTranslations.mockResolvedValue({ locale: 'de-DE', translations: { greet: 'Hallo {name}' } });
    await act(async () => {
      renderer.update(React.createElement(ConfigIntlProvider, null, React.createElement(Probe)));
    });
    await flush();
    expect(i18n.getTranslations).toHaveBeenLastCalledWith('de-DE');
    expect(text(renderer)).toContain('Hallo Forge');
  });
});
