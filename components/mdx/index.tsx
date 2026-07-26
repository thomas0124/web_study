import type { MDXComponents } from "mdx/types";
import Callout from "./Callout";

export const mdxComponents: MDXComponents = {
  Callout,
  pre: (props) => (
    <pre
      {...props}
      className="rounded-lg bg-gray-900 dark:bg-gray-950 p-4 overflow-x-auto text-sm my-6"
    />
  ),
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
