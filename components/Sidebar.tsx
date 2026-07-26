import Link from "next/link";
import type { LessonMeta } from "@/lib/types";

interface Props {
  courseSlug: string;
  lessons: LessonMeta[];
  currentSlug: string;
}

export default function Sidebar({ courseSlug, lessons, currentSlug }: Props) {
  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-20">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          レッスン一覧
        </p>
        <ul className="space-y-1">
          {lessons.map((lesson) => {
            const isActive = lesson.slug === currentSlug;
            return (
              <li key={lesson.slug}>
                <Link
                  href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <span className="text-xs text-gray-400 mr-2">
                    {String(lesson.order).padStart(2, "0")}
                  </span>
                  {lesson.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
