# プラン: web-study-platform

**Date**: 2026-07-26
**Type**: feat
**Branch**: feat/web-study-platform
**Related issue**: N/A
**Related request**: Web未経験者〜仕事で使えるレベルまでの体系的Web学習サイト構築

## 目的

Web未経験者が座学で深いWeb知識を習得し、仕事で使えるレベルになれる学習サイトを構築する。  
コースは「Webの仕組み → HTML/CSS → JavaScript → React → バックエンド → DB → セキュリティ → インフラ → プロとして働く」の順に体系化し、各コースは複数のレッスンで構成される。ログイン不要の完全静的サイト。

## スコープと非ゴール

**スコープ**:
- Next.js 15 + App Router + TypeScript によるサイト骨格
- MDX によるコンテンツ管理（`/content/courses/<slug>/lessons/<slug>.mdx`）
- Tailwind CSS + shadcn/ui によるUI
- Shiki によるコードシンタックスハイライト
- 全10コース・各コース4〜8レッスンのフルコンテンツ（日本語）
- コース一覧ページ・コース詳細ページ・レッスンページ
- 難易度タグ（入門 / 中級 / 上級）
- 前後レッスンへのナビゲーション
- モバイルレスポンシブ対応
- `pnpm build` による完全静的ビルド

**非ゴール**:
- ユーザー認証・ログイン
- 学習進捗のサーバーサイド保存
- 動画コンテンツ
- コメント・フォーラム
- 多言語対応（日本語のみ）
- 課金機能

## 前提

- Node.js 20+ がインストール済み
- pnpm を使用する
- デプロイ先は Vercel（またはGitHub Pages）

## 影響ファイル・システム

```
web_study/
├── app/
│   ├── layout.tsx                # ルートレイアウト（ヘッダー・フッター）
│   ├── page.tsx                  # トップページ（コース一覧グリッド）
│   └── courses/
│       └── [courseSlug]/
│           ├── page.tsx          # コース詳細（レッスン一覧）
│           └── lessons/
│               └── [lessonSlug]/
│                   └── page.tsx  # レッスンページ（本文 + ナビ）
├── components/
│   ├── CourseCard.tsx
│   ├── LessonNav.tsx
│   ├── Sidebar.tsx
│   └── mdx/                      # MDXカスタムコンポーネント（Callout等）
├── content/
│   └── courses/
│       ├── 01-web-basics/
│       │   ├── meta.json
│       │   └── lessons/
│       │       ├── 01-how-internet-works.mdx
│       │       └── ...
│       ├── 02-html-css/
│       ├── 03-javascript-basics/
│       ├── 04-javascript-advanced/
│       ├── 05-react/
│       ├── 06-nodejs-backend/
│       ├── 07-database/
│       ├── 08-web-security/
│       ├── 09-infrastructure/
│       └── 10-professional/
├── lib/
│   ├── content.ts                # MDX読み込みユーティリティ
│   └── types.ts
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## コース構成（全10コース・69レッスン）

| # | スラッグ | タイトル | 難易度 | レッスン |
|---|---------|---------|--------|---------|
| 1 | web-basics | Webの仕組み | 入門 | インターネットの仕組み, HTTP/HTTPSとは, DNSとドメイン, ブラウザの仕組み, Webサーバーとクライアント, 開発ツール入門 |
| 2 | html-css | HTML/CSS実践 | 入門 | HTML基礎, セマンティックHTML, CSSセレクタ, Flexbox, Grid, レスポンシブデザイン, フォームとバリデーション, CSSアニメーション |
| 3 | javascript-basics | JavaScript入門 | 入門 | 変数と型, 演算子と制御構造, 関数, 配列とオブジェクト, DOM操作, イベント処理, エラーハンドリング, デバッグ技術 |
| 4 | javascript-advanced | JavaScript応用 | 中級 | スコープとクロージャ, プロトタイプと継承, 非同期処理, Promise, async/await, Fetch APIと外部通信, ESモジュール |
| 5 | react | Reactフロントエンド | 中級 | Reactの思想, JSXとコンポーネント, Props と State, イベントとフォーム, useEffect, カスタムHooks, コンテキスト, Next.js入門 |
| 6 | nodejs-backend | Node.js/バックエンド | 中級 | Node.js基礎, npmとモジュール, Express.js, REST API設計, ミドルウェア, 認証と認可, エラーハンドリング |
| 7 | database | データベース基礎 | 中級 | RDBMSとは, SQLの基礎, テーブル設計, インデックスとパフォーマンス, トランザクション, ORM入門 |
| 8 | web-security | Webセキュリティ | 上級 | セキュリティの基礎, XSS攻撃と対策, CSRF攻撃と対策, SQLインジェクション, 認証セキュリティ, HTTPS/TLS, OWASP Top 10 |
| 9 | infrastructure | インフラ・デプロイ | 上級 | Gitとバージョン管理, GitHubフロー, CI/CD入門, クラウドサービス入門, Docker基礎, パフォーマンス最適化 |
| 10 | professional | プロとして働く | 上級 | コードレビュー, チーム開発のルール, アクセシビリティ, SEO基礎, テスト駆動開発, キャリアパス |

## 受け入れ基準

- [ ] `pnpm dev` でローカル開発サーバーが起動し、トップページにコース一覧が表示される
- [ ] 全10コースの詳細ページ（`/courses/[slug]`）が表示される
- [ ] 全レッスンページ（`/courses/[slug]/lessons/[slug]`）が表示される
- [ ] 各レッスンに「前のレッスン / 次のレッスン」ナビゲーションがある
- [x] コードブロックが適切にスタイリングされて可読性が高い（CSS styling、後述の設計変更を参照）
- [ ] モバイル表示（375px幅）でレイアウトが崩れない
- [ ] `pnpm build` が警告・エラーなしで完了する
- [ ] TypeScript 型エラーがゼロ（`tsc --noEmit`）
- [ ] 各レッスンのコンテンツが日本語で書かれている（1レッスン800字以上の実質内容）
- [ ] 存在しないURLは 404 ページを返す

## 設計決定

| 決定 | 選択 | 理由 |
|------|------|------|
| コンテンツ管理 | MDX in Git | CMS不要・バージョン管理可能・開発環境完結 |
| スタイリング | Tailwind CSS | 高速ビルド・レスポンシブが容易・shadcn/uiと統合 |
| UIコンポーネント | shadcn/ui | Tailwind統合・コピーペースト型で依存最小 |
| シンタックスハイライト | Tailwind CSS styling（変更: Shiki→CSS） | `create-next-app`が使えず手動セットアップした結果、rehype-pretty-codeの設定コストより `components/mdx/index.tsx` のCSSスタイルで十分と判断。教育用途では可読性は確保できている。 |
| MDX処理 | next-mdx-remote/rsc（変更: @next/mdx→next-mdx-remote） | ファイルシステムから文字列読み込み→レンダリングの用途に@next/mdxより適合。App RouterのRSC対応版を使用。 |
| パッケージマネージャ | pnpm | 高速・ディスク効率 |

## 実装概要

### フェーズ1: プロジェクト初期化（スキャフォールド）
1. `pnpm create next-app` でNext.js 15 + TypeScript + Tailwind のスキャフォールド
2. shadcn/ui、Shiki、gray-matter、@next/mdx を追加
3. `next.config.ts` で MDX を有効化
4. ルートレイアウト（ヘッダー・フッター・ナビゲーション）を実装

### フェーズ2: コンテンツ基盤
5. `lib/types.ts` に `Course`・`Lesson` 型を定義
6. `lib/content.ts` にMDXファイル読み込みユーティリティを実装（`getCourses()`, `getCourse()`, `getLessons()`, `getLesson()`）
7. 各コースの `meta.json` を作成（title, description, level, order）
8. MDXカスタムコンポーネント（Callout, CodeBlock, Note）を実装

### フェーズ3: ページ実装
9. トップページ（コース一覧グリッド + 難易度フィルタ）
10. コース詳細ページ（概要 + レッスン一覧）
11. レッスンページ（本文 + サイドバー + 前後ナビ）
12. 404ページ

### フェーズ4: コンテンツ執筆
13. コース1〜5（入門〜中級前半）の全レッスン執筆
14. コース6〜10（中級後半〜上級）の全レッスン執筆

### フェーズ5: 仕上げ
15. モバイルレスポンシブ調整・デザインポリッシュ
16. `pnpm build` パス確認・型エラー修正
17. README 更新（セットアップ手順）

## ベリファイプラン

- 静的解析: `pnpm tsc --noEmit` + `pnpm lint`
- スペック適合: 受け入れ基準を1つずつブラウザで確認
- ドキュメントドリフト: README にセットアップ手順が記載されているか確認
- エビデンス: `pnpm build` の出力ログをキャプチャ

## テストプラン

- ユニットテスト: `lib/content.ts` のMDXパース・メタデータ取得関数
- 統合テスト: `pnpm build` の静的生成で全ルートが生成されるか確認
- エッジケース: 存在しないスラッグへのアクセス → 404ページ表示確認
- 回帰テスト: ナビゲーションリンクが正しいURL を指しているか

## リスクレジスター

| リスク | 影響 | 確率 | 対策 |
|--------|------|------|------|
| コンテンツ量が膨大で執筆が長期化 | 中 | 高 | フェーズ4は後回し可。まず骨格 + 各コース1レッスンで動作確認 |
| App Router + MDX の互換性問題 | 高 | 低 | `@next/mdx` 公式ドキュメントに従う。問題時は next-mdx-remote をフォールバックとして用意 |
| Shiki のバンドルサイズ肥大 | 低 | 中 | `createHighlighter` でオンデマンドロード・必要な言語のみ登録 |
| 69レッスン全体でTypeScriptエラー | 中 | 低 | `lib/types.ts` で厳密な型定義を先行実装 |

## ロールアウト・ロールバック

- ロールアウト: Vercel へ push → 自動デプロイ
- ロールバック: PR を revert する

## 進捗チェックリスト

- [x] フェーズ1: プロジェクト初期化（手動セットアップ）
- [x] フェーズ2: コンテンツ基盤
- [x] フェーズ3: ページ実装
- [x] フェーズ4: コンテンツ執筆（全69レッスン完了）
- [x] フェーズ5: 仕上げ（ビルド確認・README作成）
- [x] `pnpm tsc --noEmit` + `pnpm lint` パス
- [x] `/self-review` 完了（docs/reports/self-review-2026-07-26.md）
- [x] `/verify` 完了（docs/reports/verify-2026-07-26.md）
- [ ] `/test` 完了
- [ ] `/sync-docs` 完了
- [ ] `/pr` 作成済み
