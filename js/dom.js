/**
 * Swiptch - DOM Element Cache
 *
 * index.html の主要素を起動時に一度だけ取得して共有する。
 * （module script は defer 相当のため、この時点で DOM は構築済み）
 */

export const DOM = {
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
