/**
 * Swiptch - API & External Services Module
 */

const API_BASE = '/api';

/**
 * itch.io のゲーム一覧をサーバーレスAPIから取得
 * @param {string} tag 
 * @returns {Promise<Array>}
 */
export async function fetchGamesByTag(tag) {
  const url = `${API_BASE}/discover?tag=${encodeURIComponent(tag)}`;
  const response = await fetch(url);
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
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Translation HTTP error: ${response.status}`);
  }
  
  const data = await response.json();
  if (data && Array.isArray(data[0])) {
    return data[0].map(item => item[0] || '').join('');
  }
  
  throw new Error('Invalid translation payload');
}
