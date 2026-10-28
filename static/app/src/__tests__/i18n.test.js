import { createIntl } from 'react-intl';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, flattenMessages, makeTranslate, onIntlError, resolveLocale } from '../i18n';

describe('resolveLocale', () => {
  test.each(SUPPORTED_LOCALES)('%s maps to itself', code => {
    expect(resolveLocale(code)).toBe(code);
  });

  test('ignores case and treats _ like -', () => {
    expect(resolveLocale('en_us')).toBe('en-US');
    expect(resolveLocale('DE-de')).toBe('de-DE');
  });

  test.each([
    ['en-AU', 'en-GB'],
    ['en-UK', 'en-GB'],
    ['de-AT', 'de-DE'],
    ['fr-CA', 'fr-FR'],
    ['es-MX', 'es-ES'],
    ['pt', 'pt-BR'],
    ['en', 'en-GB'],
    ['zh', 'zh-CN'],
    ['zh-HK', 'zh-TW'],
    ['zh-MO', 'zh-TW'],
    ['zh-Hant', 'zh-TW'],
    ['nb', 'no-NO'],
    ['nb-NO', 'no-NO'],
    ['nn-NO', 'no-NO']
  ])('%s maps to %s', (input, expected) => {
    expect(resolveLocale(input)).toBe(expected);
  });

  test.each([undefined, null, '', 42, {}, 'xx-YY', 'tlh'])('%p gives the default', input => {
    expect(resolveLocale(input)).toBe(DEFAULT_LOCALE);
  });
});

describe('flattenMessages', () => {
  test('flattens nested objects to dotted keys', () => {
    expect(flattenMessages({ a: { b: 'x', c: { d: 'y' } }, e: 'z' })).toEqual({ 'a.b': 'x', 'a.c.d': 'y', e: 'z' });
  });

  test('handles missing input', () => {
    expect(flattenMessages(undefined)).toEqual({});
    expect(flattenMessages(null)).toEqual({});
  });
});

describe('makeTranslate', () => {
  const intl = createIntl({
    locale: 'en-GB',
    messages: { greeting: 'Hello {name}', files: '{count, plural, one {# file} other {# files}}' },
    onError: onIntlError
  });
  const t = makeTranslate(intl);

  test('fills placeholders', () => {
    expect(t('greeting', { name: 'Forge' })).toBe('Hello Forge');
  });

  test('formats plurals', () => {
    expect(t('files', { count: 1 })).toBe('1 file');
    expect(t('files', { count: 5 })).toBe('5 files');
  });

  test('returns the key for a missing translation without logging', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(t('missing.key')).toBe('missing.key');
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('onIntlError', () => {
  test('ignores missing translations and warns about everything else', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    onIntlError({ code: 'MISSING_TRANSLATION', message: 'missing' });
    expect(warn).not.toHaveBeenCalled();
    onIntlError({ code: 'FORMAT_ERROR', message: 'bad message' });
    expect(warn).toHaveBeenCalledWith('[i18n]', 'bad message');
    warn.mockRestore();
  });
});
