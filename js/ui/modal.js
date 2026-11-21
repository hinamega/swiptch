/**
 * Swiptch - Modal Open/Close Helpers (<dialog> native API)
 */

/**
 * ダイアログをモーダルとして開く
 * @param {HTMLDialogElement} dialog
 */
export function openModal(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === 'function') {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
}

/**
 * ダイアログを閉じる
 * @param {HTMLDialogElement} dialog
 */
export function closeModal(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === 'function') {
    if (dialog.open) dialog.close();
  } else {
    dialog.removeAttribute('open');
  }
}

/**
 * ダイアログが開いているかどうかを返す
 * @param {HTMLDialogElement} dialog
 * @returns {boolean}
 */
export function isModalOpen(dialog) {
  return Boolean(dialog && dialog.open);
}

/**
 * バックドロップ（<dialog> 外枠領域）クリックで閉じられるようにする
 * @param {HTMLDialogElement} dialog
 */
export function enableBackdropClose(dialog) {
  if (!dialog) return;
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeModal(dialog);
  });
}
