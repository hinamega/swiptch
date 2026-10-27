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

// フィード取得の世代番号。タグ切替やリセットで増え、
// 古いレスポンスはこの番号がずれて捨てられる。
let fetchGeneration = 0;
// キュー（カードスタック）の世代番号。スワイプ後の遅延描画が
// リセット後のキューに干渉しないようにする。
let queueGeneration = 0;

/**
 * 既にキューに入っている／処理済みのゲーム ID を集める
 */
function collectKnownIds() {
  const ids = new Set();
  state.gamesQueue.forEach(game => ids.add(game.id));
  state.likedList.forEach(game => ids.add(game.id));
  state.skippedList.forEach(id => ids.add(id));
  return ids;
}

/**
 * 現在のタグでフィードを追加取得し、キューへ積む
 * @param {Object} [options]
 * @param {boolean} [options.force] - 取得中でも新しいリクエストを開始する（タグ切替用）
 */
export async function fetchGamesPool({ force = false } = {}) {
  if (state.isFetching && !force) return;

  const generation = ++fetchGeneration;
  state.isFetching = true;

  DOM.shimmerCard.classList.remove('hidden');
  DOM.emptyCard.classList.add('hidden');

  try {
    const rawGames = await fetchGamesByTag(state.currentTag);

    // 取得中にタグが切り替わった／リセットされた場合は結果を捨てる
    if (generation !== fetchGeneration) return;

    // キュー内の重複・処理済み・同一バッチ内の重複をまとめて除外する
    const known = collectKnownIds();
    const newGames = rawGames.filter(game => {
      if (known.has(game.id)) return false;
      known.add(game.id);
      return true;
    });

    state.gamesQueue = [...state.gamesQueue, ...newGames];
    DOM.shimmerCard.classList.add('hidden');
    renderCards();
  } catch (error) {
    if (generation !== fetchGeneration) return;

    console.error('Error in fetchGamesPool:', error);
    showToast(getTranslation(state.language, 'toastNetworkError'), 'error');
    DOM.shimmerCard.classList.add('hidden');

    if (state.gamesQueue.length === 0 || state.currentQueueIndex >= state.gamesQueue.length) {
      DOM.emptyCard.classList.remove('hidden');
    }
  } finally {
    if (generation === fetchGeneration) {
      state.isFetching = false;
    }
  }
}

/**
 * キュー先頭からカードスタックを描画し直す
 */
export function renderCards() {
  const dynamicCards = DOM.cardStack.querySelectorAll('.game-card');
  dynamicCards.forEach(c => c.remove());

  const remaining = state.gamesQueue.length - state.currentQueueIndex;

  if (remaining <= 0) {
    activeCardElement = null;
    DOM.emptyCard.classList.remove('hidden');
    return;
  }

  DOM.emptyCard.classList.add('hidden');

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

  const game = state.gamesQueue[state.currentQueueIndex];
  if (!game) return;

  const generation = queueGeneration;
  const gameId = game.id;

  card.className = `card game-card ${direction === 'right' ? 'swiped-right' : 'swiped-left'}`;

  DOM.btnInfo.style.transform = 'none';
  DOM.btnInfo.style.background = '';

  if (direction === 'right') {
    addLike(game);
  } else {
    if (!state.skippedList.includes(gameId)) {
      state.skippedList.push(gameId);
      Storage.saveSkips(state.skippedList);
    }
  }

  state.currentQueueIndex++;

  setTimeout(() => {
    // タグ切替などでキューが作り直されていたら触らない
    if (generation !== queueGeneration) return;
    card.remove();
    renderCards();
  }, SWIPE_ANIMATION_MS);
}

/**
 * 下部ボタンからのスワイプ操作
 * @param {'left' | 'right'} direction
 */
export function handleButtonSwipe(direction) {
  // フィード取得中でもキュー内のカードは進められるので isFetching では止めない
  if (!activeCardElement) return;

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
 * 表示中のカードも消して、古いタグのカードが残らないようにする。
 */
export function resetQueue() {
  queueGeneration++;
  state.gamesQueue = [];
  state.currentQueueIndex = 0;
  activeCardElement = null;
  DOM.cardStack.querySelectorAll('.game-card').forEach(c => c.remove());
}
