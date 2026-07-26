import Link from "next/link";
import type { CourseMeta } from "@/lib/types";
import { levelColors } from "@/lib/level-colors";
import { courseIcons } from "@/lib/course-icons";

const levelAccent: Record<string, string> = {
  入門: "from-green-400 to-emerald-500",
  中級: "from-yellow-400 to-orange-500",
  上級: "from-red-400 to-rose-600",
};

interface Props {
  course: CourseMeta;
}

export default function CourseCard({ course }: Props) {
  const icon = courseIcons[course.slug] ?? "📚";
  const accent = levelAccent[course.level] ?? "from-blue-400 to-indigo-500";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group relative flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-transparent hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-blue-950/30 transition-all duration-300 overflow-hidden"
    >
      {/* レベル別アクセントライン */}
      <div className={`h-1 w-full bg-gradient-to-r ${accent} opacity-80 group-hover:opacity-100 transition-opacity`} />

      {/* ホバーオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/30 dark:group-hover:from-blue-950/20 dark:group-hover:to-indigo-950/10 transition-all duration-300 pointer-events-none" />

      <div className="relative p-6 flex flex-col flex-1">
        {/* Icon + level badge */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl leading-none drop-shadow-sm">{icon}</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelColors[course.level]}`}>
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-snug">
          {course.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2 flex-1">
          {course.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            {course.lessonCount} レッスン
          </span>
          <span className="text-xs font-semibold text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 flex items-center gap-1">
            学習開始 →
          </span>
        </div>
      </div>
    </Link>
  );
}
