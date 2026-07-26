import { getCourse, getCourses } from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ courseSlug: string }>;
}

export async function generateStaticParams() {
  return getCourses().map((c) => ({ courseSlug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) return {};
  return {
    title: course.title,
    description: course.description,
  };
}

const levelColors = {
  入門: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  中級: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  上級: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default async function CoursePage({ params }: Props) {
  const { courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-500 transition-colors">
          コース一覧
        </Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300">{course.title}</span>
      </nav>

      {/* Course header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${levelColors[course.level]}`}
          >
            {course.level}
          </span>
          <span className="text-sm text-gray-400">{course.lessonCount} レッスン</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          {course.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
          {course.description}
        </p>
      </header>

      {/* Lesson list */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          レッスン一覧
        </h2>
        <ol className="space-y-2">
          {course.lessons.map((lesson, idx) => (
            <li key={lesson.slug}>
              <Link
                href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all group"
              >
                <span className="text-sm font-bold text-gray-300 dark:text-gray-700 w-6 text-right flex-shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {lesson.title}
                  </p>
                  {lesson.description && (
                    <p className="text-sm text-gray-400 mt-0.5 truncate">
                      {lesson.description}
                    </p>
                  )}
                </div>
                <span className="text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>

        {/* Start button */}
        {course.lessons.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href={`/courses/${courseSlug}/lessons/${course.lessons[0].slug}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              最初から始める →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
