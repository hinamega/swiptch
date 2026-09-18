/**
 * Swiptch - Liked Games Feature
 *
 * お気に入りの追加・削除・一覧描画・一括オープン。
 */

import { state } from './state.js';
import { DOM } from './dom.js';
import { Storage } from './storage.js';
import { TRANSLATIONS, getTranslation, escapeHtml } from './i18n.js';
import { showToast } from './ui/toast.js';
import { openModal } from './ui/modal.js';

/**
 * ヘッダーのお気に入り件数バッジを更新する
 */
export function updateLikedBadge() {
  const count = state.likedList.length;
  DOM.likedCountBadge.textContent = count;
  DOM.likedCountTitle.textContent = count;

  if (count > 0) {
    DOM.likedCountBadge.classList.remove('hidden');
  } else {
    DOM.likedCountBadge.classList.add('hidden');
  }
}

/**
 * ゲームをお気に入りへ追加し、保存・バッジ更新・トーストを出す
 * @param {Object} game
 */
export function addLike(game) {
  if (state.likedList.some(item => item.id === game.id)) return;

  state.likedList.push({
    id: game.id,
    name: game.name,
    developer: game.developer,
    price: game.price,
    headerImage: game.headerImage,
    link: game.link,
    description: game.description
  });
  Storage.saveLikes(state.likedList);
  updateLikedBadge();

  const toastMsg = getTranslation(state.language, 'toastAddLike').replace('{name}', game.name);
  showToast(toastMsg, 'like');
}

/**
 * お気に入りから1件削除する
 * @param {number} gameId
 */
export function removeLike(gameId) {
  state.likedList = state.likedList.filter(game => game.id !== gameId);
  Storage.saveLikes(state.likedList);
  updateLikedBadge();
  renderLikedList();
  showToast(getTranslation(state.language, 'toastRemoveLike'), 'info');
}

/**
 * お気に入りを全削除する（確認ダイアログ付き）
 */
export function clearLikes() {
  const lang = state.language;
  if (confirm(getTranslation(lang, 'confirmClearLikes'))) {
    state.likedList = [];
    Storage.saveLikes(state.likedList);
    updateLikedBadge();
    renderLikedList();
    showToast(getTranslation(lang, 'toastClearLikes'), 'info');
  }
}

/**
 * お気に入りをすべて別タブで開く
 */
export function openAllLikedGames() {
  if (state.likedList.length === 0) return;
  if (DOM.popupWarning) {
    DOM.popupWarning.classList.remove('hidden');
  }
  state.likedList.forEach(game => {
    if (game.link) {
      window.open(game.link, '_blank');
    }
  });
}

/**
 * お気に入り一覧モーダルを開く
 */
export function openLikedModal() {
  openModal(DOM.likedModal);

  if (DOM.btnOpenAllLikes) {
    const isEmpty = state.likedList.length === 0;
    DOM.btnOpenAllLikes.disabled = isEmpty;
    DOM.btnOpenAllLikes.style.opacity = isEmpty ? '0.5' : '';
    DOM.btnOpenAllLikes.style.pointerEvents = isEmpty ? 'none' : '';
  }

  if (DOM.popupWarning) {
    DOM.popupWarning.classList.add('hidden');
  }

  renderLikedList();
}

/**
 * お気に入り一覧の中身を描画する
 */
export function renderLikedList() {
  DOM.likedList.innerHTML = '';
  const lang = state.language;
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.ja;

  if (state.likedList.length === 0) {
    DOM.likedList.innerHTML = `
      <div class="no-likes-message">
        <p>${dict.noLikes}</p>
      </div>
    `;
    return;
  }

  state.likedList.forEach(game => {
    const item = document.createElement('div');
    item.className = 'liked-item';
    const priceDisplay = game.price === 'Free' ? dict.priceFree : escapeHtml(game.price);

    item.innerHTML = `
      <img src="${game.headerImage}" alt="${escapeHtml(game.name)}" class="liked-item-img">
      <div class="liked-item-info">
        <h4 class="liked-item-title">${escapeHtml(game.name)}</h4>
        <p class="liked-item-dev">by ${escapeHtml(game.developer)} | <span style="color:#fa5c5c; font-weight:700;">${priceDisplay}</span></p>
        <div class="liked-item-actions">
          <a href="${game.link}" target="_blank" rel="noopener" class="btn-itch-link">
            ${dict.openItch}
          </a>
        </div>
      </div>
      <button class="btn-remove-liked" data-id="${game.id}" aria-label="Remove from Liked Games">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    item.querySelector('.btn-remove-liked').addEventListener('click', () => {
      removeLike(game.id);
    });

    DOM.likedList.appendChild(item);
  });
}
