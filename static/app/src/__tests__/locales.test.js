import fs from 'fs';
import path from 'path';
import { IntlMessageFormat } from 'intl-messageformat';
import { SUPPORTED_LOCALES } from '../i18n';

const APP_ROOT = path.join(__dirname, '..', '..');
const REPO_ROOT = path.join(APP_ROOT, '..', '..');
const LOCALES_DIR = path.join(REPO_ROOT, 'locales');
const SRC_DIR = path.join(APP_ROOT, 'src');
const DEFAULT_LOCALE = 'en-GB';

// Every locale code on https://developer.atlassian.com/platform/forge/manifest-reference/forge-supported-locale-codes/
const EXPECTED_LOCALES = [
  'zh-CN', 'zh-TW', 'cs-CZ', 'da-DK', 'nl-NL', 'en-US', 'en-GB', 'et-EE', 'fi-FI', 'fr-FR', 'de-DE', 'hu-HU', 'is-IS',
  'it-IT', 'ja-JP', 'ko-KR', 'no-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ro-RO', 'ru-RU', 'sk-SK', 'tr-TR', 'es-ES', 'sv-SE'
];

// https://developer.atlassian.com/platform/forge/manifest-reference/translations/ : files referenced from the manifest share 100 KB
const MAX_COMBINED_BYTES = 100 * 1024;

// The manifest is generated from Dhall, so read the Dhall source and no generated file is needed.
const dhall = fs.readFileSync(path.join(REPO_ROOT, 'manifest.dhall'), 'utf8');

function readLocale(code) {
  return JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, `${code}.json`), 'utf8'));
}

// Flattens nested objects to dotted keys, e.g. { a: { b: 'x' } } becomes { 'a.b': 'x' }
function flatten(node, prefix = '') {
  return Object.entries(node).reduce((flat, [key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'object' && value !== null ? { ...flat, ...flatten(value, full) } : { ...flat, [full]: value };
  }, {});
}

const placeholdersOf = text => [...text.matchAll(/\{(\w+)\s*[,}]/g)].map(m => m[1]).sort();

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(full);
    return /\.jsx?$/.test(entry.name) ? [full] : [];
  });
}

const defaultFlat = flatten(readLocale(DEFAULT_LOCALE));

// The locale codes declared in manifest.dhall, between `let localeCodes` and the closing bracket
const dhallCodes = [...dhall.slice(dhall.indexOf('let localeCodes'), dhall.indexOf(']', dhall.indexOf('let localeCodes'))).matchAll(/"([a-z]{2}-[A-Z]{2})"/g)].map(m => m[1]);

describe('manifest translations', () => {
  test('the locale list in manifest.dhall is exactly the Forge supported locales', () => {
    expect([...dhallCodes].sort()).toEqual([...EXPECTED_LOCALES].sort());
  });

  test('the locale list used for resolving locales matches the manifest', () => {
    expect([...SUPPORTED_LOCALES].sort()).toEqual([...dhallCodes].sort());
  });

  test('the fallback is en-GB', () => {
    expect(dhall).toMatch(/fallback\.default = "en-GB"/);
  });

  test('resources are generated as locales/<code>.json', () => {
    expect(dhall).toContain('path = "locales/${code}.json"');
  });

  test('there is a file for every locale and no orphan files', () => {
    expect(fs.readdirSync(LOCALES_DIR).sort()).toEqual(EXPECTED_LOCALES.map(code => `${code}.json`).sort());
  });

  test('every i18n key used in the manifest exists in the default locale', () => {
    const keys = [...dhall.matchAll(/i18n "([\w.]+)"/g)].map(m => m[1]);
    expect(keys.length).toBeGreaterThan(0);
    keys.forEach(key => expect(defaultFlat).toHaveProperty([key]));
  });
});

describe('locale files', () => {
  test('every key used in src exists in the default locale', () => {
    const used = new Set();
    sourceFiles(SRC_DIR).forEach(file => {
      const code = fs.readFileSync(file, 'utf8');
      [...code.matchAll(/\bt\(\s*['"]([\w.]+)['"]/g)].forEach(m => used.add(m[1]));
    });
    expect(used.size).toBeGreaterThan(0);
    const missing = [...used].filter(key => !(key in defaultFlat));
    expect(missing).toEqual([]);
  });

  test('every key in the default locale is used by the app or the manifest', () => {
    const haystack = [dhall, ...sourceFiles(SRC_DIR).map(file => fs.readFileSync(file, 'utf8'))].join('\n');
    const unused = Object.keys(defaultFlat).filter(key => !haystack.includes(`'${key}'`) && !haystack.includes(`"${key}"`));
    expect(unused).toEqual([]);
  });

  test('the combined size is under the 100 KB Forge limit', () => {
    const total = EXPECTED_LOCALES.reduce((sum, code) => sum + fs.statSync(path.join(LOCALES_DIR, `${code}.json`)).size, 0);
    expect(total).toBeLessThan(MAX_COMBINED_BYTES);
  });

  describe.each(EXPECTED_LOCALES)('%s', code => {
    const flat = flatten(readLocale(code));

    test('has exactly the keys of the default locale', () => {
      expect(Object.keys(flat).sort()).toEqual(Object.keys(defaultFlat).sort());
    });

    test('has no empty or non-string values', () => {
      Object.entries(flat).forEach(([key, value]) => {
        expect(typeof value).toBe('string');
        expect(value.trim()).not.toBe('');
        expect(`${key}=${value}`).not.toMatch(/\{\{|TODO/);
      });
    });

    test('keeps the placeholders of the default locale', () => {
      Object.entries(defaultFlat).forEach(([key, value]) => {
        expect({ key, placeholders: placeholdersOf(flat[key]) }).toEqual({ key, placeholders: placeholdersOf(value) });
      });
    });

    test('every message is valid ICU MessageFormat', () => {
      Object.entries(flat).forEach(([key, value]) => {
        expect(() => new IntlMessageFormat(value, code)).not.toThrow();
      });
    });
  });
});
