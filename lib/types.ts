export type Level = "入門" | "中級" | "上級";

export interface CourseMeta {
  slug: string;
  title: string;
  description: string;
  level: Level;
  order: number;
  lessonCount: number;
}

export interface LessonMeta {
  slug: string;
  courseSlug: string;
  title: string;
  description: string;
  order: number;
}

export interface Course extends CourseMeta {
  lessons: LessonMeta[];
}

export interface Lesson extends LessonMeta {
  content: string;
  prev: LessonMeta | null;
  next: LessonMeta | null;
}
