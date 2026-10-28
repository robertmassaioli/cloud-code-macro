import { i18n } from '@forge/bridge';
import { DEFAULT_LOCALE, flattenMessages, resolveLocale } from './i18n';

/**
 * Loads the messages for the viewer's locale. `i18n.getTranslations` fetches only that locale's file (plus its
 * fallbacks), https://developer.atlassian.com/platform/forge/apis-reference/ui-api-bridge/i18n/
 * `requestedLocale` is the raw locale from the product context. It is passed through `resolveLocale` first, because
 * Forge hands back the default English file for a locale with no file of its own (`de-AT`, `fr-CA`) instead of
 * the same language. No locale at all asks Forge for the viewer's own.
 * A failed load is logged and gives an empty message set, so the UI shows message keys rather than a blank panel.
 */
export async function loadMessages(requestedLocale) {
  try {
    const result = await i18n.getTranslations(requestedLocale ? resolveLocale(requestedLocale) : null);
    return { locale: result.locale, messages: flattenMessages(result.translations) };
  } catch (error) {
    console.warn(`[i18n] could not load translations for ${requestedLocale}:`, error);
    return { locale: DEFAULT_LOCALE, messages: {} };
  }
}
