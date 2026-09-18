/**
 * Swiptch - Modal Open/Close Helpers
 */

export function openModal(modal) {
  if (!modal) return;
  modal.classList.remove('hidden');
}

export function closeModal(modal) {
  if (!modal) return;
  modal.classList.add('hidden');
}

/**
 * オーバーレイ背景クリックで閉じられるようにする
 * @param {HTMLElement} overlay
 */
export function enableBackdropClose(overlay) {
  if (!overlay) return;
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay);
  });
}
