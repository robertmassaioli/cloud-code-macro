import { i18n } from '@forge/bridge';
import { loadMessages } from '../translations';

jest.mock('@forge/bridge', () => ({ i18n: { getTranslations: jest.fn() } }));

beforeEach(() => {
  i18n.getTranslations.mockReset();
});

describe('loadMessages', () => {
  test('asks Forge for the resolved locale and flattens the nested file', async () => {
    i18n.getTranslations.mockResolvedValue({ locale: 'de-DE', translations: { config: { language: { label: 'Sprache' } } } });
    const result = await loadMessages('de-AT');
    expect(i18n.getTranslations).toHaveBeenCalledWith('de-DE');
    expect(result).toEqual({ locale: 'de-DE', messages: { 'config.language.label': 'Sprache' } });
  });

  test('asks for the viewer\'s own locale when none is given', async () => {
    i18n.getTranslations.mockResolvedValue({ locale: 'en-GB', translations: {} });
    await loadMessages(undefined);
    expect(i18n.getTranslations).toHaveBeenCalledWith(null);
  });

  test('returns the locale Forge settled on, not the one requested', async () => {
    i18n.getTranslations.mockResolvedValue({ locale: 'en-GB', translations: { a: 'b' } });
    expect((await loadMessages('en-AU')).locale).toBe('en-GB');
  });

  test('a failed load logs a warning and gives an empty message set', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    i18n.getTranslations.mockRejectedValue(new Error('network'));
    expect(await loadMessages('fr-FR')).toEqual({ locale: 'en-GB', messages: {} });
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
