/**
 * Swiptch - itch.io Game Discovery App Main Logic
 */

// API Base Path
const API_BASE = '/api';

// State Management
const state = {
  gamesQueue: [],
  currentQueueIndex: 0,
  likedList: [],      // Array of game objects: { id, name, developer, price, headerImage, link, description }
  skippedList: [],    // Array of game ids
  currentTag: 'Featured',
  isFetching: false,
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
}

// Reset Skips helper
function resetSkips() {
  state.skippedList = [];
  saveState('swiptch_skips', state.skippedList);
  showToast('Skipped games list reset!', 'info');
  state.gamesQueue = [];
  state.currentQueueIndex = 0;
  fetchGamesPool();
}

// Clear Likes helper
function clearLikes() {
  if (confirm('Are you sure you want to clear your liked list?')) {
    state.likedList = [];
    saveState('swiptch_likes', state.likedList);
    updateLikedBadge();
    renderLikedList();
    showToast('Liked list cleared.', 'info');
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
    showToast('Error connecting to Swiptch API.', 'error');
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
  console.log(`[Swiptch Debug] Rendering card #${index}: ${game.name} - Image URL: ${game.headerImage}`);
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
    ? game.tags.map(t => `<span class="tag">${t}</span>`).join('')
    : '<span class="tag">Indie</span>';

  card.innerHTML = `
    <!-- Top Visual Media -->
    <div class="card-media">
      <img src="${game.headerImage}" alt="${game.name}">
    </div>
    
    <!-- Info Section -->
    <div class="card-info">
      <div class="card-header-line">
        <h2 class="card-title">${game.name}</h2>
        <span class="card-price">${game.price}</span>
      </div>
      <p class="card-dev">by ${game.developer}</p>
      <p class="card-desc">${game.description}</p>
      
      <div class="card-tags">
        ${tagsHtml}
      </div>
    </div>
    
    <!-- Expanding Full Details Panel -->
    <div class="card-details-panel">
      <header class="panel-header">
        <h3 class="panel-title">${game.name}</h3>
      </header>
      <div class="panel-body">
        <p class="panel-desc-full" style="white-space: pre-wrap; font-size: 15px; margin-bottom: 20px;">${game.description}</p>
        <div class="panel-meta">
          <div class="meta-row">
            <span class="meta-label">Developer</span>
            <span class="meta-value">${game.developer}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Price</span>
            <span class="meta-value">${game.price}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Platforms</span>
            <span class="meta-value">${game.tags.filter(t => ['windows', 'mac', 'linux', 'android', 'web', 'other'].includes(t.toLowerCase())).join(', ') || 'Web / Other'}</span>
          </div>
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
      showToast(`Liked ${game.name}! ❤️`, 'like');
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
  
  if (state.likedList.length === 0) {
    DOM.likedList.innerHTML = `
      <div class="no-likes-message">
        <p>You haven't liked any games yet! Swipe right to see them here.</p>
      </div>
    `;
    return;
  }
  
  state.likedList.forEach(game => {
    const item = document.createElement('div');
    item.className = 'liked-item';
    item.innerHTML = `
      <img src="${game.headerImage}" alt="${game.name}" class="liked-item-img">
      <div class="liked-item-info">
        <h4 class="liked-item-title">${game.name}</h4>
        <p class="liked-item-dev">by ${game.developer} | <span style="color:#fa5c5c; font-weight:700;">${game.price}</span></p>
        <div class="liked-item-actions">
          <a href="${game.link}" target="_blank" rel="noopener" class="btn-itch-link">
            🌐 Open on itch.io
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
  showToast('Removed from liked list.', 'info');
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
