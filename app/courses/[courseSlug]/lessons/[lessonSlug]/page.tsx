import { getLesson, getCourse, getAllLessonPaths } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import LessonLayout from "@/components/LessonLayout";
import LessonNav from "@/components/LessonNav";
import { mdxComponents } from "@/components/mdx";
import Link from "next/link";
import remarkGfm from "remark-gfm";

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

export default async function LessonPage({ params }: Props) {
  const { courseSlug, lessonSlug } = await params;
  const lesson = getLesson(courseSlug, lessonSlug);
  if (!lesson) notFound();

  const course = getCourse(courseSlug);
  if (!course) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="hidden lg:flex items-center gap-2 text-sm text-gray-400 mb-8">
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

      <LessonLayout
        courseSlug={courseSlug}
        lessons={course.lessons}
        currentSlug={lessonSlug}
      >
        <article className="min-w-0">
          <header className="mb-8 pt-4 lg:pt-0">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 lg:hidden">
              {course.title}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {lesson.title}
            </h1>
            {lesson.description && (
              <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">
                {lesson.description}
              </p>
            )}
          </header>

          <div className="prose prose-gray dark:prose-invert max-w-2xl prose-pre:p-0 prose-pre:bg-transparent prose-code:before:content-none prose-code:after:content-none">
            <MDXRemote
              source={lesson.content}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>

          <LessonNav
            courseSlug={courseSlug}
            prev={lesson.prev}
            next={lesson.next}
          />
        </article>
      </LessonLayout>
    </div>
  );
}
