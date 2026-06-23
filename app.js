/**
 * Swiptch - itch.io Game Discovery App Main Logic
 */

// API Base Path
const API_BASE = '/api';

// Localization Resources
const TRANSLATIONS = {
  ja: {
    appTitle: "Swiptch (スイプチ) - itch.ioゲームディスカバリーアプリ",
    featured: "おすすめ (Featured)",
    newAndPopular: "新着＆人気 (New & Popular)",
    newest: "完全新着 (Newest)",
    topSellers: "ベストセラー (Top Sellers)",
    action: "アクション",
    horror: "ホラー",
    roguelike: "ローグライク",
    metroidvania: "メトロイドヴァニア",
    casual: "カジュアル",
    adventure: "アドベンチャー",
    rpg: "RPG",
    platformer: "プラットフォーマー",
    simulation: "シミュレーション",
    
    emptyTitle: "フィードの最後まで見たよ！",
    emptyDesc: "上のタグフィルターを変更するか、スキップした履歴をリセットしてブラウジングを続けてね。",
    btnResetSkips: "スキップしたゲームをリセット",
    likedTitle: "お気に入りしたゲーム",
    modalHint: "「itch.ioで開く」をタップすると開発者のページが開いて、ゲームのプレイや応援ができるよ！",
    noLikes: "まだお気に入りしたゲームがないよ！右スワイプでお気に入りに追加してね。",
    btnClearLikes: "お気に入りをすべて削除",
    aboutTitle: "Swiptchについて",
    aboutText1: "<strong>Swiptch（スイプチ）</strong>は、<a href=\"https://itch.io\" target=\"_blank\" rel=\"noopener\">itch.io</a>の面白いインディーゲームをカードスワイプ操作で直感的にディグれるアプリだよ。",
    aboutText2: "itch.io公式のRSSフィードを解析して、注目作品や特定のタグのゲームを、スマホ向けに最適化されたジェスチャーUIで直接表示するよ。",
    aboutText3: "⚠️ このアプリは非公式のファンツールです。itch.ioとは無関係です。<br>表示されるゲームの著作権・画像・説明文はそれぞれの開発者に帰属します。<br>ゲームデータは <a href=\"https://itch.io\" target=\"_blank\" rel=\"noopener\" style=\"color: var(--accent-red);\">itch.io</a> 公式RSSフィードより取得しています。",
    viewSource: "GitHubでソースコードを見る",
    localSettings: "ローカル設定",
    langLabel: "言語 (Language)",
    resetSkipsSettings: "スキップしたゲームをリセット",
    clearLikesSettings: "お気に入りしたゲームを全削除",
    helpTitle: "Swiptchの使い方",
    helpSwipeRightTitle: "右スワイプ / ハートボタン",
    helpSwipeRightDesc: "ゲームをお気に入りリストに保存するよ。",
    helpSwipeLeftTitle: "左スワイプ / バツボタン",
    helpSwipeLeftDesc: "ゲームをスキップして、次のゲームを表示するよ。",
    helpTapTitle: "カードをタップ / iボタン",
    helpTapDesc: "カードをめくって、詳細な説明、開発者、価格、対応プラットフォームを確認できるよ。",
    helpItchTitle: "Open on itch.io",
    helpItchDesc: "詳細画面やお気に入りリストにある「itch.ioで開く」からゲームページに飛べるよ！",
    helpFilterTitle: "タグで絞り込み",
    helpFilterDesc: "ヘッダーのプルダウンを使って、ホラーやローグライク、アクションなどのジャンルで絞り込めるよ。",
    
    // Dynamic JS texts
    toastResetSkips: "スキップしたゲームをリセットしたよ！",
    confirmClearLikes: "本当にお気に入りリストをすべて削除する？",
    toastClearLikes: "お気に入りリストをクリアしたよ。",
    toastTranslationFailed: "翻訳に失敗したよ。ネットワークを確認してみてね。",
    toastNetworkError: "Swiptch APIへの接続でエラーが発生したよ。",
    toastAddLike: "「{name}」をお気に入りに追加したよ！ ❤️",
    toastRemoveLike: "お気に入りから削除したよ。",
    translateToJa: "🇯🇵 日本語に翻訳",
    restoreOriginal: "🇺🇸 原文に戻す",
    translating: "翻訳中...",
    priceFree: "無料",
    devLabel: "開発者",
    priceLabel: "価格",
    platformsLabel: "対応プラットフォーム",
    publishedLabel: "リリース日",
    openItchDetails: "🌐 itch.ioで詳細を開く",
    openItch: "🌐 itch.ioで開く",
    
    // Date and platform tags translations
    datePattern: "{y}年{m}月{d}日",
    unknownDate: "不明",
    platformWeb: "ブラウザ版",
    platformOther: "その他",
    windows: "Windows",
    mac: "Mac",
    linux: "Linux",
    android: "Android",
    free: "無料",
    indie: "インディー"
  },
  en: {
    appTitle: "Swiptch - itch.io Game Discovery App",
    featured: "Featured",
    newAndPopular: "New & Popular",
    newest: "Newest",
    topSellers: "Top Sellers",
    action: "Action",
    horror: "Horror",
    roguelike: "Roguelike",
    metroidvania: "Metroidvania",
    casual: "Casual",
    adventure: "Adventure",
    rpg: "RPG",
    platformer: "Platformer",
    simulation: "Simulation",
    
    emptyTitle: "You've reached the end!",
    emptyDesc: "Change the tag filter above or reset skipped history to continue browsing.",
    btnResetSkips: "Reset Skipped Games",
    likedTitle: "Liked Games",
    modalHint: "Tap 'Open on itch.io' to open the developer's page, play, or support their work!",
    noLikes: "No liked games yet! Swipe right to add games to your favorites.",
    btnClearLikes: "Clear All Favorites",
    aboutTitle: "About Swiptch",
    aboutText1: "<strong>Swiptch</strong> is a web application where you can intuitively discover interesting indie games on <a href=\"https://itch.io\" target=\"_blank\" rel=\"noopener\">itch.io</a> using swipe gestures.",
    aboutText2: "It parses itch.io's official RSS feeds and displays featured games or specific tags with a mobile-optimized gesture UI.",
    aboutText3: "⚠️ This application is an unofficial fan tool and is not affiliated with itch.io.<br>Copyrights, images, and descriptions of games belong to their respective developers.<br>Game data is fetched from the <a href=\"https://itch.io\" target=\"_blank\" rel=\"noopener\" style=\"color: var(--accent-red);\">itch.io</a> official RSS feeds.",
    viewSource: "View Source on GitHub",
    localSettings: "Local Settings",
    langLabel: "Language",
    resetSkipsSettings: "Reset Skipped Games",
    clearLikesSettings: "Clear All Favorites",
    helpTitle: "How to Use Swiptch",
    helpSwipeRightTitle: "Swipe Right / Heart Button",
    helpSwipeRightDesc: "Save the game to your favorites list.",
    helpSwipeLeftTitle: "Swipe Left / Cross Button",
    helpSwipeLeftDesc: "Skip the game and show the next one.",
    helpTapTitle: "Tap Card / Info Button",
    helpTapDesc: "Flip the card to check detailed descriptions, developer, price, and supported platforms.",
    helpItchTitle: "Open on itch.io",
    helpItchDesc: "Navigate to the game page from the 'Open on itch.io' button in the details panel or favorites list!",
    helpFilterTitle: "Filter by Tags",
    helpFilterDesc: "Use the dropdown in the header to filter games by genres like Horror, Roguelike, Action, and more.",
    
    // Dynamic JS texts
    toastResetSkips: "Skipped history has been reset!",
    confirmClearLikes: "Are you sure you want to remove all favorite games?",
    toastClearLikes: "Favorites list cleared.",
    toastTranslationFailed: "Translation failed. Please check your network connection.",
    toastNetworkError: "An error occurred while connecting to Swiptch API.",
    toastAddLike: "Added \"{name}\" to favorites! ❤️",
    toastRemoveLike: "Removed from favorites.",
    translateToJa: "🇯🇵 Translate to Japanese",
    restoreOriginal: "🇺🇸 Restore Original",
    translating: "Translating...",
    priceFree: "Free",
    devLabel: "Developer",
    priceLabel: "Price",
    platformsLabel: "Platforms",
    publishedLabel: "Published",
    openItchDetails: "🌐 Open on itch.io",
    openItch: "🌐 Open on itch.io",
    
    // Date and platform tags translations
    datePattern: "{m}/{d}/{y}",
    unknownDate: "Unknown",
    platformWeb: "Web",
    platformOther: "Other",
    windows: "Windows",
    mac: "Mac",
    linux: "Linux",
    android: "Android",
    free: "Free",
    indie: "Indie"
  }
};

function translateTag(tag) {
  const normalized = tag.toLowerCase().trim();
  const lang = state.language || 'ja';
  return TRANSLATIONS[lang][normalized] || TRANSLATIONS[lang][tag] || tag;
}

function formatDate(dateStr) {
  const lang = state.language || 'ja';
  if (!dateStr) return TRANSLATIONS[lang].unknownDate;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return TRANSLATIONS[lang].datePattern
      .replace('{y}', y)
      .replace('{m}', m)
      .replace('{d}', d);
  } catch (e) {
    return dateStr;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// State Management
const state = {
  gamesQueue: [],
  currentQueueIndex: 0,
  likedList: [],      // Array of game objects: { id, name, developer, price, headerImage, link, description }
  skippedList: [],    // Array of game ids
  currentTag: 'newest',
  isFetching: false,
  language: 'ja',     // User language choice: 'ja' or 'en'
};

// Touch / Drag Gesture State
let dragStart = null;
let currentTransform = { x: 0, y: 0 };
let activeCardElement = null;

// DOM Elements
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
  
  // Liked Drawer Modal
  btnOpenLiked: document.getElementById('btnOpenLiked'),
  btnCloseLiked: document.getElementById('btnCloseLiked'),
  likedModal: document.getElementById('likedModal'),
  likedList: document.getElementById('likedList'),
  likedCountBadge: document.getElementById('likedCountBadge'),
  likedCountTitle: document.getElementById('likedCountTitle'),
  btnClearLikes: document.getElementById('btnClearLikes'),
  
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

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadLocalStorage();
  
  // Set initial language from local state or detect from browser
  if (!state.language) {
    const browserLang = (navigator.language || 'ja').substring(0, 2);
    state.language = (browserLang === 'ja') ? 'ja' : 'en';
    saveState('swiptch_lang', state.language);
  }
  
  // Apply language settings to UI and Selector
  setLanguage(state.language);
  if (DOM.langSelector) {
    DOM.langSelector.value = state.language;
  }
  
  registerServiceWorker();
  setupEventListeners();
  checkFirstVisitHelp();
  
  // Initial load
  fetchGamesPool();
});

// Check if user is visiting for the first time, if so, open Help
function checkFirstVisitHelp() {
  const hasSeenHelp = localStorage.getItem('swiptch_seen_help');
  if (!hasSeenHelp) {
    DOM.helpModal.classList.remove('hidden');
    localStorage.setItem('swiptch_seen_help', 'true');
  }
}

// Load state from LocalStorage
function loadLocalStorage() {
  try {
    state.likedList = JSON.parse(localStorage.getItem('swiptch_likes')) || [];
    state.skippedList = JSON.parse(localStorage.getItem('swiptch_skips')) || [];
    state.language = localStorage.getItem('swiptch_lang');
    
    // Apply initial badge states
    updateLikedBadge();
  } catch (e) {
    console.error('Error reading localStorage data:', e);
  }
}

// Save state back to LocalStorage
function saveState(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data to localStorage:', e);
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Tag Filter selection change
  DOM.tagFilter.addEventListener('change', (e) => {
    state.currentTag = e.target.value;
    state.gamesQueue = [];
    state.currentQueueIndex = 0;
    fetchGamesPool();
  });

  // Swipe Action buttons
  DOM.btnSkip.addEventListener('click', () => handleButtonSwipe('left'));
  DOM.btnLike.addEventListener('click', () => handleButtonSwipe('right'));
  DOM.btnInfo.addEventListener('click', toggleCardInfoExpansion);
  
  // Reset Skips (empty card view)
  DOM.btnResetSkips.addEventListener('click', resetSkips);
  
  // Reset Skips (settings view)
  DOM.btnResetSkipsSettings.addEventListener('click', () => {
    resetSkips();
    DOM.settingsModal.classList.add('hidden');
  });

  // Open / Close Liked Drawer
  DOM.btnOpenLiked.addEventListener('click', openLikedModal);
  DOM.btnCloseLiked.addEventListener('click', () => DOM.likedModal.classList.add('hidden'));
  DOM.likedModal.addEventListener('click', (e) => {
    if (e.target === DOM.likedModal) DOM.likedModal.classList.add('hidden');
  });

  // Open / Close Settings Modal
  DOM.btnOpenSettings.addEventListener('click', () => DOM.settingsModal.classList.remove('hidden'));
  DOM.btnCloseSettings.addEventListener('click', () => DOM.settingsModal.classList.add('hidden'));
  DOM.settingsModal.addEventListener('click', (e) => {
    if (e.target === DOM.settingsModal) DOM.settingsModal.classList.add('hidden');
  });

  // Open / Close Help Modal
  DOM.btnOpenHelp.addEventListener('click', () => DOM.helpModal.classList.remove('hidden'));
  DOM.btnCloseHelp.addEventListener('click', () => DOM.helpModal.classList.add('hidden'));
  DOM.helpModal.addEventListener('click', (e) => {
    if (e.target === DOM.helpModal) DOM.helpModal.classList.add('hidden');
  });

  // Clear Likes (liked drawer view)
  DOM.btnClearLikes.addEventListener('click', clearLikes);
  
  // Clear Likes (settings view)
  DOM.btnClearLikesSettings.addEventListener('click', () => {
    clearLikes();
    DOM.settingsModal.classList.add('hidden');
  });

  // Language selection change
  if (DOM.langSelector) {
    DOM.langSelector.addEventListener('change', (e) => {
      setLanguage(e.target.value);
      // Re-render cards and liked list to update current list translations
      renderCards();
      if (!DOM.likedModal.classList.contains('hidden')) {
        renderLikedList();
      }
    });
  }

  // Translate button inside card details (using event delegation)
  DOM.cardStack.addEventListener('click', (e) => {
    const translateBtn = e.target.closest('.btn-translate');
    if (translateBtn) {
      handleTranslateClick(translateBtn);
    }
  });
}

// Reset Skips helper
function resetSkips() {
  state.skippedList = [];
  saveState('swiptch_skips', state.skippedList);
  showToast(TRANSLATIONS[state.language].toastResetSkips, 'info');
  state.gamesQueue = [];
  state.currentQueueIndex = 0;
  fetchGamesPool();
}

// Clear Likes helper
function clearLikes() {
  const lang = state.language;
  if (confirm(TRANSLATIONS[lang].confirmClearLikes)) {
    state.likedList = [];
    saveState('swiptch_likes', state.likedList);
    updateLikedBadge();
    renderLikedList();
    showToast(TRANSLATIONS[lang].toastClearLikes, 'info');
  }
}

// Toast Helper
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'like' ? 'like-toast' : ''}`;
  toast.textContent = message;
  
  DOM.toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Update Liked Badge Counts
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

// Fetch Games from Serverless Backend
async function fetchGamesPool() {
  if (state.isFetching) return;
  state.isFetching = true;
  
  // Show Loading Shimmer and Hide Empty Card
  DOM.shimmerCard.classList.remove('hidden');
  DOM.emptyCard.classList.add('hidden');
  
  try {
    const response = await fetch(`${API_BASE}/discover?tag=${encodeURIComponent(state.currentTag)}`);
    if (!response.ok) throw new Error('Network error fetching games');
    
    const data = await response.json();
    
    // Filter out games that the user has already seen (liked or skipped)
    const newGames = (data.games || []).filter(game => {
      const isLiked = state.likedList.some(item => item.id === game.id);
      const isSkipped = state.skippedList.includes(game.id);
      return !isLiked && !isSkipped;
    });

    state.gamesQueue = [...state.gamesQueue, ...newGames];
    
    // Hide loading shimmer
    DOM.shimmerCard.classList.add('hidden');
    
    // Show cards
    renderCards();
  } catch (error) {
    console.error('Error discovery query:', error);
    showToast(TRANSLATIONS[state.language].toastNetworkError, 'error');
    DOM.shimmerCard.classList.add('hidden');
    
    if (state.gamesQueue.length === 0 || state.currentQueueIndex >= state.gamesQueue.length) {
      DOM.emptyCard.classList.remove('hidden');
    }
  } finally {
    state.isFetching = false;
  }
}

// Main Card Renderer
function renderCards() {
  const dynamicCards = DOM.cardStack.querySelectorAll('.game-card');
  dynamicCards.forEach(c => c.remove());
  
  const remaining = state.gamesQueue.length - state.currentQueueIndex;
  
  if (remaining === 0) {
    DOM.emptyCard.classList.remove('hidden');
    return;
  }
  
  // Render top card and next card (for visual depth stack)
  const maxToRender = Math.min(2, remaining);
  
  for (let i = maxToRender - 1; i >= 0; i--) {
    const indexInQueue = state.currentQueueIndex + i;
    const game = state.gamesQueue[indexInQueue];
    const isTopCard = (i === 0);
    
    const cardEl = createCardDOM(game, isTopCard, indexInQueue);
    DOM.cardStack.insertBefore(cardEl, DOM.shimmerCard);
    
    if (isTopCard) {
      activeCardElement = cardEl;
      setupDragEvents(cardEl);
    }
  }
  
  // If queue is running low (< 5 games), fetch more in background
  if (remaining < 5 && !state.isFetching) {
    fetchGamesPool();
  }
}

// Create Card HTML Element
function createCardDOM(game, isTopCard, index) {
  const card = document.createElement('div');
  card.className = `card game-card ${isTopCard ? 'top-card' : 'next-card'}`;
  card.dataset.index = index;
  card.dataset.id = game.id;
  
  // Depth Styling for Stack
  if (!isTopCard) {
    card.style.transform = 'scale(0.95) translateY(12px)';
    card.style.opacity = '0.7';
    card.style.pointerEvents = 'none';
  }
  
  // itch.io games tags
  const tagsHtml = game.tags && game.tags.length > 0 
    ? game.tags.map(t => `<span class="tag">${translateTag(t)}</span>`).join('')
    : `<span class="tag">${translateTag('Indie')}</span>`;

  const lang = state.language;
  const dict = TRANSLATIONS[lang];
  
  // Price Translation
  const priceDisplay = game.price === 'Free' ? dict.priceFree : escapeHtml(game.price);
  
  // Hide translate button if UI language is English (since original text is usually English)
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
    <!-- Top Visual Media -->
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
    
    <!-- Expanding Full Details Panel -->
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
            <span class="meta-value">${game.tags.filter(t => ['windows', 'mac', 'linux', 'android', 'web', 'other'].includes(t.toLowerCase())).map(t => translateTag(t)).join(', ') || dict.platformWeb + ' / ' + dict.platformOther}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">${dict.publishedLabel}</span>
            <span class="meta-value">${formatDate(game.published)}</span>
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

// Toggle expansion details pane
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

// Setup Pointer Gesture Swipe Triggers
function setupDragEvents(card) {
  card.addEventListener('pointerdown', onPointerDown);
  
  function onPointerDown(e) {
    if (e.target.closest('.card-details-panel') && activeCardElement.classList.contains('expanded')) {
      return;
    }
    
    // Prevent drag triggering on buttons, selectors, or the scrollable description text
    if (
      e.target.closest('.btn-translate') ||
      e.target.closest('.control-button') ||
      e.target.closest('button') ||
      e.target.closest('select') ||
      e.target.closest('.card-desc')
    ) {
      return;
    }
    
    dragStart = { x: e.clientX, y: e.clientY };
    card.classList.add('dragging');
    card.setPointerCapture(e.pointerId);
    
    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerup', onPointerUp);
    card.addEventListener('pointercancel', onPointerCancel);
  }
  
  function onPointerMove(e) {
    if (!dragStart) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    currentTransform = { x: dx, y: dy };
    
    const tilt = dx * 0.08; 
    card.style.transform = `translate(${dx}px, ${dy}px) rotate(${tilt}deg)`;
    
    if (dx > 40) {
      card.style.borderColor = `rgba(250, 92, 92, ${Math.min(0.8, (dx - 40) / 100)})`;
      card.style.boxShadow = `0 15px 40px rgba(250, 92, 92, ${Math.min(0.35, (dx - 40) / 200)})`;
    } else if (dx < -40) {
      card.style.borderColor = `rgba(255, 255, 255, ${Math.min(0.3, (-dx - 40) / 100)})`;
      card.style.boxShadow = `0 15px 40px rgba(255, 255, 255, ${Math.min(0.1, (-dx - 40) / 200)})`;
    } else {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    }
  }
  
  function onPointerUp(e) {
    if (!dragStart) return;
    
    card.releasePointerCapture(e.pointerId);
    card.removeEventListener('pointermove', onPointerMove);
    card.removeEventListener('pointerup', onPointerUp);
    card.removeEventListener('pointercancel', onPointerCancel);
    
    card.classList.remove('dragging');
    
    const threshold = 130;
    const dx = currentTransform.x;
    
    if (dx > threshold) {
      executeSwipe('right');
    } else if (dx < -threshold) {
      executeSwipe('left');
    } else {
      card.style.transform = '';
      card.style.borderColor = '';
      card.style.boxShadow = '';
    }
    
    dragStart = null;
    currentTransform = { x: 0, y: 0 };
  }
  
  function onPointerCancel(e) {
    onPointerUp(e);
  }
}

// Button-triggered swipes
function handleButtonSwipe(direction) {
  if (!activeCardElement || state.isFetching) return;
  
  if (activeCardElement.classList.contains('swiped-left') || activeCardElement.classList.contains('swiped-right')) {
    return;
  }
  
  activeCardElement.classList.add(direction === 'right' ? 'swiping-right' : 'swiping-left');
  executeSwipe(direction);
}

// Process Swiping Actions
function executeSwipe(direction) {
  const card = activeCardElement;
  if (!card) return;
  
  const gameId = parseInt(card.dataset.id, 10);
  const game = state.gamesQueue[state.currentQueueIndex];
  
  card.className = `card game-card ${direction === 'right' ? 'swiped-right' : 'swiped-left'}`;
  
  DOM.btnInfo.style.transform = 'none';
  DOM.btnInfo.style.background = '';
  
  if (direction === 'right') {
    // Like game
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
      saveState('swiptch_likes', state.likedList);
      updateLikedBadge();
      
      const toastMsg = TRANSLATIONS[state.language].toastAddLike.replace('{name}', game.name);
      showToast(toastMsg, 'like');
    }
  } else {
    // Skip game
    state.skippedList.push(gameId);
    saveState('swiptch_skips', state.skippedList);
  }
  
  state.currentQueueIndex++;
  
  setTimeout(() => {
    card.remove();
    renderCards();
  }, 350);
}

// Open Liked List Drawer
function openLikedModal() {
  DOM.likedModal.classList.remove('hidden');
  renderLikedList();
}

// Render dynamic elements inside liked drawer
function renderLikedList() {
  DOM.likedList.innerHTML = '';
  const lang = state.language;
  const dict = TRANSLATIONS[lang];
  
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
    
    // Bind remove event
    item.querySelector('.btn-remove-liked').addEventListener('click', () => {
      removeLike(game.id);
    });
    
    DOM.likedList.appendChild(item);
  });
}

// Remove game from likes list
function removeLike(gameId) {
  state.likedList = state.likedList.filter(game => game.id !== gameId);
  saveState('swiptch_likes', state.likedList);
  updateLikedBadge();
  renderLikedList();
  showToast(TRANSLATIONS[state.language].toastRemoveLike, 'info');
}

// Register PWA Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('ServiceWorker registration successful with scope: ', reg.scope))
        .catch(err => console.warn('ServiceWorker registration failed: ', err));
    });
  }
}

// Handle Translate Button Click
async function handleTranslateClick(btn) {
  const card = btn.closest('.game-card');
  if (!card) return;
  
  // Find correct description element based on button container
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
  const dict = TRANSLATIONS[lang];
  
  if (isTranslated) {
    // Restore original text
    const originalText = btn.dataset.originalText || '';
    descEl.textContent = originalText;
    btn.dataset.translated = 'false';
    btn.querySelector('span').textContent = dict.translateToJa;
    btn.classList.remove('translated');
  } else {
    // Translate text
    const textToTranslate = descEl.textContent.trim();
    if (!textToTranslate) return;
    
    // Save original text
    if (!btn.dataset.originalText) {
      btn.dataset.originalText = textToTranslate;
    }
    
    btn.classList.add('loading');
    btn.disabled = true;
    btn.querySelector('span').textContent = dict.translating;
    
    try {
      const translatedText = await translateText(textToTranslate);
      descEl.textContent = translatedText;
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

// Google Translate Free Web API Fetcher
async function translateText(text) {
  if (!text) return '';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ja&dt=t&q=${encodeURIComponent(text)}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch translation');
  }
  
  const data = await response.json();
  if (data && data[0]) {
    return data[0].map(item => item[0] || '').join('');
  }
  
  throw new Error('Invalid translation response');
}

// Set Active Language
function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  state.language = lang;
  saveState('swiptch_lang', lang);
  document.documentElement.lang = lang;
  
  updateI18n();
}

// Update UI Texts based on language
function updateI18n() {
  const lang = state.language;
  const dict = TRANSLATIONS[lang];
  
  // Update document title
  document.title = dict.appTitle;
  
  // Translate static text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (el && dict[key]) {
      el.textContent = dict[key];
    }
  });
  
  // Translate HTML elements (e.g. including links)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml || el.getAttribute('data-i18n-html');
    if (el && dict[key]) {
      el.innerHTML = dict[key];
    }
  });
}
