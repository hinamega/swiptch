/**
 * Swiptch - API & External Services Module
 */

const API_BASE = /(^|\.)itch\.zone$/.test(location.hostname)
  ? 'https://swiptch.hinamega.com/api'
  : '/api';
const API_TIMEOUT_MS = 15000;
const TRANSLATE_TIMEOUT_MS = 12000;

/**
 * itch.io のゲーム一覧をサーバーレスAPIから取得
 * @param {string} tag
 * @returns {Promise<Array>}
 */
export async function fetchGamesByTag(tag) {
  const url = `${API_BASE}/discover?tag=${encodeURIComponent(tag)}`;
  // ネットワークが固まってもシマーが出たままにならないよう上限を切る
  const response = await fetch(url, { signal: AbortSignal.timeout(API_TIMEOUT_MS) });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.games || [];
}

/**
 * Google翻訳APIを使用してテキストを翻訳
 * @param {string} text
 * @param {string} targetLang
 * @returns {Promise<string>}
 */
export async function translateText(text, targetLang = 'ja') {
  if (!text || !text.trim()) return '';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;

  const response = await fetch(url, { signal: AbortSignal.timeout(TRANSLATE_TIMEOUT_MS) });
  if (!response.ok) {
    throw new Error(`Translation HTTP error: ${response.status}`);
  }

  const data = await response.json();
  if (data && Array.isArray(data[0])) {
    return data[0].map(item => item[0] || '').join('');
  }

  throw new Error('Invalid translation payload');
}
