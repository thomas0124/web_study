# プラン: live-code-editor

**Date**: 2026-07-26
**Type**: feat
**Branch**: feat/live-code-editor
**Related issue**: N/A
**Related request**: 全69レッスンのコードブロックにリアルタイム実行エディタを自動挿入

## 目的

学習者がレッスン内のコード例を読むだけでなく、ブラウザ上で直接実行・編集して動作を確認できるようにする。JS/TS/JSX/TSX/HTML のコードブロックを自動的にインタラクティブなエディタ＋プレビューに変換する。MDX の既存コンテンツは一切変更しない。

## スコープと非ゴール

**スコープ**:
- `components/mdx/CodeBlock.tsx`（Client Component）の新規作成
- `components/mdx/index.tsx` の `pre` 実装を CodeBlock に差し替え
- 対応言語: `javascript`, `js`, `typescript`, `ts`, `jsx`, `tsx`, `html`
- 非対応言語（静的表示維持）: `sql`, `bash`, `sh`, `css`, `yaml`, `json`, `dockerfile`, `prisma`, `text` 等
- `pnpm build` による静的エクスポートとの互換性確保

**非ゴール**:
- MDX ファイルの内容変更
- CSS 単体の実行サポート（HTML なしでは意味が薄い）
- Node.js 環境のエミュレーション（バックエンドコードの実行）
- ユーザーのコード保存・共有機能

## 前提

- `@codesandbox/sandpack-react` v2.x が React 19 と互換性があること（実装前に `pnpm add` して確認）
- Sandpack はブラウザで完全動作するため静的エクスポートと互換性がある
- Next.js App Router で Client Component を使う場合は `"use client"` が必要

## 影響ファイル・システム

```
components/
└── mdx/
    ├── CodeBlock.tsx     ← 新規（Client Component）
    └── index.tsx         ← pre の実装を CodeBlock に差し替え
package.json              ← @codesandbox/sandpack-react を追加
app/globals.css           ← Sandpack の CSS を import（必要なら）
```

## 言語ごとの Sandpack 設定

| MDX 言語 | Sandpack テンプレート | エントリファイル | プレビュー |
|---------|---------------------|----------------|----------|
| `javascript` / `js` | `vanilla` | `/index.js` | コンソール |
| `typescript` / `ts` | `vanilla-ts` | `/index.ts` | コンソール |
| `jsx` | `react` | `/App.jsx` | ブラウザプレビュー |
| `tsx` | `react-ts` | `/App.tsx` | ブラウザプレビュー |
| `html` | `static` | `/index.html` | ブラウザプレビュー |

## 受け入れ基準

- [ ] `javascript`/`js` コードブロックがエディタ＋コンソール付きで表示される
- [ ] `jsx`/`tsx` コードブロックがエディタ＋ブラウザプレビュー付きで表示される
- [ ] `html` コードブロックがエディタ＋ブラウザプレビュー付きで表示される
- [ ] `sql`, `bash`, `yaml`, `json`, `dockerfile` 等は従来の静的コードブロック表示を維持する
- [ ] インラインコード（`` `code` ``）は従来どおりスタイリングのみ
- [ ] `pnpm build` が警告・エラーなしで完了する（静的エクスポート互換）
- [ ] TypeScript 型エラーがゼロ（`tsc --noEmit`）
- [ ] エディタ内でコードを編集して実行できる（Sandpack 標準 UI）
- [ ] 既存の69レッスンの MDX ファイルを一切変更していない

## 設計決定

| 決定 | 選択 | 理由 |
|------|------|------|
| エディタライブラリ | `@codesandbox/sandpack-react` | React 向けの事実標準。react.dev で採用。SSR 不要でブラウザ完結。テンプレートが豊富で言語別設定が容易。 |
| 非対応言語の処理 | 既存スタイルのコードブロックを維持 | SQL/bash等はサーバー実行が必要で安全にブラウザ実行できない。 |
| CSS 単体 | 非対応（静的表示） | HTML/JSと分離したCSS単体は学習サンプルとして意味が薄い。 |

## 実装概要

### スライス1: パッケージ追加と動作確認
1. `pnpm add @codesandbox/sandpack-react`
2. React 19 互換性を型エラー・インポートで確認

### スライス2: CodeBlock コンポーネント
3. `components/mdx/CodeBlock.tsx` を `"use client"` で作成
4. `pre` から受け取る `children`（`code` 要素）から言語とコード文字列を抽出
5. ランナブル言語なら Sandpack を返す、それ以外は既存スタイルのブロックを返す

### スライス3: MDX components への組み込み
6. `components/mdx/index.tsx` の `pre` を CodeBlock に差し替え
7. ビルド確認・型チェック・動作確認

## ベリファイプラン

- `pnpm tsc --noEmit` でゼロエラー
- `pnpm lint` でゼロエラー
- `pnpm build` で83ページ静的生成が完了すること
- JS/JSX/HTML のレッスンページで Sandpack エディタが表示されること
- SQL/bash 等のレッスンページで静的コードブロックが維持されること

## テストプラン

- **統合テスト**: `pnpm build` 成功（静的エクスポートと Sandpack の互換性）
- **回帰テスト**: 既存の静的コードブロック（SQL/bash）が崩れていないこと
- **エッジケース**: 空のコードブロック・言語なしコードブロックがクラッシュしないこと

## リスクレジスター

| リスク | 影響 | 確率 | 対策 |
|--------|------|------|------|
| Sandpack が React 19 と非互換 | 高 | 中 | `pnpm add` 後に型エラーを確認。非互換なら `@uiw/react-codemirror` + iframe サンドボックスにフォールバック |
| 静的エクスポートで Sandpack が SSR エラー | 高 | 低 | `dynamic(() => import(...), { ssr: false })` でクライアントオンリーレンダリングを強制 |
| `pre` children の型取り出し失敗 | 中 | 低 | `React.Children.toArray` + 型ガードで安全に処理 |

## ロールアウト・ロールバック

- ロールアウト: PR マージ → Vercel 自動デプロイ
- ロールバック: `components/mdx/index.tsx` の `pre` を元実装に戻すだけ

## 進捗チェックリスト

- [x] スライス1: pnpm add + React 19 互換確認
- [x] スライス2: CodeBlock コンポーネント実装
- [x] スライス3: MDX components 組み込み・ビルド確認
- [x] `pnpm tsc --noEmit` + `pnpm lint` パス
- [x] `/self-review` 完了（`docs/reports/self-review-2026-07-26-live-code-editor.md`）
- [x] `/verify` 完了（`docs/reports/verify-2026-07-26-live-code-editor.md`）
- [x] `/test` 完了（`docs/reports/test-2026-07-26-live-code-editor.md`）
- [x] `/sync-docs` 完了
- [ ] `/pr` 作成済み

## 追加修正（要件3: レンダリング問題）

- [x] `@tailwindcss/typography` インストール・登録（prose クラスによるテーブル・見出しスタイリング）
- [x] `Noto Sans JP` フォント追加（日本語文字の正確なレンダリング）
- [x] インラインコードの色を `text-pink-600` → `text-gray-800 dark:text-gray-200` に修正
