/**
 * Swiptch - Toast Notification UI
 */

import { DOM } from '../dom.js';

const TOAST_DURATION_MS = 3000;

/**
 * 画面下部に一時的なトースト通知を表示する
 * @param {string} message
 * @param {'info' | 'like' | 'error'} [type]
 */
export function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'like' ? 'like-toast' : ''}`;
  toast.textContent = message;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, TOAST_DURATION_MS);
}
