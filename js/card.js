/**
 * Swiptch - Game Card DOM Builder
 *
 * 1枚のゲームカード（表＋展開パネル）の DOM を生成する。
 */

import { state } from './state.js';
import { TRANSLATIONS, translateTag, formatDate, escapeHtml } from './i18n.js';

const PLATFORM_TAGS = ['windows', 'mac', 'linux', 'android', 'web', 'other'];

function buildTranslateButtonHtml(dict, { panel }) {
  const style = panel
    ? 'padding: 6px 12px; font-size: 13px; font-weight: 600; border-radius: 6px; display: flex; align-items: center; gap: 6px;'
    : 'padding: 4px 10px; font-size: 11px; font-weight: 600; border-radius: 6px; display: flex; align-items: center; gap: 4px;';
  const containerStyle = panel
    ? 'margin-bottom: 12px; display: flex; justify-content: flex-end;'
    : 'display: flex; justify-content: flex-end;';

  return `
      <div class="translate-container" style="${containerStyle}">
        <button class="btn-translate secondary-button" style="${style}" data-translated="false">
          <span>${dict.translateToJa}</span>
        </button>
      </div>`;
}

/**
 * ゲームカードの DOM 要素を生成する
 * @param {Object} game - API から取得したゲームオブジェクト
 * @param {boolean} isTopCard - 最前面（操作可能）カードかどうか
 * @param {number} index - キュー内インデックス
 * @returns {HTMLElement}
 */
export function createCardDOM(game, isTopCard, index) {
  const card = document.createElement('div');
  card.className = `card game-card ${isTopCard ? 'top-card' : 'next-card'}`;
  card.dataset.index = index;
  card.dataset.id = game.id;

  if (!isTopCard) {
    card.style.transform = 'scale(0.95) translateY(12px)';
    card.style.opacity = '0.7';
    card.style.pointerEvents = 'none';
  }

  const lang = state.language;
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.ja;

  const tagsHtml = game.tags && game.tags.length > 0
    ? game.tags.map(t => `<span class="tag">${translateTag(t, lang)}</span>`).join('')
    : `<span class="tag">${translateTag('Indie', lang)}</span>`;

  const priceDisplay = game.price === 'Free' ? dict.priceFree : escapeHtml(game.price);

  const translateBtnHtml = lang === 'en' ? '' : buildTranslateButtonHtml(dict, { panel: false });
  const panelTranslateBtnHtml = lang === 'en' ? '' : buildTranslateButtonHtml(dict, { panel: true });

  const platformText = game.tags
    .filter(t => PLATFORM_TAGS.includes(t.toLowerCase()))
    .map(t => translateTag(t, lang))
    .join(', ') || dict.platformWeb + ' / ' + dict.platformOther;

  card.innerHTML = `
    <!-- Top Media -->
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

    <!-- Expanding Details Panel -->
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
            <span class="meta-value">${platformText}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">${dict.publishedLabel}</span>
            <span class="meta-value">${formatDate(game.published, lang)}</span>
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
