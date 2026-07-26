import { getLesson, getCourse, getCourses, getAllLessonPaths } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Sidebar from "@/components/Sidebar";
import LessonNav from "@/components/LessonNav";
import Callout from "@/components/mdx/Callout";
import Link from "next/link";

interface Props {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}

export async function generateStaticParams() {
  return getAllLessonPaths();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  const lesson = getLesson(courseSlug, lessonSlug);
  if (!lesson) return {};
  return {
    title: lesson.title,
    description: lesson.description,
  };
}

const mdxComponents = { Callout };

export default async function LessonPage({ params }: Props) {
  const { courseSlug, lessonSlug } = await params;
  const lesson = getLesson(courseSlug, lessonSlug);
  if (!lesson) notFound();

  const course = getCourse(courseSlug);
  if (!course) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-500 transition-colors">
          コース一覧
        </Link>
        <span>/</span>
        <Link
          href={`/courses/${courseSlug}`}
          className="hover:text-blue-500 transition-colors"
        >
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-gray-300">{lesson.title}</span>
      </nav>

      <div className="flex gap-10">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            courseSlug={courseSlug}
            lessons={course.lessons}
            currentSlug={lessonSlug}
          />
        </div>

        {/* Main content */}
        <article className="flex-1 min-w-0">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {lesson.title}
            </h1>
            {lesson.description && (
              <p className="text-gray-500 dark:text-gray-400">
                {lesson.description}
              </p>
            )}
          </header>

          <div className="prose prose-gray dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent prose-code:before:content-none prose-code:after:content-none">
            <MDXRemote source={lesson.content} components={mdxComponents} />
          </div>

          <LessonNav
            courseSlug={courseSlug}
            prev={lesson.prev}
            next={lesson.next}
          />
        </article>
      </div>
    </div>
  );
}
