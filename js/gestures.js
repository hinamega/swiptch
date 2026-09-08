/**
 * Swiptch - Touch & Mouse Swipe Gesture Engine
 */

const SWIPE_THRESHOLD = 130;
const TILT_FACTOR = 0.08;

/**
 * カード要素にドラッグ＆スワイプジェスチャーを登録
 * @param {HTMLElement} card 
 * @param {Object} callbacks
 * @param {Function} callbacks.onSwipe - ('left' | 'right') => void
 * @param {Function} callbacks.isExpanded - () => boolean
 */
export function setupCardGestures(card, { onSwipe, isExpanded }) {
  let dragStart = null;
  let currentTransform = { x: 0, y: 0 };

  function onPointerDown(e) {
    // 詳細パネルスクロール中のスワイプ誤爆防止
    if (e.target.closest('.card-details-panel') && isExpanded()) {
      return;
    }

    // 操作系ボタンやスクロール対象でのスワイプ除外
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
    currentTransform = { x: 0, y: 0 };
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

    const tilt = dx * TILT_FACTOR;
    card.style.transform = `translate(${dx}px, ${dy}px) rotate(${tilt}deg)`;

    // 右スワイプ（Like / Crimson）
    if (dx > 40) {
      const alpha = Math.min(0.8, (dx - 40) / 100);
      const shadowAlpha = Math.min(0.35, (dx - 40) / 200);
      card.style.borderColor = `rgba(250, 92, 92, ${alpha})`;
      card.style.boxShadow = `0 15px 40px rgba(250, 92, 92, ${shadowAlpha})`;
    } 
    // 左スワイプ（Skip / White）
    else if (dx < -40) {
      const alpha = Math.min(0.3, (-dx - 40) / 100);
      const shadowAlpha = Math.min(0.1, (-dx - 40) / 200);
      card.style.borderColor = `rgba(255, 255, 255, ${alpha})`;
      card.style.boxShadow = `0 15px 40px rgba(255, 255, 255, ${shadowAlpha})`;
    } else {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    }
  }

  function onPointerUp(e) {
    if (!dragStart) return;

    try {
      card.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    card.removeEventListener('pointermove', onPointerMove);
    card.removeEventListener('pointerup', onPointerUp);
    card.removeEventListener('pointercancel', onPointerCancel);

    card.classList.remove('dragging');

    const dx = currentTransform.x;
    if (dx > SWIPE_THRESHOLD) {
      onSwipe('right');
    } else if (dx < -SWIPE_THRESHOLD) {
      onSwipe('left');
    } else {
      // 元の位置にスムーズに戻す
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

  card.addEventListener('pointerdown', onPointerDown);

  return function cleanup() {
    card.removeEventListener('pointerdown', onPointerDown);
    card.removeEventListener('pointermove', onPointerMove);
    card.removeEventListener('pointerup', onPointerUp);
    card.removeEventListener('pointercancel', onPointerCancel);
  };
}
