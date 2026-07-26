import { ReactNode } from "react";

type CalloutType = "info" | "warning" | "tip" | "note";

const styles: Record<CalloutType, string> = {
  info: "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100",
  warning: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100",
  tip: "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700 text-green-900 dark:text-green-100",
  note: "bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100",
};

const icons: Record<CalloutType, string> = {
  info: "ℹ️",
  warning: "⚠️",
  tip: "💡",
  note: "📝",
};

interface Props {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

export default function Callout({ type = "info", title, children }: Props) {
  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}>
      <div className="flex items-start gap-2">
        <span className="text-lg leading-tight">{icons[type]}</span>
        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="text-sm leading-relaxed [&>p]:mb-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
