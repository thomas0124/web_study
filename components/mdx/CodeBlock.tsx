"use client";

import React from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";

type SandpackTemplate =
  | "vanilla"
  | "vanilla-ts"
  | "react"
  | "react-ts"
  | "static";

const RUNNABLE_LANGS: Record<string, SandpackTemplate> = {
  javascript: "vanilla",
  js: "vanilla",
  typescript: "vanilla-ts",
  ts: "vanilla-ts",
  jsx: "react",
  tsx: "react-ts",
  html: "static",
  css: "static",
};

const ENTRY_FILES: Record<SandpackTemplate, string> = {
  vanilla: "/index.js",
  "vanilla-ts": "/index.ts",
  react: "/App.jsx",
  "react-ts": "/App.tsx",
  static: "/index.html",
};

// Demo HTML wrapper so CSS styles have elements to apply to
function wrapCss(css: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<style>
body { font-family: sans-serif; padding: 16px; }
${css}
</style>
</head>
<body>
<h1>見出し1</h1>
<h2>見出し2</h2>
<p>段落テキスト。<strong>太字</strong>や<a href="#">リンク</a>も含みます。</p>
<button class="btn">ボタン</button>
<ul>
  <li class="item">リスト項目 1</li>
  <li class="item">リスト項目 2</li>
</ul>
<div class="box">div.box</div>
</body>
</html>`;
}

function extractLangAndCode(children: React.ReactNode): {
  lang: string;
  code: string;
} | null {
  const child = React.Children.toArray(children)[0];
  if (!React.isValidElement(child)) return null;

  const childProps = child.props as {
    className?: string;
    children?: React.ReactNode;
  };
  const className = childProps.className ?? "";
  const match = className.match(/language-(\w+)/);
  if (!match) return null;

  const lang = match[1];
  if (typeof childProps.children !== "string") return null;
  const code = childProps.children.trimEnd();

  return { lang, code };
}

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
}

export default function CodeBlock({ children }: CodeBlockProps) {
  const extracted = extractLangAndCode(children);

  if (!extracted) {
    return (
      <pre className="rounded-lg bg-gray-900 dark:bg-gray-950 p-4 overflow-x-auto text-sm my-6 text-gray-100">
        {children}
      </pre>
    );
  }

  const { lang, code } = extracted;
  const template = RUNNABLE_LANGS[lang];

  if (!template) {
    return (
      <pre className="rounded-lg bg-gray-900 dark:bg-gray-950 p-4 overflow-x-auto text-sm my-6 text-gray-100">
        {children}
      </pre>
    );
  }

  // CSS blocks: wrap in demo HTML so styles are visible
  const isCss = lang === "css";
  const fileContent = isCss ? wrapCss(code) : code;
  const entryFile = ENTRY_FILES[template];

  // vanilla/vanilla-ts: show Preview (DOM) + Console (logs) stacked
  const isVanilla = template === "vanilla" || template === "vanilla-ts";

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <SandpackProvider
        template={template}
        files={{ [entryFile]: fileContent }}
        theme="dark"
      >
        <SandpackLayout>
          <SandpackCodeEditor
            showLineNumbers
            showInlineErrors
            style={{ height: isVanilla ? 280 : 300 }}
          />
          {isVanilla ? (
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, padding: "3px 10px", background: "#151515", color: "#666", borderBottom: "1px solid #2d2d2d", flex: "none", letterSpacing: "0.05em" }}>
                DOM 出力（document.body への変更がここに表示されます）
              </div>
              <SandpackPreview
                showNavigator={false}
                style={{ height: 165, flex: "none" }}
              />
              <div style={{ fontSize: 11, padding: "3px 10px", background: "#151515", color: "#666", borderTop: "1px solid #2d2d2d", borderBottom: "1px solid #2d2d2d", flex: "none", letterSpacing: "0.05em" }}>
                コンソール出力（console.log の結果がここに表示されます）
              </div>
              <SandpackConsole
                style={{ height: 90, flex: "none" }}
              />
            </div>
          ) : (
            <SandpackPreview showNavigator={false} style={{ height: 300 }} />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
