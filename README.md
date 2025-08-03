# Miraito PWA App

Next.js 15 (App Router) + Chakra UI v3 で構築された YouTube Miraito チャンネル専用の PWA アプリケーション

---

## 特徴

- 🚀 **Next.js 15** App Router 採用
- 🎨 **Chakra UI v3** によるモダンなダーク UI
- 📱 **PWA 対応**（Service Worker + Web App Manifest）
- 🏠 **オフライン対応**（本番のみ）
- 📲 **アプリインストール**機能
- 🔄 **シェア機能**（Web Share API）
- 📚 **TypeScript** 完全対応
- ☁️ **Vercel** デプロイ対応
- 📺 **YouTube Data API v3** で Miraito チャンネルの最新動画を取得・表示
- 🔍 **動画タイトル検索**（表示中の動画のみ部分一致で絞り込み）
- 🏷️ **ショート/ライブアーカイブバッジ**表示
- ➕ **「続きを見る」ボタン**で追加動画を取得（API 制限に配慮）

---

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **UI**: Chakra UI v3
- **PWA**: next-pwa + Workbox
- **アイコン**: React Icons (Feather)
- **デプロイ**: Vercel

---

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

### 3. ビルド

```bash
npm run build
```

### 4. 本番サーバーの起動

```bash
npm start
```

---

## PWA 機能

### アイコン生成

カスタムアイコンを再生成したい場合：

```bash
node scripts/generate-icons-canvas.mjs
```

### Service Worker

Service Worker は**本番環境のみ有効**です（開発環境では無効）。

---

## YouTube 動画リスト機能

- **初回表示**：Miraito チャンネルの最新 30 件の動画を取得・表示
- **「続きを見る」ボタン**：さらに 30 件ずつ追加取得（API 制限に配慮）
- **ショート動画/ライブアーカイブ**：バッジで判別
- **動画タイトル検索**：表示中の動画のみ部分一致で絞り込み
- **API 制限**：YouTube Data API v3 の無料枠（search.list 100 回/日）を考慮した設計

---

## ディレクトリ構造

```
miraito-yt-app/
├── src/app/           # App Router ページ
│   ├── layout.tsx     # レイアウト設定
│   ├── page.tsx       # メインページ
│   └── providers.tsx  # Chakra UI プロバイダー
├── public/
│   ├── icons/         # PWA アイコン
│   └── manifest.json  # Web App Manifest
├── scripts/           # ユーティリティスクリプト
└── next.config.ts     # Next.js + PWA 設定
```

---

## アイコンについて

- ベースアイコン: 512×512 の miraito の"m"モチーフ
- 自動生成: 各サイズ (72, 96, 128, 144, 152, 192, 384, 512)
- Canvas API による生成

---

## ライセンス

MIT
