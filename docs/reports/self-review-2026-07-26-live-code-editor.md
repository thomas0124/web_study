# 自己レビューレポート

**Date**: 2026-07-26
**Plan**: docs/plans/active/2026-07-26-live-code-editor.md
**Diff**: `feat/live-code-editor` vs `main` (対象 6 ファイル: `components/mdx/CodeBlock.tsx`, `components/mdx/index.tsx`, `tailwind.config.ts`, `app/layout.tsx`, `app/globals.css`, `package.json` / `pnpm-lock.yaml`)

## 判定

**NEEDS_WORK** — CRITICAL 所見は無いが、HIGH が 1 件（Noto Sans JP に日本語サブセット未指定）と、MEDIUM が 1 件（非文字列 `children` を無音で空文字列に落とす）ある。マージ前の修正を推奨する。

## サマリー

Sandpack の統合自体は綺麗にまとまっており、ランナブル言語のホワイトリスト、Server/Client 境界、フォールバック分岐、セキュリティ面（Sandpack の iframe サンドボックス、ユーザー入力ではない）は妥当。ただし、日本語レンダリング目的で追加した Noto Sans JP のサブセット指定に不備があり意図が達成されていない点と、コード抽出時のフォールバックが空文字列を無音で返す挙動には修正の価値がある。加えて、テーマのハードコード・命名・軽微な dead code などフォローアップ提案がいくつかある。

## 所見

| # | 深刻度 | カテゴリ | ファイル:行 | 説明 |
|---|--------|----------|------------|------|
| 1 | HIGH | 保守性 / 意図不整合 | app/layout.tsx:8 | `Noto_Sans_JP` の `subsets` が `["latin"]` のみ。サイトは `lang="ja"` で日本語コンテンツ主体、プラン追加要件も「日本語文字の正確なレンダリング」。`latin` サブセットには日本語グリフが含まれないため、日本語文字はシステムフォントにフォールバックし、Noto Sans JP を追加した目的が実質達成されない。 |
| 2 | MEDIUM | 例外処理 / 防御的チェック | components/mdx/CodeBlock.tsx:53-56 | `childProps.children` が `string` でない場合、無音で `""` を返し Sandpack を空エディタで表示してしまう。MDX パイプラインの構成次第では `code` の children が配列や要素になり得る。少なくとも `React.Children.toArray` + 文字列連結、または非文字列時にフォールバック `<pre>` に落とすほうが安全。今の実装だとレッスンによっては空エディタが混入する可能性を無音で受け入れることになる。 |
| 3 | LOW | 保守性 / 一貫性 | components/mdx/CodeBlock.tsx:96 | Sandpack の `theme="dark"` がハードコード。アプリ全体は `prefers-color-scheme` で light/dark 対応（`globals.css`, `bg-white dark:bg-gray-950`）しているのに、Sandpack だけ常にダーク。light モードでのコントラスト・可読性が劣化する。`theme="auto"` もしくは prefers-color-scheme に追従する仕組みを検討。 |
| 4 | LOW | 保守性 / マジックナンバー | components/mdx/CodeBlock.tsx:99, 101, 103 | `style={{ height: 300 }}` が 3 箇所に散在。`const EDITOR_HEIGHT = 300` のように名前付き定数へ抽出しておくとレイアウト調整が一箇所で済む。 |
| 5 | LOW | 命名 / 型の重複 | components/mdx/CodeBlock.tsx:12-17 | ローカル `SandpackTemplate` を独自に union として再宣言している。`@codesandbox/sandpack-react` は公式にテンプレート型を export しているため、上流の型を import すればアップデート時にドリフトしない。 |
| 6 | LOW | 保守性 / dead code | components/mdx/CodeBlock.tsx:63 | `CodeBlockProps` に `className?: string` があるが、コンポーネント内で参照していない。MDX の `pre` から来る `className` を意図的に無視するなら型からも外すのが明快。 |
| 7 | LOW | 可読性 / DRY | components/mdx/CodeBlock.tsx:70-74, 81-85 | フォールバック用の `<pre className="rounded-lg ...">` が 2 箇所に完全重複。ローカルヘルパー（例: `renderStatic(children)`）に切り出すと今後スタイル変更時に片方だけ更新されるリスクが減る。 |
| 8 | INFO | 命名 / grep しやすさ | components/mdx/CodeBlock.tsx:19 | `RUNNABLE_LANGS` は「言語 → テンプレート」マッピングなので `LANG_TO_TEMPLATE` のほうが意味が正確（ホワイトリストの意図はあるが、値がテンプレート名なので命名として弱い）。任意対応。 |
| 9 | INFO | 不要な変更 / 差分ノイズ | package.json 全域 | dependencies / devDependencies が丸ごとアルファベット順にソートされ、意味変更（sandpack と typography の追加）と混在。次回以降のレビュー効率のためには「順序変更」と「機能追加」を別コミット・別 PR にしておく方が読みやすい。今回はマージブロッカーではない。 |
| 10 | INFO | 保守性 / 冗長分岐 | components/mdx/index.tsx:8-25 | `pre: CodeBlock` に置き換えたことで、`code` 側の block 分岐 (`isBlock === true`) は基本的にトップレベルの `<pre><code>` チェーンには到達しない（CodeBlock のフォールバック内でだけ通る可能性がある）。意図の記録として短いコメントを添えるか、シンプルにインライン専用の実装にする余地あり。 |
| 11 | INFO | 保守性 | components/mdx/CodeBlock.tsx（全体） | Sandpack のバンドラ読み込み失敗など runtime エラー時のエラーバウンダリが無い。学習用サイトなので致命ではないが、React `ErrorBoundary` で個別コードブロックの失敗がページ全体を落とさないようにできる。 |
| 12 | INFO | ファイル末尾 | app/globals.css:22 | 末尾に空行が 1 つ残っている。害はないがフォーマット的にトリム推奨。 |

## ブロッキングな問題

### HIGH-1: Noto Sans JP のサブセット指定が `latin` のみ

- **場所**: `app/layout.tsx:7-12`
- **現状**:
  ```ts
  const notoSansJP = Noto_Sans_JP({
    subsets: ["latin"],
    ...
  });
  ```
- **エビデンス**: サイトの `lang="ja"`、MDX コンテンツはすべて日本語（`content/courses/**/*.mdx`）。プラン `docs/plans/active/2026-07-26-live-code-editor.md` の「追加修正（要件3）」に「`Noto Sans JP` フォント追加（日本語文字の正確なレンダリング）」と明記。
- **影響**: `latin` サブセットは日本語グリフを含まないため、実際の日本語テキストは Noto Sans JP ではなく `sans-serif` フォールバック（OS システムフォント）で描画される。プラン要件が満たされない状態でユーザーには「フォント追加した」ように見えるが実効性が無い。
- **推奨対応**: Google Fonts の Noto Sans JP は動的（可変）サブセットとして扱われるため、`next/font/google` では `subsets: []` にして preload と使用ページで自動的に取り込む、もしくは公式ドキュメント準拠で最低限 `japanese` を含めた設定にする。パフォーマンス（フォントファイルサイズ）とのトレードオフを踏まえて選択する。

## フォローアップ提案

### MEDIUM-2: 非文字列 children の無音空文字化

- `extractLangAndCode` で `typeof childProps.children === "string"` ではない場合に `code = ""` を返しているため、Sandpack が空のエディタで表示される。以下のいずれかを推奨:
  - 文字列でない場合は `null` を返し、呼び出し側でフォールバック `<pre>` に落とす（安全側）。
  - `React.Children.toArray(childProps.children)` を走査して文字列ノードを連結する。
- 現時点で 69 レッスンすべての `<pre><code>` が単一文字列で成立していることを `/verify` または実ブラウザで確認できているならリスクは限定的だが、コード規約として無音でデータを落とすのは避けるのが望ましい。

### LOW/INFO まとめ

- Sandpack テーマの `dark` ハードコード（#3）は UX に直接影響するのでいずれ対応推奨。
- マジックナンバー（#4）、型重複（#5）、未使用 prop（#6）、フォールバック重複（#7）は次のリファクタでまとめて解消可能。
- package.json のソート混在（#9）は今回はマージ許容だが、今後は分けるとレビュー効率が上がる旨をチーム内で共有。

## 確認済み項目

- [x] 不要な変更 — package.json のアルファベットソートを INFO として指摘。それ以外の diff はすべてスコープ内。
- [x] 命名の一貫性 — `RUNNABLE_LANGS` の命名弱さ（INFO-8）以外は妥当。
- [x] 可読性 — フォールバック `<pre>` 重複（LOW-7）以外は妥当。ネストも浅く関数長も適切。
- [x] タイポ・コピペミス — 検出なし。
- [x] null 安全性 — `extractLangAndCode` は `React.Children.toArray(children)[0]` が `undefined` でも `React.isValidElement` で弾ける。ただし非文字列 `children` の扱い（MEDIUM-2）は防御的とは言えない。
- [x] デバッグコード — `console.log` / TODO / コメントアウトコードは検出なし。
- [x] シークレット・認証情報 — 検出なし。
- [x] 例外処理 — Sandpack ランタイムエラーに対するエラーバウンダリ無し（INFO-11）。ホスト側で握りつぶすようなロジックは無い。
- [x] セキュリティ — Sandpack は iframe サンドボックスで実行、コードは著者コンテンツで外部入力ではない。XSS/インジェクションリスクは有意にない。
- [x] 保守性 — テーマハードコード（LOW-3）、マジックナンバー（LOW-4）、型重複（LOW-5）、フォールバック重複（LOW-7）を指摘。

## 判定

**修正後マージ**

理由:
- CRITICAL は無く、Sandpack 統合のコア設計は健全（サーバー/クライアント境界・言語ホワイトリスト・フォールバックの三段構え）。
- HIGH-1（Noto Sans JP のサブセット未指定）はプランに明記された要件が実質未達成であり、マージ前に修正するのが健全。
- MEDIUM-2（非文字列 children の無音空文字化）は現行の 69 レッスンでは顕在化しない可能性が高いが、無音のデータ欠落を許容するコード規約からは外れる。少なくとも空文字列を返す代わりに `null` を返してフォールバックに落とす修正を推奨。
- その他 LOW/INFO はフォローアップ PR に回してよい。
