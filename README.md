# Swiptch (スイプチ)

itch.io のインディーゲームをカードスワイプで次々めくって探せる、非公式のファンツール（PWA）です。

- 本番サイト: https://swiptch.hinamega.com/

## 主な機能

- **スワイプでゲームをディグる**
  - 右スワイプ（または `→` キー）でお気に入り、左スワイプ（または `←` キー）でスキップします。
  - カードタップや `i` / `↑` キーで説明文や対応プラットフォーム、公開日などの詳細を開けます。
- **タグ絞り込み＆簡易翻訳**
  - Featured / New & Popular / Newest / Top Sellers やジャンル別タグでフィードを切り替えられます。
  - 英語の説明文をカード上から日本語へ簡易翻訳できます（日本語UI時）。
- **お気に入り管理**
  - お気に入りしたゲームは `localStorage` に保存され、一覧から個別アクセス・一括オープン・X でのシェアができます。
- **PWA 対応**
  - ホーム画面への追加や、Service Worker による静的アセットのキャッシュに対応しています。

## 技術構成

- フロントエンド: HTML / CSS / Vanilla JS（ES Modules）
- API プロキシ: Node.js（Vercel Serverless Functions / `api/discover.js`）
- ローカル開発サーバー: Node.js `http` モジュール（`server.js`）

## ディレクトリ構成

```text
swiptch/
├── api/
│   └── discover.js     # itch.io RSS を取得・整形して返す関数
├── js/
│   ├── api.js          # API 通信・翻訳リクエスト
│   ├── card.js         # ゲームカード DOM の生成
│   ├── deck.js         # キュー管理・カードスタック描画・スワイプ処理
│   ├── dom.js          # DOM 要素参照
│   ├── gestures.js     # ポインターによるドラッグ＆スワイプ判定
│   ├── i18n.js         # 翻訳テキスト解決・フォーマット
│   ├── likes.js        # お気に入り保存・一覧・X シェア
│   ├── locales.js      # 日本語 / 英語の辞書データ
│   ├── state.js        # アプリ内状態
│   ├── storage.js      # localStorage ラッパー
│   ├── translate.js    # カード説明文の翻訳トグル
│   └── ui/
│       ├── modal.js    # <dialog> モーダル制御
│       └── toast.js    # トースト通知
├── index.html          # メイン画面
├── style.css           # スタイル・アニメーション
├── app.js              # 初期化・イベント配線・キーボード操作
├── sw.js               # Service Worker（静的アセットのキャッシュ制御）
├── manifest.json       # PWA マニフェスト
├── icon-192.png        # PWA / iOS 用アイコン (192x192)
├── icon-512.png        # PWA 用アイコン (512x512)
├── server.js           # ローカル開発用サーバー
└── package.json
```

## ローカルでの動かし方

Node.js（v20 以上、推奨 v24.x）が入っていればそのまま動きます。

```bash
git clone https://github.com/hinamega/swiptch.git
cd swiptch
node server.js
```

起動したら `http://localhost:3000` を開きます（`server.js` が静的配信と `/api/discover` のローカル実行を兼ねています）。

## Vercel へのデプロイ

ビルド不要の静的構成＋Serverless Functions としてそのまま動きます。

- **Framework Preset**: `Other`
- **Build Command**: Override を ON にして空欄
- **Output Directory**: 空欄

## itch.io 用 HTML5 ビルドについて

itch.io はサーバーサイドコードを実行できないため、フロント側だけを zip にまとめてアップロードし、`*.itch.zone` 上から `https://swiptch.hinamega.com/api` を叩く構成にしています（Service Worker と Vercel Analytics は itch.io 上では無効化しています）。

```bash
python -c "
import zipfile, os
out = 'dist/swiptch-itch.zip'
files = ['index.html', 'style.css', 'app.js', 'manifest.json', 'icon-192.png', 'icon-512.png']
for d, _, fs in os.walk('js'):
    for f in fs:
        if f.endswith('.js'):
            files.append(os.path.join(d, f).replace(os.sep, '/'))
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for f in sorted(files):
        z.write(f, f)
"
```

生成された `dist/swiptch-itch.zip` を itch.io の HTML プロジェクトとしてアップロードし、Embed options で「Embed in page」を選択します。
