/**
 * Swiptch - Application Bootstrap
 *
 * 起動時の永続化復元、イベント配線、Service Worker 登録のみを担う。
 * 各機能は js/ 配下のモジュールへ委譲する。
 */

import { state } from './js/state.js';
import { DOM } from './js/dom.js';
import { Storage } from './js/storage.js';
import { getTranslation, applyTranslations } from './js/i18n.js';
import {
  fetchGamesPool,
  renderCards,
  resetQueue,
  handleButtonSwipe,
  toggleCardInfoExpansion
} from './js/deck.js';
import {
  updateLikedBadge,
  clearLikes,
  openLikedModal,
  renderLikedList,
  openAllLikedGames
} from './js/likes.js';
import { handleTranslateClick } from './js/translate.js';
import { openModal, closeModal, enableBackdropClose } from './js/ui/modal.js';
import { showToast } from './js/ui/toast.js';

// Application Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  // Load persisted state
  state.likedList = Storage.getLikes();
  state.skippedList = Storage.getSkips();
  state.language = Storage.getLanguage();

  // Apply language
  setLanguage(state.language);
  if (DOM.langSelector) {
    DOM.langSelector.value = state.language;
  }

  updateLikedBadge();
  setupEventListeners();
  checkFirstVisitHelp();
  registerServiceWorker();

  // Initial feed fetch
  fetchGamesPool();
});

function checkFirstVisitHelp() {
  if (!Storage.hasSeenHelp()) {
    openModal(DOM.helpModal);
    Storage.markHelpSeen();
  }
}

function setLanguage(lang) {
  state.language = lang;
  Storage.saveLanguage(lang);
  document.documentElement.lang = lang;
  applyTranslations(lang);
}

// Reset Skips
function resetSkips() {
  state.skippedList = [];
  Storage.saveSkips(state.skippedList);
  showToast(getTranslation(state.language, 'toastResetSkips'), 'info');
  resetQueue();
  fetchGamesPool();
}

// Event Listeners Registration
function setupEventListeners() {
  // Tag Filter
  DOM.tagFilter.addEventListener('change', (e) => {
    state.currentTag = e.target.value;
    resetQueue();
    fetchGamesPool();
  });

  // Action Buttons
  DOM.btnSkip.addEventListener('click', () => handleButtonSwipe('left'));
  DOM.btnLike.addEventListener('click', () => handleButtonSwipe('right'));
  DOM.btnInfo.addEventListener('click', toggleCardInfoExpansion);

  // Reset Skips
  DOM.btnResetSkips.addEventListener('click', resetSkips);
  DOM.btnResetSkipsSettings.addEventListener('click', () => {
    resetSkips();
    closeModal(DOM.settingsModal);
  });

  // Liked Modal
  DOM.btnOpenLiked.addEventListener('click', openLikedModal);
  DOM.btnCloseLiked.addEventListener('click', () => closeModal(DOM.likedModal));
  enableBackdropClose(DOM.likedModal);
  DOM.btnClearLikes.addEventListener('click', clearLikes);
  if (DOM.btnOpenAllLikes) {
    DOM.btnOpenAllLikes.addEventListener('click', openAllLikedGames);
  }

  // Settings Modal
  DOM.btnOpenSettings.addEventListener('click', () => openModal(DOM.settingsModal));
  DOM.btnCloseSettings.addEventListener('click', () => closeModal(DOM.settingsModal));
  enableBackdropClose(DOM.settingsModal);
  DOM.btnClearLikesSettings.addEventListener('click', () => {
    clearLikes();
    closeModal(DOM.settingsModal);
  });

  // Help Modal
  DOM.btnOpenHelp.addEventListener('click', () => openModal(DOM.helpModal));
  DOM.btnCloseHelp.addEventListener('click', () => closeModal(DOM.helpModal));
  enableBackdropClose(DOM.helpModal);

  // Language Change
  if (DOM.langSelector) {
    DOM.langSelector.addEventListener('change', (e) => {
      setLanguage(e.target.value);
      renderCards();
      if (!DOM.likedModal.classList.contains('hidden')) {
        renderLikedList();
      }
    });
  }

  // Translate click within cards (Event Delegation)
  DOM.cardStack.addEventListener('click', (e) => {
    const translateBtn = e.target.closest('.btn-translate');
    if (translateBtn) {
      handleTranslateClick(translateBtn);
    }
  });
}

// Service Worker Registration
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('ServiceWorker registered with scope:', reg.scope))
        .catch(err => console.warn('ServiceWorker registration failed:', err));
    });
  }
}
