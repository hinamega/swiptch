/**
 * Swiptch - Swipe Deck (Feed / Card Stack / Swipe Actions)
 *
 * 「カードをめくってディグる」中核機能。
 * フィード取得・カードスタック描画・スワイプ実行をまとめて担当する。
 */

import { state } from './state.js';
import { DOM } from './dom.js';
import { Storage } from './storage.js';
import { fetchGamesByTag } from './api.js';
import { getTranslation } from './i18n.js';
import { setupCardGestures } from './gestures.js';
import { createCardDOM } from './card.js';
import { addLike } from './likes.js';
import { showToast } from './ui/toast.js';

const SWIPE_ANIMATION_MS = 350;
const PREFETCH_THRESHOLD = 5;
const RENDER_AHEAD = 2;

let activeCardElement = null;

/**
 * 現在のタグでフィードを追加取得し、キューへ積む
 */
export async function fetchGamesPool() {
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

/**
 * キュー先頭からカードスタックを描画し直す
 */
export function renderCards() {
  const dynamicCards = DOM.cardStack.querySelectorAll('.game-card');
  dynamicCards.forEach(c => c.remove());

  const remaining = state.gamesQueue.length - state.currentQueueIndex;

  if (remaining === 0) {
    DOM.emptyCard.classList.remove('hidden');
    return;
  }

  const maxToRender = Math.min(RENDER_AHEAD, remaining);

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
  if (remaining < PREFETCH_THRESHOLD && !state.isFetching) {
    fetchGamesPool();
  }
}

/**
 * スワイプ結果を状態へ反映し、次のカードを描画する
 * @param {'left' | 'right'} direction
 */
export function executeSwipe(direction) {
  const card = activeCardElement;
  if (!card) return;

  const gameId = parseInt(card.dataset.id, 10);
  const game = state.gamesQueue[state.currentQueueIndex];

  card.className = `card game-card ${direction === 'right' ? 'swiped-right' : 'swiped-left'}`;

  DOM.btnInfo.style.transform = 'none';
  DOM.btnInfo.style.background = '';

  if (direction === 'right') {
    if (game) addLike(game);
  } else {
    state.skippedList.push(gameId);
    Storage.saveSkips(state.skippedList);
  }

  state.currentQueueIndex++;

  setTimeout(() => {
    card.remove();
    renderCards();
  }, SWIPE_ANIMATION_MS);
}

/**
 * 下部ボタンからのスワイプ操作
 * @param {'left' | 'right'} direction
 */
export function handleButtonSwipe(direction) {
  if (!activeCardElement || state.isFetching) return;

  if (activeCardElement.classList.contains('swiped-left') || activeCardElement.classList.contains('swiped-right')) {
    return;
  }

  activeCardElement.classList.add(direction === 'right' ? 'swiping-right' : 'swiping-left');
  executeSwipe(direction);
}

/**
 * カードの詳細パネル開閉トグル
 */
export function toggleCardInfoExpansion() {
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

/**
 * キューとインデックスを初期化する（タグ変更・リセット時）
 */
export function resetQueue() {
  state.gamesQueue = [];
  state.currentQueueIndex = 0;
}
