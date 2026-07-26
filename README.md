# Web学習ロードマップ

Web未経験者から仕事で使えるエンジニアを目指す日本語学習サイト。入門から上級まで10コース・69レッスンを収録。

## 技術スタック

- **Next.js 15** (App Router + Static Export)
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **MDX** (next-mdx-remote/rsc + gray-matter)

## セットアップ

### 前提条件

- Node.js 20+
- pnpm 9+

### 手順

```bash
# リポジトリのクローン
git clone https://github.com/thomas0124/web_study.git
cd web_study

# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## よく使うコマンド

```bash
pnpm dev          # 開発サーバー起動（http://localhost:3000）
pnpm build        # 本番ビルド（83ページの静的HTML生成）
pnpm start        # ビルド済みアプリの起動
pnpm lint         # ESLintチェック
pnpm type-check   # TypeScript型チェック
```

## コース一覧

| # | コース | 難易度 | レッスン数 |
|---|--------|--------|----------|
| 1 | Webの仕組み | 入門 | 6 |
| 2 | HTML/CSS実践 | 入門 | 8 |
| 3 | JavaScript入門 | 入門 | 8 |
| 4 | JavaScript応用 | 中級 | 7 |
| 5 | Reactフロントエンド | 中級 | 8 |
| 6 | Node.js/バックエンド | 中級 | 7 |
| 7 | データベース基礎 | 中級 | 6 |
| 8 | Webセキュリティ | 上級 | 7 |
| 9 | インフラ・デプロイ | 上級 | 6 |
| 10 | プロとして働く | 上級 | 6 |

## コンテンツの追加

新しいレッスンは以下のパスにMDXファイルを追加します：

```
content/courses/<course-slug>/lessons/<NN>-<lesson-slug>.mdx
```

フロントマター形式：

```yaml
---
title: レッスンタイトル
description: 説明文（100文字以内）
---
```

コース情報は `content/courses/<course-slug>/meta.json` に記載します。

## ディレクトリ構成

```
├── app/                      # Next.js App Routerページ
│   ├── page.tsx              # トップ（コース一覧）
│   └── courses/[courseSlug]/
│       ├── page.tsx          # コース詳細
│       └── lessons/[lessonSlug]/page.tsx  # レッスン
├── components/               # Reactコンポーネント
│   └── mdx/                  # MDXカスタムコンポーネント
├── content/courses/          # MDXコンテンツ
├── lib/                      # ユーティリティ（content.ts, types.ts）
└── docs/plans/               # 実装プラン
```
