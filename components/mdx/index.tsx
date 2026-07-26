import type { MDXComponents } from "mdx/types";
import Callout from "./Callout";
import CodeBlock from "./CodeBlock";
import Quiz from "./Quiz";

export const mdxComponents: MDXComponents = {
  Callout,
  Quiz,
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
        className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
      >
        {children}
      </code>
    );
  },
};
