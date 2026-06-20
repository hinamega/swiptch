# Swiptch (スワイイッチ)

Tinder風の操作感で itch.io のインディーゲームを直感的にディグれる、レスポンシブなゲームディスカバリーWebアプリ（PWA）です。

---

## 🚀 主な機能と特徴

- **直感的なカードスワイプ UI**
  - PC（ドラッグ）およびスマートフォン（タッチスワイプ）の両方に対応。左スワイプでスキップ、右スワイプでお気に入りに登録できます。
- **リアルタイム RSS 連携**
  - itch.io公式のRSSフィードから、最新の注目作品（Featured）や特定のタグ（Horror, Roguelike, Metroidvaniaなど）のゲームを動的に取得・解析します。
- **PWA (Progressive Web App) 対応**
  - ホーム画面への追加、オフラインキャッシュ、モバイルデバイスに最適化されたフルスクリーン表示に対応しています。
- **セキュアなバックエンド設計**
  - Vercel Serverless Functions を用いたプロキシ構成。API呼び出しのサニタイズ（SSRF / Path Traversal対策）を組み込んでいます。
- **バグフリーな設計**
  - キャッシュ競合を回避するカスタム Service Worker 制御。
  - 特殊な文字コードやHTMLエンティティ（`&#039;` 等）を自動デコードして描画。
  - レスポンシブに潰れないフレックス比率に基づくカードレイアウト。

---

## 🛠️ 技術スタック

- **フロントエンド**: HTML5, Vanilla CSS, JavaScript (ES6)
- **バックエンド (API)**: Node.js (Vercel Serverless Functions)
- **オフライン / キャッシュ**: Service Worker (`sw.js`)
- **ローカル開発サーバー**: Node.js `http` モジュールによるカスタム静的＆APIモックサーバー (`server.js`)

---

## 📁 ディレクトリ構成

```text
swiptch/
├── api/
│   └── discover.js     # itch.io RSS を解析して JSON で返すサーバーレス関数
├── index.html          # メイン UI（HTML構造）
├── style.css           # カードアニメーション、ダークモード、レスポンシブデザイン
├── app.js              # スワイプ処理、APIフェッチ、お気に入り管理のコアロジック
├── sw.js               # Service Worker（外部画像のCORS対策およびキャッシュ制御）
├── manifest.json       # PWA設定
├── server.js           # ローカルデバッグ用の開発サーバー
└── package.json        # 依存関係と Node.js バージョンの定義
```

---

## 🔧 ローカルでの開発手順

### 前提条件
- Node.js (推奨バージョン: v20.x または v24.x) がインストールされていること。

### 手順
1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/hinamega/swiptch.git
   cd swiptch
   ```
2. **ローカルサーバーの起動**
   ```bash
   node server.js
   ```
3. **ブラウザでのアクセス**
   - [http://localhost:3000](http://localhost:3000) にアクセスします。
   - `server.js` は静的アセットの配信に加え、`/api/discover` へのリクエストをローカルの `api/discover.js` ハンドラへ中継（モック実行）します。

---

## 🌐 Vercel へのデプロイ設定

本プロジェクトは Vercel にデプロイして動作させることを想定しています。

1. **GitHubリポジトリの紐付け**
   - Vercelダッシュボードから該当リポジトリ（`swiptch`）をインポートします。
2. **ダッシュボード設定の調整（重要）**
   - **Framework Preset**: `Other` を選択。
   - **Build Command**: `Override` トグルを **ON** にし、**入力欄を完全に空欄** にします。
   - **Output Directory**: 空欄（デフォルトのルート配信）にします。
3. **Node.js バージョンの設定**
   - 本プロジェクトの `package.json` で指定されている Node.js バージョン（`24.x`）でサーバーレス関数が起動します。
