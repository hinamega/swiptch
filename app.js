/**
 * Swiptch - itch.io Game Discovery App Main Controller
 */

import {
  TRANSLATIONS,
  getTranslation,
  translateTag,
  formatDate,
  escapeHtml,
  applyTranslations
} from './js/i18n.js';
import { Storage } from './js/storage.js';
import { fetchGamesByTag, translateText } from './js/api.js';
import { setupCardGestures } from './js/gestures.js';

// Application State
const state = {
  gamesQueue: [],
  currentQueueIndex: 0,
  likedList: [],
  skippedList: [],
  currentTag: 'newest',
  isFetching: false,
  language: 'ja',
};

let activeCardElement = null;

// DOM Elements Cache
const DOM = {
  cardStack: document.getElementById('cardStack'),
  shimmerCard: document.getElementById('shimmerCard'),
  emptyCard: document.getElementById('emptyCard'),
  tagFilter: document.getElementById('tagFilter'),

  // Controls
  btnSkip: document.getElementById('btnSkip'),
  btnInfo: document.getElementById('btnInfo'),
  btnLike: document.getElementById('btnLike'),
  btnResetSkips: document.getElementById('btnResetSkips'),

  // Liked Modal
  btnOpenLiked: document.getElementById('btnOpenLiked'),
  btnCloseLiked: document.getElementById('btnCloseLiked'),
  likedModal: document.getElementById('likedModal'),
  likedList: document.getElementById('likedList'),
  likedCountBadge: document.getElementById('likedCountBadge'),
  likedCountTitle: document.getElementById('likedCountTitle'),
  btnClearLikes: document.getElementById('btnClearLikes'),
  btnOpenAllLikes: document.getElementById('btnOpenAllLikes'),
  popupWarning: document.getElementById('popupWarning'),

  // Settings Modal
  btnOpenSettings: document.getElementById('btnOpenSettings'),
  btnCloseSettings: document.getElementById('btnCloseSettings'),
  settingsModal: document.getElementById('settingsModal'),
  btnResetSkipsSettings: document.getElementById('btnResetSkipsSettings'),
  btnClearLikesSettings: document.getElementById('btnClearLikesSettings'),
  langSelector: document.getElementById('langSelector'),

  // Help Modal
  btnOpenHelp: document.getElementById('btnOpenHelp'),
  btnCloseHelp: document.getElementById('btnCloseHelp'),
  helpModal: document.getElementById('helpModal'),

  // Toasts
  toastContainer: document.getElementById('toastContainer'),
};

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
    DOM.helpModal.classList.remove('hidden');
    Storage.markHelpSeen();
  }
}

function setLanguage(lang) {
  state.language = lang;
  Storage.saveLanguage(lang);
  document.documentElement.lang = lang;
  applyTranslations(lang);
}

// Event Listeners Registration
function setupEventListeners() {
  // Tag Filter
  DOM.tagFilter.addEventListener('change', (e) => {
    state.currentTag = e.target.value;
    state.gamesQueue = [];
    state.currentQueueIndex = 0;
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
    DOM.settingsModal.classList.add('hidden');
  });

  // Liked Modal
  DOM.btnOpenLiked.addEventListener('click', openLikedModal);
  DOM.btnCloseLiked.addEventListener('click', () => DOM.likedModal.classList.add('hidden'));
  DOM.likedModal.addEventListener('click', (e) => {
    if (e.target === DOM.likedModal) DOM.likedModal.classList.add('hidden');
  });
  DOM.btnClearLikes.addEventListener('click', clearLikes);
  if (DOM.btnOpenAllLikes) {
    DOM.btnOpenAllLikes.addEventListener('click', openAllLikedGames);
  }

  // Settings Modal
  DOM.btnOpenSettings.addEventListener('click', () => DOM.settingsModal.classList.remove('hidden'));
  DOM.btnCloseSettings.addEventListener('click', () => DOM.settingsModal.classList.add('hidden'));
  DOM.settingsModal.addEventListener('click', (e) => {
    if (e.target === DOM.settingsModal) DOM.settingsModal.classList.add('hidden');
  });
  DOM.btnClearLikesSettings.addEventListener('click', () => {
    clearLikes();
    DOM.settingsModal.classList.add('hidden');
  });

  // Help Modal
  DOM.btnOpenHelp.addEventListener('click', () => DOM.helpModal.classList.remove('hidden'));
  DOM.btnCloseHelp.addEventListener('click', () => DOM.helpModal.classList.add('hidden'));
  DOM.helpModal.addEventListener('click', (e) => {
    if (e.target === DOM.helpModal) DOM.helpModal.classList.add('hidden');
  });

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

// Reset Skips
function resetSkips() {
  state.skippedList = [];
  Storage.saveSkips(state.skippedList);
  showToast(getTranslation(state.language, 'toastResetSkips'), 'info');
  state.gamesQueue = [];
  state.currentQueueIndex = 0;
  fetchGamesPool();
}

// Clear Likes
function clearLikes() {
  const lang = state.language;
  if (confirm(getTranslation(lang, 'confirmClearLikes'))) {
    state.likedList = [];
    Storage.saveLikes(state.likedList);
    updateLikedBadge();
    renderLikedList();
    showToast(getTranslation(lang, 'toastClearLikes'), 'info');
  }
}

// Open All Liked Games
function openAllLikedGames() {
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

// Toast Notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'like' ? 'like-toast' : ''}`;
  toast.textContent = message;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Liked Count Badge
function updateLikedBadge() {
  const count = state.likedList.length;
  DOM.likedCountBadge.textContent = count;
  DOM.likedCountTitle.textContent = count;

  if (count > 0) {
    DOM.likedCountBadge.classList.remove('hidden');
  } else {
    DOM.likedCountBadge.classList.add('hidden');
  }
}

// Fetch Game Feed
async function fetchGamesPool() {
  if (state.isFetching) return;
  state.isFetching = true;

  DOM.shimmerCard.classList.remove('hidden');
  DOM.emptyCard.classList.add('hidden');

  try {
    const rawGames = await fetchGamesByTag(state.currentTag);

    // Filter out already liked or skipped games
    const newGames = rawGames.filter(game => {
      const isLiked = state.likedList.some(item => item.id === game.id);
      const isSkipped = state.skippedList.includes(game.id);
      return !isLiked && !isSkipped;
    });

    state.gamesQueue = [...state.gamesQueue, ...newGames];
    DOM.shimmerCard.classList.add('hidden');
    renderCards();
  } catch (error) {
    console.error('Error in fetchGamesPool:', error);
    showToast(getTranslation(state.language, 'toastNetworkError'), 'error');
    DOM.shimmerCard.classList.add('hidden');

    if (state.gamesQueue.length === 0 || state.currentQueueIndex >= state.gamesQueue.length) {
      DOM.emptyCard.classList.remove('hidden');
    }
  } finally {
    state.isFetching = false;
  }
}

// Render Card Stack
function renderCards() {
  const dynamicCards = DOM.cardStack.querySelectorAll('.game-card');
  dynamicCards.forEach(c => c.remove());

  const remaining = state.gamesQueue.length - state.currentQueueIndex;

  if (remaining === 0) {
    DOM.emptyCard.classList.remove('hidden');
    return;
  }

  const maxToRender = Math.min(2, remaining);

  for (let i = maxToRender - 1; i >= 0; i--) {
    const indexInQueue = state.currentQueueIndex + i;
    const game = state.gamesQueue[indexInQueue];
    const isTopCard = (i === 0);

    const cardEl = createCardDOM(game, isTopCard, indexInQueue);
    DOM.cardStack.insertBefore(cardEl, DOM.shimmerCard);

    if (isTopCard) {
      activeCardElement = cardEl;
      setupCardGestures(cardEl, {
        onSwipe: (dir) => executeSwipe(dir),
        isExpanded: () => cardEl.classList.contains('expanded')
      });
    }
  }

  // Preload next batch if low
  if (remaining < 5 && !state.isFetching) {
    fetchGamesPool();
  }
}

// Create Card DOM Element
function createCardDOM(game, isTopCard, index) {
  const card = document.createElement('div');
  card.className = `card game-card ${isTopCard ? 'top-card' : 'next-card'}`;
  card.dataset.index = index;
  card.dataset.id = game.id;

  if (!isTopCard) {
    card.style.transform = 'scale(0.95) translateY(12px)';
    card.style.opacity = '0.7';
    card.style.pointerEvents = 'none';
  }

  const lang = state.language;
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.ja;

  const tagsHtml = game.tags && game.tags.length > 0
    ? game.tags.map(t => `<span class="tag">${translateTag(t, lang)}</span>`).join('')
    : `<span class="tag">${translateTag('Indie', lang)}</span>`;

  const priceDisplay = game.price === 'Free' ? dict.priceFree : escapeHtml(game.price);

  const translateBtnHtml = lang === 'en'
    ? ''
    : `
      <div class="translate-container" style="display: flex; justify-content: flex-end;">
        <button class="btn-translate secondary-button" style="padding: 4px 10px; font-size: 11px; font-weight: 600; border-radius: 6px; display: flex; align-items: center; gap: 4px;" data-translated="false">
          <span>${dict.translateToJa}</span>
        </button>
      </div>`;

  const panelTranslateBtnHtml = lang === 'en'
    ? ''
    : `
      <div class="translate-container" style="margin-bottom: 12px; display: flex; justify-content: flex-end;">
        <button class="btn-translate secondary-button" style="padding: 6px 12px; font-size: 13px; font-weight: 600; border-radius: 6px; display: flex; align-items: center; gap: 6px;" data-translated="false">
          <span>${dict.translateToJa}</span>
        </button>
      </div>`;

  card.innerHTML = `
    <!-- Top Media -->
    <div class="card-media">
      <img src="${game.headerImage}" alt="${escapeHtml(game.name)}">
    </div>

    <!-- Info Section -->
    <div class="card-info">
      <div class="card-header-line">
        <h2 class="card-title">${escapeHtml(game.name)}</h2>
        <span class="card-price">${priceDisplay}</span>
      </div>
      <p class="card-dev">by ${escapeHtml(game.developer)}</p>
      ${translateBtnHtml}
      <p class="card-desc">${escapeHtml(game.description)}</p>

      <div class="card-tags">
        ${tagsHtml}
      </div>
    </div>

    <!-- Expanding Details Panel -->
    <div class="card-details-panel">
      <header class="panel-header">
        <h3 class="panel-title">${escapeHtml(game.name)}</h3>
      </header>
      <div class="panel-body">
        ${panelTranslateBtnHtml}
        <p class="panel-desc-full" style="white-space: pre-wrap; font-size: 15px; margin-bottom: 20px;">${escapeHtml(game.description)}</p>
        <div class="panel-meta">
          <div class="meta-row">
            <span class="meta-label">${dict.devLabel}</span>
            <span class="meta-value">${escapeHtml(game.developer)}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">${dict.priceLabel}</span>
            <span class="meta-value">${priceDisplay}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">${dict.platformsLabel}</span>
            <span class="meta-value">${game.tags.filter(t => ['windows', 'mac', 'linux', 'android', 'web', 'other'].includes(t.toLowerCase())).map(t => translateTag(t, lang)).join(', ') || dict.platformWeb + ' / ' + dict.platformOther}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">${dict.publishedLabel}</span>
            <span class="meta-value">${formatDate(game.published, lang)}</span>
          </div>
        </div>
        <div style="margin-top: 24px; display: flex; justify-content: center;">
          <a href="${game.link}" target="_blank" rel="noopener" class="btn-itch-link" style="width: 100%; justify-content: center; padding: 12px; font-size: 14px; border-radius: 12px; gap: 8px;">
            ${dict.openItchDetails}
          </a>
        </div>
      </div>
    </div>
  `;

  return card;
}

// Card Expansion Toggle
function toggleCardInfoExpansion() {
  if (!activeCardElement) return;
  activeCardElement.classList.toggle('expanded');

  const infoBtn = DOM.btnInfo;
  if (activeCardElement.classList.contains('expanded')) {
    infoBtn.style.transform = 'scale(0.9) rotate(180deg)';
    infoBtn.style.background = 'rgba(250, 92, 92, 0.2)';
  } else {
    infoBtn.style.transform = 'none';
    infoBtn.style.background = '';
  }
}

// Button Swipe Handler
function handleButtonSwipe(direction) {
  if (!activeCardElement || state.isFetching) return;

  if (activeCardElement.classList.contains('swiped-left') || activeCardElement.classList.contains('swiped-right')) {
    return;
  }

  activeCardElement.classList.add(direction === 'right' ? 'swiping-right' : 'swiping-left');
  executeSwipe(direction);
}

// Execute Swipe Logic
function executeSwipe(direction) {
  const card = activeCardElement;
  if (!card) return;

  const gameId = parseInt(card.dataset.id, 10);
  const game = state.gamesQueue[state.currentQueueIndex];

  card.className = `card game-card ${direction === 'right' ? 'swiped-right' : 'swiped-left'}`;

  DOM.btnInfo.style.transform = 'none';
  DOM.btnInfo.style.background = '';

  if (direction === 'right') {
    if (game && !state.likedList.some(item => item.id === gameId)) {
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
  } else {
    state.skippedList.push(gameId);
    Storage.saveSkips(state.skippedList);
  }

  state.currentQueueIndex++;

  setTimeout(() => {
    card.remove();
    renderCards();
  }, 350);
}

// Liked Drawer
function openLikedModal() {
  DOM.likedModal.classList.remove('hidden');

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

function renderLikedList() {
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

function removeLike(gameId) {
  state.likedList = state.likedList.filter(game => game.id !== gameId);
  Storage.saveLikes(state.likedList);
  updateLikedBadge();
  renderLikedList();
  showToast(getTranslation(state.language, 'toastRemoveLike'), 'info');
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

// Description Translation Click Handler
async function handleTranslateClick(btn) {
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
