import Link from "next/link";
import type { LessonMeta } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  courseSlug: string;
  prev: LessonMeta | null;
  next: LessonMeta | null;
}

export default function LessonNav({ courseSlug, prev, next }: Props) {
  return (
    <nav className="flex items-stretch justify-between gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      {prev ? (
        <Link
          href={`/courses/${courseSlug}/lessons/${prev.slug}`}
          className="flex-1 flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">前のレッスン</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
              {prev.title}
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          href={`/courses/${courseSlug}/lessons/${next.slug}`}
          className="flex-1 flex items-center justify-end gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group text-right"
        >
          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">次のレッスン</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
              {next.title}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
