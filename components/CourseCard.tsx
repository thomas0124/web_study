import Link from "next/link";
import type { CourseMeta } from "@/lib/types";
import { levelColors } from "@/lib/level-colors";
import { courseIcons } from "@/lib/course-icons";

interface Props {
  course: CourseMeta;
}

export default function CourseCard({ course }: Props) {
  const icon = courseIcons[course.slug] ?? "📚";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group relative flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      {/* subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-100/0 group-hover:from-blue-50/60 group-hover:to-indigo-50/40 dark:group-hover:from-blue-950/20 dark:group-hover:to-indigo-950/10 transition-all duration-200 pointer-events-none" />

      <div className="relative">
        {/* Icon + level badge */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl leading-none">{icon}</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelColors[course.level]}`}>
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-snug">
          {course.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {course.lessonCount} レッスン
          </span>
          <span className="text-xs font-medium text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            学習開始 →
          </span>
        </div>
      </div>
    </Link>
  );
}
