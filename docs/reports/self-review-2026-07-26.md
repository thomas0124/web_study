# 自己レビューレポート

**Date**: 2026-07-26
**Plan**: `docs/plans/active/2026-07-26-web-study-platform.md`
**Diff**: `feat/web-study-platform` (a1f217a…8bf16f3, ブランチ全体 = 初回コミット 2 本)

## サマリー

Next.js 15 + MDX + Tailwind による Web 学習プラットフォームの初期実装。TypeScript コードは全体的に読みやすく、React/Next の型付けも適切で、シークレットや残置デバッグコードもない。ただし **未配線の依存/コンポーネント** が複数あり、リッチ版 `mdxComponents` がレッスンページで使われていない・Shiki が導入だけされて未使用・Geist フォント変数が未定義など、diff としては「宣言と実態のずれ」が散見される。ブロッカーは 1 件（`components/mdx/index.tsx` のリッチ MDX コンポーネントを配線し忘れている dead code / 機能欠落）。

## 所見

| # | 深刻度 | カテゴリ | ファイル:行 | 説明 |
|---|--------|----------|------------|------|
| 1 | HIGH | 保守性 / 不要な変更 | `app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx:28` と `components/mdx/index.tsx:4` | ページ側でインラインに `const mdxComponents = { Callout };` を定義しているため、`components/mdx/index.tsx` がエクスポートする `mdxComponents`（`pre` / `code` 用スタイル込み）が完全に dead code。MDX 側の `<pre>`/`<code>` が意図した外観にならない上、リッチ版を触るリファクタリングが今後スルーされるリスクが高い。 |
| 2 | HIGH | 保守性 / 不要な変更 | `package.json:20` | `shiki` を依存に追加しているが `grep -rn "shiki\|createHighlighter"` はゼロヒット。プランにも明記された「Shiki によるシンタックスハイライト」が未配線で、依存ツリーだけが太っている。使わないなら削除、使うなら `next.config.ts` の `rehypePlugins` に組み込む必要がある。 |
| 3 | MEDIUM | 保守性 / 命名 | `app/courses/[courseSlug]/page.tsx:24-28` と `components/CourseCard.tsx:4-8` | `levelColors` オブジェクトが 2 ファイルで完全複製されている。難易度の色を 1 か所変えたい時に片方だけ更新される事故が起きやすい。`lib/theme.ts` などに 1 度だけ定義するのが望ましい。 |
| 4 | MEDIUM | 保守性 | `app/globals.css:20` と `tailwind.config.ts:11-14` | `body` の `font-family: Arial, Helvetica, sans-serif;` が `tailwind` の `font-sans` (`var(--font-geist-sans)`) と衝突。加えて `--font-geist-sans` / `--font-geist-mono` は `next/font` などで定義されておらず、Tailwind の設定は現状 dead reference（フォールバックの `sans-serif` にしかならない）。実質「グローバル Arial 一択」で、Tailwind 側のフォント設定が無効化されている。 |
| 5 | MEDIUM | セキュリティ / 命名 | `components/Header.tsx:20-27` | `href="https://github.com"` は placeholder。プロジェクトの実リポジトリを指していないため、ユーザーが GitHub トップに飛ぶだけで信頼を損なう。少なくとも `#` にするか、実リポジトリの URL に置き換えるか、プロダクション前にプレースホルダを消す TODO を明示すべき。 |
| 6 | LOW | null 安全性 / 例外処理 | `lib/content.ts:16-20` | `readCourseMeta` は `JSON.parse(...)` の結果をそのまま `CourseMeta` として返しているが、`slug` 以外のフィールド（`title`/`level`/`order`/`lessonCount`）のバリデーションが皆無。`meta.json` が壊れていた場合、Runtime で「型はあるが値が undefined」の状態が伝播し、ホームページの `filter((c) => c.level === level)` などが sild にサイレント除外される。最低限 `zod` などでスキーマ検証、または必須キーの手動チェックを入れる価値がある。 |
| 7 | LOW | 保守性 | `lib/content.ts:76-103` | `getLesson` は毎回すべてのレッスンを read + `matter()` パースしてから `findIndex` している。SSG なので実害は小さいが、69 レッスン × ページ生成分の重複 I/O。`getAllLessonPaths` も同様。将来コンテンツが増えたら `getCourseDirs` / `readCourseMeta` の結果をモジュールスコープでメモ化するとよい。 |
| 8 | LOW | 保守性 | `lib/content.ts:40` および `92` | `data.slug ?? fileName.replace(/^\d+-/, "")` の結果で `findIndex((l) => l.slug === lessonSlug)` する。複数レッスンで同じ `slug` が指定されると先頭がヒットして残りが到達不能になる（ビルド時に警告なし）。重複検出（`new Set` で assert）を入れると安全。 |
| 9 | LOW | 保守性 | `package.json:16,24` | `@next/mdx` と `next-mdx-remote` を同時導入。実際の描画は `next-mdx-remote/rsc`（`app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx:4`）を使っており、`next.config.ts` の `withMDX(...)` はレッスンでは実質使われていない。`pageExtensions` に `mdx` を含めているので `.mdx` を直接ルートにできるが、現状そういう使い方はしていない。どちらかに寄せるのが望ましい。 |
| 10 | LOW | 命名 / 可読性 | `lib/content.ts:96-100` | `(({ content: _content, ...m }) => m)(allLessons[idx - 1])` の即時実行 IIFE で `content` を捨てるパターンは非慣用的。関数化するか、`allLessons` を作る段階で `LessonMeta[]` と content 分離配列に分けるほうが読みやすい。 |
| 11 | LOW | タイポ / コピペ | `next.config.ts:5-9` | `remarkPlugins: []` / `rehypePlugins: []` を明示している一方で、`next-mdx-remote/rsc` はこの設定を読まない。`@next/mdx` を使わないなら `withMDX` そのものを外していい。 |
| 12 | INFO | 保守性 | `tsconfig.json:3` | `"target": "ES2017"` は Next.js 15 / React 19 スタックには古すぎる（scaffold のデフォルトは `ES2022` 前後）。将来的な `for await ... of` / `nullish coalescing assignment` などが transpile される。実害は小さいが更新推奨。 |
| 13 | INFO | 可読性 | `components/mdx/Callout.tsx:12-17` | アイコンを絵文字文字列（ℹ️ ⚠️ 💡 📝）で持っているため、OS/ブラウザで表示差が出る。学習サイトとしてトーンを揃えたいなら `lucide-react`（既に依存に入っている）の `Info` / `AlertTriangle` / `Lightbulb` / `FileText` に統一する選択肢もある。 |
| 14 | INFO | 可読性 | `app/page.tsx:31-34` | チェックマーク絵文字 `✅` を「全 N コース」等の前に置いているが、`<span>` に aria 属性がないので読み上げでは「白いチェックマーク」と読まれる。アクセシビリティコースを含むサイトなので `aria-hidden="true"` を付けるか装飾を CSS 側に寄せると一貫する。 |

## ブロッキングな問題

### #1 リッチ版 `mdxComponents` が配線されていない（HIGH）

`components/mdx/index.tsx` は `pre`/`code` を含む `MDXComponents` を `export const mdxComponents` している一方、`app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx:28` はローカルに `const mdxComponents = { Callout };` を再定義している。結果として:

- MDX 内のコードブロックはページ側で用意した `<pre>`/`<code>` スタイル（`components/mdx/index.tsx` の 8-28 行目）を適用されず、`app/globals.css` の `.prose pre` / `.prose code:not(pre code)` のみで表示される。
- `components/mdx/index.tsx` 全体が dead code。今後誰かがここを更新しても本番に反映されない。

修正方針: `import { mdxComponents } from "@/components/mdx";` を使い、ローカル定義を削除。同時にモジュール側で `Callout` を含めておく（既に含まれている）。これは 1 行修正で済むが、放置すると Shiki 連携（#2）を入れた際にさらに沼が深くなる。

### #2 Shiki が依存されているが未使用（HIGH）

`package.json` に `"shiki": "^1.29.2"` があるが、`grep` してもコード側に一切参照がない。プランではスコープ内（設計決定表 121 行目）だが、実装が抜けている。

修正方針:
- 使う場合: `rehype-shiki` などを `next.config.ts` の `rehypePlugins`（もしくは `next-mdx-remote` の `mdxOptions.rehypePlugins`）に登録し、`app/globals.css` にテーマ CSS を追加。
- 使わない場合: `package.json` から `shiki` を削除して `pnpm-lock.yaml` を更新。

どちらの方針を取るにせよ、`/verify` 前に判断を確定させたほうがよい。

## フォローアップ提案

- #3 `levelColors` を `lib/ui.ts` などに集約（3-5 分）。
- #4 `globals.css` の `body { font-family: Arial ... }` を削除し、`layout.tsx` に `next/font/google` から Geist を導入するか、`tailwind.config.ts` からフォント設定を消して単純化する。
- #5 `Header.tsx` の GitHub リンクを実リポジトリ URL に差し替え。
- #6 `readCourseMeta` に最低限の型ガード（`typeof raw.title === "string"` など）を追加。
- #7 `content.ts` の fs 読み込みをモジュールスコープでメモ化するヘルパーを追加。
- #8 `getAllLessonPaths` 内で slug の重複検出を追加。
- #9-11 MDX パイプラインを `next-mdx-remote/rsc` に一本化するか `@next/mdx` に寄せるか、コミット単位で決定を残す。
- #12 `tsconfig.json` の `target` を `ES2022` に更新。
- #13 / #14 絵文字利用箇所のアクセシビリティ属性・アイコン統一を検討。

## 技術的負債エントリ

以下を `docs/tech-debt/` へ追記推奨:

- **MDX パイプラインの二重化**: `@next/mdx` と `next-mdx-remote/rsc` が並存。どちらを主にするかを決めて片方を削除する。
- **Shiki 未配線**: 依存はあるが使われていない。実装するか依存から外す。
- **Geist フォント未定義**: Tailwind 設定と `globals.css` の Arial 直指定が衝突。`next/font` で正式に導入するか、両方削除する。

## 確認済み項目

- [x] 不要な変更（HIGH: dead な `components/mdx/index.tsx` と `shiki` 依存）
- [x] 命名の一貫性（`levelColors` の複製あり）
- [x] 可読性（IIFE destructure に非慣用箇所あり）
- [x] タイポ・コピペミス（`levelColors` コピペ）
- [x] null 安全性（`readCourseMeta` の JSON 型ガード欠落）
- [x] デバッグコード（`console.log`/`debugger`/TODO なし — clean）
- [x] シークレット・認証情報（`grep` で該当なし — clean）
- [x] 例外処理（`fs.readFileSync` の失敗は Next のビルドエラーで表面化するのでプランに整合、ただし meta 検証は要補強）
- [x] セキュリティ（`MDXRemote source` は Git 管理のコンテンツで信頼可能、`dangerouslySetInnerHTML` なし、Header の外部リンクは `rel="noopener noreferrer"` 付き）
- [x] 保守性（HIGH #1, #2、MEDIUM #3, #4 が該当）

## 判定

**修正後マージ**

理由:
- コード品質・命名・型安全性・シークレット面では大きな問題はない。
- ただし HIGH 2 件（#1 `mdxComponents` 未配線 = dead code + 機能欠落、#2 `shiki` 未使用依存）は「diff の宣言と実装のずれ」であり、いずれも 5-10 分で修正可能。放置すると `/verify` フェーズで「Shiki が動いていない・シンタックスハイライトされない」として二重に検出される可能性が高い。
- MEDIUM 以下はブロッカーではないが、`levelColors` 複製とフォント設定衝突は同 PR 内で潰しておくと後戻りが少ない。
