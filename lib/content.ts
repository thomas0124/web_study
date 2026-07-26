import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Course, CourseMeta, Lesson, LessonMeta } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "courses");

function getCourseDirs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((d) => fs.statSync(path.join(CONTENT_DIR, d)).isDirectory())
    .sort();
}

function readCourseMeta(courseDir: string): CourseMeta {
  const metaPath = path.join(CONTENT_DIR, courseDir, "meta.json");
  const raw = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  return { ...raw, slug: raw.slug ?? courseDir };
}

function getLessonFiles(courseDir: string): string[] {
  const lessonsDir = path.join(CONTENT_DIR, courseDir, "lessons");
  if (!fs.existsSync(lessonsDir)) return [];
  return fs
    .readdirSync(lessonsDir)
    .filter((f) => f.endsWith(".mdx"))
    .sort();
}

function parseLessonFile(
  filePath: string,
  courseSlug: string
): LessonMeta & { content: string } {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fileName = path.basename(filePath, ".mdx");
  const orderMatch = fileName.match(/^(\d+)-/);
  const order = orderMatch ? parseInt(orderMatch[1], 10) : 0;
  const slug = data.slug ?? fileName.replace(/^\d+-/, "");
  return {
    slug,
    courseSlug,
    title: data.title ?? slug,
    description: data.description ?? "",
    order,
    content,
  };
}

export function getCourses(): CourseMeta[] {
  return getCourseDirs().map(readCourseMeta);
}

export function getCourse(courseSlug: string): Course | null {
  const dirs = getCourseDirs();
  const dir = dirs.find((d) => {
    const meta = readCourseMeta(d);
    return meta.slug === courseSlug;
  });
  if (!dir) return null;

  const meta = readCourseMeta(dir);
  const files = getLessonFiles(dir);
  const lessons: LessonMeta[] = files.map((f) => {
    const { content: _content, ...lessonMeta } = parseLessonFile(
      path.join(CONTENT_DIR, dir, "lessons", f),
      courseSlug
    );
    return lessonMeta;
  });

  return { ...meta, lessons };
}

export function getLesson(
  courseSlug: string,
  lessonSlug: string
): Lesson | null {
  const dirs = getCourseDirs();
  const dir = dirs.find((d) => {
    const meta = readCourseMeta(d);
    return meta.slug === courseSlug;
  });
  if (!dir) return null;

  const files = getLessonFiles(dir);
  const allLessons = files.map((f) =>
    parseLessonFile(path.join(CONTENT_DIR, dir, "lessons", f), courseSlug)
  );

  const idx = allLessons.findIndex((l) => l.slug === lessonSlug);
  if (idx === -1) return null;

  const lesson = allLessons[idx];
  const prev = idx > 0 ? (({ content: _content, ...m }) => m)(allLessons[idx - 1]) : null;
  const next =
    idx < allLessons.length - 1
      ? (({ content: _content, ...m }) => m)(allLessons[idx + 1])
      : null;

  return { ...lesson, prev, next };
}

export function getAllLessonPaths(): { courseSlug: string; lessonSlug: string }[] {
  const paths: { courseSlug: string; lessonSlug: string }[] = [];
  for (const dir of getCourseDirs()) {
    const meta = readCourseMeta(dir);
    for (const f of getLessonFiles(dir)) {
      const { slug } = parseLessonFile(
        path.join(CONTENT_DIR, dir, "lessons", f),
        meta.slug
      );
      paths.push({ courseSlug: meta.slug, lessonSlug: slug });
    }
  }
  return paths;
}
