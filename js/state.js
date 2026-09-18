/**
 * Swiptch - Centralized Application State
 *
 * アプリ全体で共有する単一のステート。
 * 各機能モジュールはここを import して読み書きする。
 */

export const state = {
  gamesQueue: [],
  currentQueueIndex: 0,
  likedList: [],
  skippedList: [],
  currentTag: 'newest',
  isFetching: false,
  language: 'ja',
};
