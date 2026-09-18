/**
 * Swiptch - Description Translation Feature
 *
 * カード内の説明文を Google 翻訳で日本語化 / 原文復元する。
 */

import { state } from './state.js';
import { translateText } from './api.js';
import { TRANSLATIONS } from './i18n.js';
import { showToast } from './ui/toast.js';

/**
 * 翻訳ボタンのクリックを処理する
 * @param {HTMLButtonElement} btn
 */
export async function handleTranslateClick(btn) {
  const card = btn.closest('.game-card');
  if (!card) return;

  let descEl;
  const isPanel = btn.closest('.card-details-panel');
  if (isPanel) {
    descEl = isPanel.querySelector('.panel-desc-full');
  } else {
    const infoEl = btn.closest('.card-info');
    if (infoEl) {
      descEl = infoEl.querySelector('.card-desc');
    }
  }

  if (!descEl) return;

  const isTranslated = btn.dataset.translated === 'true';
  const lang = state.language;
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.ja;

  if (isTranslated) {
    const originalText = btn.dataset.originalText || '';
    descEl.textContent = originalText;
    btn.dataset.translated = 'false';
    btn.querySelector('span').textContent = dict.translateToJa;
    btn.classList.remove('translated');
  } else {
    const textToTranslate = descEl.textContent.trim();
    if (!textToTranslate) return;

    if (!btn.dataset.originalText) {
      btn.dataset.originalText = textToTranslate;
    }

    btn.classList.add('loading');
    btn.disabled = true;
    btn.querySelector('span').textContent = dict.translating;

    try {
      const translated = await translateText(textToTranslate, 'ja');
      descEl.textContent = translated;
      btn.dataset.translated = 'true';
      btn.querySelector('span').textContent = dict.restoreOriginal;
      btn.classList.add('translated');
    } catch (error) {
      console.error('Translation error:', error);
      showToast(dict.toastTranslationFailed, 'error');
      btn.querySelector('span').textContent = dict.translateToJa;
    } finally {
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  }
}
