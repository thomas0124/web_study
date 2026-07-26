# ウォークスルー: live-code-editor

**Date**: 2026-07-26
**Branch**: feat/live-code-editor
**PR**: main ← feat/live-code-editor

---

## このブランチに含まれる変更の概要

このブランチは2つのフェーズの変更を含む：

1. **Web学習プラットフォーム基盤**（前 PR #1 `feat/web-study-platform` の内容と同一 — main 未マージのため差分に含まれる）
2. **live-code-editor 機能**（このブランチ固有の変更）

---

## live-code-editor 固有の変更（レビュー対象）

### `components/mdx/CodeBlock.tsx`（新規）

Client Component。MDX の `<pre>` を置き換えるエントリポイント。

- `extractLangAndCode()` で `pre > code` の className から言語とコード文字列を抽出
- `RUNNABLE_LANGS` マップ（js/ts/jsx/tsx/html → Sandpack テンプレート）に含まれる言語は Sandpack でレンダリング
- それ以外の言語（sql/bash/yaml/json 等）は静的 `<pre>` にフォールバック
- JS/TS は `SandpackConsole`、JSX/TSX/HTML は `SandpackPreview` を使い分け
- 非文字列 children は `null` を返して安全にフォールバック

### `components/mdx/index.tsx`（変更）

- `pre: CodeBlock` に差し替え（1行変更）
- インラインコード色: `text-pink-600` → `text-gray-800 dark:text-gray-200`（可読性改善）

### `tailwind.config.ts`（変更）

- `@tailwindcss/typography` を plugins に追加（prose クラスによるテーブル・見出しスタイリング有効化）
- fontFamily を `Noto Sans JP` に変更（CSS変数経由）
- `code::before/after` content を空文字に設定（バッククォート自動付加の無効化）

### `app/layout.tsx`（変更）

- `Noto_Sans_JP` を `next/font/google` で読み込み（`preload: false` — CJK フォントの推奨設定）
- `html` 要素に font variable クラスを追加

### `app/globals.css`（変更）

- 手書きの prose スタイル（見出し・段落・リスト等）を削除（typography プラグインが管理）
- `body` からフォント指定を削除（Tailwind `font-sans` 経由に統一）

### `package.json`（変更）

- `@codesandbox/sandpack-react@2.20.0` 追加（React 19 対応済み）
- `@tailwindcss/typography@0.5.20` 追加（devDependency）
- `shiki` 削除（未使用だったもの）

---

## 修正された既知の問題

| 問題 | 修正 |
|------|------|
| `prose` クラスが機能しない（テーブル崩れ） | typography プラグイン登録 |
| インラインコードがピンク文字で見づらい | グレー系カラーに変更 |
| 日本語フォントが未指定 | Noto Sans JP 追加 |
| Sandpack 空エディタ（非文字列 children） | `null` 返却でフォールバック |
| Noto Sans JP の latin-only サブセット | `preload: false` に変更 |

---

## テスト結果サマリー

- `pnpm type-check` → 0 errors
- `pnpm lint` → 0 warnings/errors
- `pnpm build` → 83 pages / 0 errors
- self-review: NEEDS_WORK → 修正後 PASS
- verify: pass
- test: pass
