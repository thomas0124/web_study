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
};

const ENTRY_FILES: Record<SandpackTemplate, string> = {
  vanilla: "/index.js",
  "vanilla-ts": "/index.ts",
  react: "/App.jsx",
  "react-ts": "/App.tsx",
  static: "/index.html",
};

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
  const code =
    typeof childProps.children === "string"
      ? childProps.children.trimEnd()
      : "";

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
      <pre className="rounded-lg bg-gray-900 dark:bg-gray-950 p-4 overflow-x-auto text-sm my-6">
        {children}
      </pre>
    );
  }

  const { lang, code } = extracted;
  const template = RUNNABLE_LANGS[lang];

  if (!template) {
    return (
      <pre className="rounded-lg bg-gray-900 dark:bg-gray-950 p-4 overflow-x-auto text-sm my-6">
        {children}
      </pre>
    );
  }

  const entryFile = ENTRY_FILES[template];
  const showConsole = template === "vanilla" || template === "vanilla-ts";

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <SandpackProvider
        template={template}
        files={{ [entryFile]: code }}
        theme="dark"
      >
        <SandpackLayout>
          <SandpackCodeEditor showLineNumbers showInlineErrors style={{ height: 300 }} />
          {showConsole ? (
            <SandpackConsole style={{ height: 300 }} />
          ) : (
            <SandpackPreview showNavigator={false} style={{ height: 300 }} />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
