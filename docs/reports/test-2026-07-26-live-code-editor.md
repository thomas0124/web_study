# テストレポート

**Date**: 2026-07-26
**Plan**: docs/plans/active/2026-07-26-live-code-editor.md
**Branch**: feat/live-code-editor

## テスト実行

```
$ ./scripts/run-test.sh
# Test run
- Timestamp: 2026-07-26T06:02:35Z

テストランナーが見つかりませんでした。
./scripts/test.local.sh を作成するか、packs/languages/<name>/test.sh を追加してください。

Evidence saved to: docs/evidence/test-2026-07-26-060235.log
(exit code 2)
```

自動テストランナー（`./scripts/test.local.sh` あるいは `packs/languages/*/test.sh`）は
存在しない。本プロジェクトは静的 Next.js サイトでテストスイートが未整備。
本レポートは以下で置き換える：
1. `pnpm build` による静的エクスポート統合検証
2. `components/mdx/CodeBlock.tsx` の分岐に対するホワイトボックス動作検証
3. `content/**/*.mdx` の実際のコードブロック言語インベントリ
生ログ: `docs/evidence/test-2026-07-26-live-code-editor.log`

## 結果サマリー

| カテゴリ | 件数 |
|---------|------|
| 通過    | 6    |
| 失敗    | 0    |
| スキップ | 1    |

### シナリオ別結果

| # | シナリオ | 種別 | 結果 | エビデンス |
|---|---------|------|------|----------|
| 1 | `pnpm build` が 83 ページ静的生成を完了する（Sandpack と静的エクスポートの互換性） | 統合 | pass | `pnpm build` 出力: `✓ Generating static pages (83/83)`、エラー・警告なし、コンパイル 834ms |
| 2 | SQL / bash / yaml / prisma 等の非対応言語が静的 `<pre>` にフォールバックする | 回帰 | pass | `CodeBlock.tsx:76-84` — `RUNNABLE_LANGS[lang]` が undefined の場合、既存スタイル `<pre>` を返す。実データ: `content/courses/07-database/**` 全 SQL レッスンと `06-orm.mdx` の `bash`/`prisma` はこのパスを通る |
| 3 | 空のコードブロック / 言語なしコードブロックがクラッシュしない | エッジ | pass | `CodeBlock.tsx:37-57,64-73` — `extractLangAndCode` が null を返した場合、静的 `<pre>` フォールバック。`content/courses/03-javascript-basics/lessons/08-debugging.mdx:48,76,86,88,102` に言語なし fenced block が存在し、ビルド成功済 |
| 4 | `javascript`/`js` → `vanilla` テンプレート + コンソール | 動作 | pass | `CodeBlock.tsx:20-21,29,87,98-99` — vanilla エントリ `/index.js`、`showConsole = true` |
| 5 | `jsx` → `react`、`tsx` → `react-ts`、`html` → `static` にマップされブラウザプレビューを表示 | 動作 | pass | `CodeBlock.tsx:23-26,31-34,100-101` — マップ表通り。`content/courses/05-react/lessons/**` に `jsx`/`tsx`、`03-javascript-basics/lessons/06-events.mdx:109` に `html` の実利用あり |
| 6 | `prose` CSS が実ビルド成果物に含まれている（`@tailwindcss/typography` プラグイン有効） | 動作 | pass | `.next/static/css/07c799228e06460a.css` に `.prose`, `.prose-gray`, `--tw-prose-*` トークン、`.dark .prose-invert-*` 反転トークンが emit されている |
| — | `React.Children.toArray` が非要素を返すケース（例: プレーンテキストのみの `<pre>{"..."}</pre>`） | エッジ | スキップ | 本プロジェクトの MDX パイプラインでは `pre > code` 構造が常に生成されるため実データでは発生しない。防御コードは `CodeBlock.tsx:41-42` で存在（`React.isValidElement` チェック）ものの、実行経路として trigger する MDX 入力は現時点で存在しない |

## 失敗の分析

失敗なし。

## カバレッジギャップ

- **自動テスト不在**: プロジェクト全体としてユニット/コンポーネントテスト基盤（Vitest / Testing Library 等）が存在しない。本 PR の受け入れは（1）ビルド成功と（2）ホワイトボックスな分岐検証に依存している。将来コンポーネント数が増えれば `@testing-library/react` + `vitest` の導入を検討する価値がある。
- **ブラウザ実行の未検証**: Sandpack が実際にコードを iframe 内で実行しコンソール出力が視覚的に表示されることは、静的ビルド検証だけでは確認できない。次段階（Vercel プレビューあるいはローカル `pnpm dev`）での目視確認が必要。
- **`extractLangAndCode` の null-children ケース**: `childProps.children` が `undefined`（本当に空の code 要素）の場合、`typeof undefined !== "string"` で null 化される。安全だが、この経路の実データはない（前述）。
- **リンター不在の警告**: 統合テストとして `pnpm build` は `Linting and checking validity of types ...` を実行するがブロッキング診断はゼロ。/verify フェーズで報告済み。

## 判定

**pass**

理由:
- 統合ゲート（`pnpm build` 83 ページ生成）が成功し、Sandpack と Next.js 静的エクスポートの互換性が実証されている。
- 回帰ゲート（SQL/bash 等の静的表示維持）は `CodeBlock.tsx` の `RUNNABLE_LANGS[lang]` guard で保証され、実データ全てが正しい分岐にヒットする。
- エッジケース（空/言語なしコードブロック）は 2 段階の null ガード（`extractLangAndCode` 内、および呼び出し後）で安全にフォールバックする。`content/courses/03-javascript-basics/lessons/08-debugging.mdx` に実データが存在し、ビルドは成功している。
- プランに列挙された 3 つのテストプラン項目（統合・回帰・エッジ）すべてが客観エビデンス付きで合格した。

次のステップ: pass → `/sync-docs` へ
