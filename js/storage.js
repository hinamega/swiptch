/**
 * Swiptch - Safe LocalStorage Persistence Module
 */

const STORAGE_KEYS = {
  LIKES: 'swiptch_likes',
  SKIPS: 'swiptch_skips',
  LANG: 'swiptch_lang',
  SEEN_HELP: 'swiptch_seen_help'
};

function safeGet(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    try {
      return JSON.parse(raw);
    } catch {
      return raw; // plain string fallback
    }
  } catch (e) {
    console.error(`Failed to read '${key}' from localStorage:`, e);
    return defaultValue;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write '${key}' to localStorage:`, e);
  }
}

export const Storage = {
  getLikes() {
    const likes = safeGet(STORAGE_KEYS.LIKES, []);
    return Array.isArray(likes) ? likes : [];
  },

  saveLikes(likes) {
    safeSet(STORAGE_KEYS.LIKES, likes);
  },

  getSkips() {
    const skips = safeGet(STORAGE_KEYS.SKIPS, []);
    return Array.isArray(skips) ? skips : [];
  },

  saveSkips(skips) {
    safeSet(STORAGE_KEYS.SKIPS, skips);
  },

  getLanguage() {
    const lang = safeGet(STORAGE_KEYS.LANG, null);
    if (lang === 'ja' || lang === 'en') return lang;
    // 初回アクセス時のブラウザ言語判定
    const browserLang = (navigator.language || 'ja').substring(0, 2);
    return browserLang === 'ja' ? 'ja' : 'en';
  },

  saveLanguage(lang) {
    safeSet(STORAGE_KEYS.LANG, lang);
  },

  hasSeenHelp() {
    return safeGet(STORAGE_KEYS.SEEN_HELP, false) === true || safeGet(STORAGE_KEYS.SEEN_HELP, '') === 'true';
  },

  markHelpSeen() {
    safeSet(STORAGE_KEYS.SEEN_HELP, true);
  }
};
