import type { MDXComponents } from "mdx/types";
import Callout from "./Callout";
import CodeBlock from "./CodeBlock";

export const mdxComponents: MDXComponents = {
  Callout,
  pre: CodeBlock,
  code: ({ children, className, ...props }) => {
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return (
        <code {...props} className={className}>
          {children}
        </code>
      );
    }
    return (
      <code
        {...props}
        className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400"
      >
        {children}
      </code>
    );
  },
};
