/**
 * Swiptch - Localization & Text Formatting Module
 */

export const TRANSLATIONS = {
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
    indie: "インディー",
    btnOpenAllLikes: "すべて別タブで開く (一括オープン)",
    popupWarning: "⚠️ 一括オープンがブロックされた場合は、ブラウザのアドレスバー等からポップアップを許可してね！"
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
    indie: "Indie",
    btnOpenAllLikes: "Open All in New Tabs",
    popupWarning: "⚠️ If bulk opening is blocked, please enable popups in your browser settings!"
  }
};

export function getTranslation(lang, key) {
  const currentLang = TRANSLATIONS[lang] ? lang : 'ja';
  return TRANSLATIONS[currentLang][key] || key;
}

export function translateTag(tag, lang = 'ja') {
  const normalized = tag.toLowerCase().trim();
  const currentLang = TRANSLATIONS[lang] ? lang : 'ja';
  return TRANSLATIONS[currentLang][normalized] || TRANSLATIONS[currentLang][tag] || tag;
}

export function formatDate(dateStr, lang = 'ja') {
  const currentLang = TRANSLATIONS[lang] ? lang : 'ja';
  const dict = TRANSLATIONS[currentLang];
  if (!dateStr) return dict.unknownDate;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return dict.datePattern
      .replace('{y}', y)
      .replace('{m}', m)
      .replace('{d}', d);
  } catch (e) {
    return dateStr;
  }
}

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function applyTranslations(lang = 'ja') {
  const currentLang = TRANSLATIONS[lang] ? lang : 'ja';
  const dict = TRANSLATIONS[currentLang];

  // Update document title
  document.title = dict.appTitle;

  // Translate static text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (el && dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Translate HTML elements
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml || el.getAttribute('data-i18n-html');
    if (el && dict[key]) {
      el.innerHTML = dict[key];
    }
  });
}
