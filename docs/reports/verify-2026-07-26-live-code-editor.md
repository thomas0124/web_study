# 検証レポート — live-code-editor

**Date**: 2026-07-26
**Plan**: docs/plans/active/2026-07-26-live-code-editor.md
**Branch**: feat/live-code-editor
**Evidence log**: docs/evidence/verify-2026-07-26-live-code-editor.log

## 総合判定

**pass**

すべての受け入れ基準が満たされている。静的解析（`tsc --noEmit`・`pnpm lint`・`pnpm build`）はすべてゼロエラーで成功。83ページの静的生成も完了。ブロッカーなし。

## スペック適合性

| # | 受け入れ基準 | ステータス | エビデンス |
|---|-------------|-----------|-----------|
| 1 | `javascript`/`js` → Sandpack エディタ + コンソール | ✓ 満たされている | `components/mdx/CodeBlock.tsx:19-27` の `RUNNABLE_LANGS` に `javascript: "vanilla"`, `js: "vanilla"`。`showConsole = template === "vanilla" \|\| template === "vanilla-ts"`（L87）→ `SandpackConsole` を描画（L98-99）。 |
| 2 | `jsx`/`tsx` → Sandpack エディタ + ブラウザプレビュー | ✓ 満たされている | `RUNNABLE_LANGS` に `jsx: "react"`, `tsx: "react-ts"`。react テンプレートは `showConsole` が false → `SandpackPreview showNavigator={false}` を描画（L100-101）。 |
| 3 | `html` → Sandpack エディタ + ブラウザプレビュー | ✓ 満たされている | `RUNNABLE_LANGS` に `html: "static"`。`static` は `showConsole` が false → `SandpackPreview` を描画。 |
| 4 | `sql`, `bash`, `yaml`, `json`, `dockerfile` 等 → 静的コードブロック | ✓ 満たされている | `RUNNABLE_LANGS` にこれらの言語は含まれず、`template` が `undefined` になるため `CodeBlock.tsx:78-84` の静的 `<pre>` フォールバックを描画。 |
| 5 | インラインコード → スタイリングのみ | ✓ 満たされている | `components/mdx/index.tsx:8-25` の `code` マッパー：`className?.startsWith("language-")` が false（インライン）の場合、`bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200` の span 相当スタイルのみ適用。Sandpack へ渡さない。 |
| 6 | `pnpm build` がエラーなしで完了（静的エクスポート互換） | ✓ 満たされている | `Compiled successfully in 893ms` → `Generating static pages (83/83)` → EXIT=0。警告なし。 |
| 7 | TypeScript ゼロエラー | ✓ 満たされている | `node_modules/.bin/tsc --noEmit` → EXIT=0、無出力。 |
| 8 | `content/` の MDX ファイルを一切変更していない | ✓ 満たされている | `git log --diff-filter=M --name-only main..HEAD -- content/` → 空。全 `content/` 配下は基底コミット `6ddd014` で追加されたのみ。Sandpack 関連コミット（`0358861`, `7c2ee13`, `9098105`）は `content/` に一切触れていない。 |
| 9 | `@tailwindcss/typography` 登録・prose 有効 | ✓ 満たされている | `tailwind.config.ts:2` で `import typography from "@tailwindcss/typography"`、L27 で `plugins: [typography]`、L16-24 で DEFAULT typography 設定（`maxWidth: "none"` と code の疑似要素除去）を上書き。ビルド成功が実効性を確認。 |
| 10 | インラインコード色をピンク → グレーに変更 | ✓ 満たされている | `grep "text-pink" components/mdx/index.tsx` → 該当なし。実際の className は `text-gray-800 dark:text-gray-200`（L20）。 |

## 追加の静的チェック（プラン指定）

| チェック | 結果 |
|---------|------|
| `components/mdx/CodeBlock.tsx` 存在 + `"use client"` | ✓ 1 行目に `"use client";` |
| `tailwind.config.ts` に `@tailwindcss/typography` 登録 | ✓ import + plugins 配列に含む |
| `app/layout.tsx` の `Noto_Sans_JP` を `preload: false` | ✓ L12 `preload: false` |
| `components/mdx/index.tsx` の `pre → CodeBlock` マッピング | ✓ L7 `pre: CodeBlock` |
| `content/**/*.mdx` の変更なし | ✓ `git log --diff-filter=M ... -- content/` 空 |
| インラインコード className に `text-pink` を含まない | ✓ grep 該当なし |

## ドキュメントドリフト

- [x] プランの進捗チェックリストは実装済み項目にチェック済み（スライス 1-3・tsc/lint・追加修正）
- [x] `README.md` は既存の学習プラットフォーム全体の説明のみで、Sandpack 挙動と矛盾する記述は見当たらない（変更不要）
- [x] `.claude/rules/` に MDX/CodeBlock に関する主張はないためドリフトなし
- [ ] Sandpack の使い方や動作条件（ネット必須・iframe 実行）を README/学習者向けに 1 行加える価値はあるが、受け入れ基準外なのでブロッカーではない（`/sync-docs` で判断）

## 静的解析（生の出力サマリー）

```
$ node_modules/.bin/tsc --noEmit
EXIT=0（無出力）

$ pnpm lint
✔ No ESLint warnings or errors
EXIT=0

$ pnpm build
✓ Compiled successfully in 893ms
✓ Generating static pages (83/83)
EXIT=0
```

（完全な出力は `docs/evidence/verify-2026-07-26-live-code-editor.log`）

## ドライバスクリプトに関する注記

- `./scripts/run-static-verify.sh` を実行したが、"ドキュメントのみの変更のようです" と誤判定された。理由: `run-verify.sh` は `git diff`（作業ツリー・インデックス）のみを対象とするため、既にコミット済みのブランチ全体（`main..HEAD`）の変更を検出しない。将来的に `main..HEAD` 差分も見るよう `run-verify.sh` を拡張すると、この種のブランチ検証で自動判定が正確になる。
- `./scripts/verify-typescript.sh` は `((PASS++))` が `set -e` 下で戻り値 1 を返すシェル算術の癖により、内部チェックがパスしても exit 1 となる。個別コマンド（`tsc`, `pnpm lint`, `pnpm build`）を直接実行して検証は完了。修正は `((++PASS))` またはカウント方法変更で解消可能（受け入れ基準外なのでブロッカーではない）。

## 残っているギャップ（未検証 vs おそらく正しい）

**静的解析で検証済み**:
- 型・lint・ビルド成功
- CodeBlock のルーティングロジック（言語 → テンプレート → コンソール/プレビュー分岐）
- ファイル・シンボル存在確認
- content/ 非変更

**おそらく正しいが振る舞いテスト対象（/test で扱う）**:
- 実際にブラウザで JS/JSX/HTML のレッスンページを開いて Sandpack が表示・実行できること
- SQL/bash 等のレッスンページで静的コードブロックが崩れずに表示されること
- prose クラス経由でテーブル・見出しが正しくスタイリングされること
- 日本語文字が Noto Sans JP でレンダリングされること
- 静的エクスポート後の `.next/server` に Sandpack が SSR エラーを吐いていないこと（現状ビルド成功が代替エビデンス）

**未検証**:
- Sandpack が実行時に取得するテンプレート依存関係（vanilla/react テンプレートの CDN 到達性）— これは Sandpack のランタイム挙動でブラウザ環境依存

## 最小限の信頼性向上チェック提案

1. **content/ 差分ガード（1 コマンド）**: `git log --diff-filter=M --name-only main..HEAD -- content/` が空であることを CI で確認するステップを追加。受け入れ基準 8 を機械的に保証する。
2. **verify-typescript.sh の PASS/FAIL カウンタ修正**: `((PASS++))` → `PASS=$((PASS+1))` または `((++PASS))`。将来 `run-static-verify.sh` 経由での実行が黙って exit 1 を返すのを防ぐ。
3. **run-verify.sh の対象拡張**: `git diff main...HEAD --name-only` もフォールバックとして見るよう `docs_only` 判定を拡張。ブランチ全体の変更をコミット済みでも正しく検出できる。

## 結論

**総合判定**: **pass**

10 個の受け入れ基準すべてがエビデンス付きで満たされている。静的解析（tsc・lint・build）はゼロエラー。83 ページの静的生成成功。`content/` の MDX は git ログ上一切変更されていない。ブロッカーなし。

次のステップ: `/test`（振る舞いテスト）を実行する。
