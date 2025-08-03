# Miraito PWA App

Next.js 15 (App Router) + Chakra UI v3 で構築された PWA アプリケーション

## 特徴

- 🚀 **Next.js 15** App Router を使用
- 🎨 **Chakra UI v3** によるモダンな UI デザイン
- 📱 **PWA 対応** (Service Worker + Web App Manifest)
- 🏠 **オフライン対応**
- 📲 **アプリインストール** 機能
- 🌓 **ダーク/ライトモード** 切り替え
- 🔄 **シェア機能** (Web Share API)
- 📚 **TypeScript** 完全対応
- ☁️ **Vercel** デプロイ対応

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **UI ライブラリ**: Chakra UI v3
- **PWA**: next-pwa + Workbox
- **アイコン**: React Icons (Feather)
- **デプロイ**: Vercel

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

## PWA 機能

### アイコン生成

カスタムアイコンを再生成したい場合：

```bash
node scripts/generate-icons-canvas.mjs
```

### Service Worker

Service Worker は本番環境でのみ有効になります。開発環境では無効化されています。

## デプロイ

### Vercel

1. GitHub にプッシュ
2. Vercel にインポート
3. 自動デプロイ

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

## アイコンについて

- ベースアイコン: 512×512 の miraito の"m"モチーフ
- 自動生成: 各サイズ (72, 96, 128, 144, 152, 192, 384, 512)
- Canvas API による生成

## ライセンス

MIT
