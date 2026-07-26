import Link from "next/link";
import type { LessonMeta } from "@/lib/types";

interface Props {
  courseSlug: string;
  lessons: LessonMeta[];
  currentSlug: string;
}

export default function Sidebar({ courseSlug, lessons, currentSlug }: Props) {
  const currentIdx = lessons.findIndex((l) => l.slug === currentSlug);

  return (
    <aside className="w-60 flex-shrink-0">
      <div className="sticky top-20">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
          レッスン一覧
        </p>
        <ul className="space-y-0.5">
          {lessons.map((lesson, idx) => {
            const isActive = lesson.slug === currentSlug;
            const isDone = idx < currentIdx;

            return (
              <li key={lesson.slug}>
                <Link
                  href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isDone
                        ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    }`}
                  >
                    {isDone ? "✓" : idx + 1}
                  </span>
                  <span className="leading-tight">{lesson.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
