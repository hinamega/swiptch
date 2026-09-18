/**
 * Swiptch - Localization & Text Formatting Module
 *
 * 辞書データは locales.js、ここでは参照・整形ロジックを提供する。
 */

import { TRANSLATIONS } from './locales.js';

export { TRANSLATIONS };

function resolveLang(lang) {
  return TRANSLATIONS[lang] ? lang : 'ja';
}

export function getTranslation(lang, key) {
  const currentLang = resolveLang(lang);
  return TRANSLATIONS[currentLang][key] || key;
}

export function translateTag(tag, lang = 'ja') {
  const normalized = tag.toLowerCase().trim();
  const currentLang = resolveLang(lang);
  return TRANSLATIONS[currentLang][normalized] || TRANSLATIONS[currentLang][tag] || tag;
}

export function formatDate(dateStr, lang = 'ja') {
  const currentLang = resolveLang(lang);
  const dict = TRANSLATIONS[currentLang];
  if (!dateStr) return dict.unknownDate;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return dict.datePattern
      .replace('{y}', y)
      .replace('{m}', m)
      .replace('{d}', d);
  } catch (e) {
    return dateStr;
  }
}

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function applyTranslations(lang = 'ja') {
  const currentLang = resolveLang(lang);
  const dict = TRANSLATIONS[currentLang];

  // Update document title
  document.title = dict.appTitle;

  // Translate static text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (el && dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Translate HTML elements
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml || el.getAttribute('data-i18n-html');
    if (el && dict[key]) {
      el.innerHTML = dict[key];
    }
  });
}
