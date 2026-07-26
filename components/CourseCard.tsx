import Link from "next/link";
import type { CourseMeta } from "@/lib/types";

const levelColors = {
  入門: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  中級: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  上級: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

interface Props {
  course: CourseMeta;
}

export default function CourseCard({ course }: Props) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all bg-white dark:bg-gray-900"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-2xl font-bold text-gray-300 dark:text-gray-700">
          {String(course.order).padStart(2, "0")}
        </span>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${levelColors[course.level]}`}
        >
          {course.level}
        </span>
      </div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
        {course.title}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
        {course.description}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {course.lessonCount} レッスン
      </p>
    </Link>
  );
}
