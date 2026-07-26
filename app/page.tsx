import { getCourses } from "@/lib/content";
import CourseCard from "@/components/CourseCard";
import type { Level } from "@/lib/types";

const levelOrder: Level[] = ["入門", "中級", "上級"];

export default function HomePage() {
  const courses = getCourses();

  const grouped = levelOrder.reduce<Record<Level, typeof courses>>(
    (acc, level) => {
      acc[level] = courses.filter((c) => c.level === level);
      return acc;
    },
    { 入門: [], 中級: [], 上級: [] }
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Web学習ロードマップ
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Web未経験から仕事で使えるプロへ。
          <br />
          HTML/CSS・JavaScript・React・バックエンド・セキュリティを体系的に学ぼう。
        </p>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
          <span>✅ 全{courses.length}コース</span>
          <span>✅ 無料・ログイン不要</span>
          <span>✅ 日本語対応</span>
        </div>
      </div>

      {/* Courses by level */}
      {levelOrder.map((level) => {
        const levelCourses = grouped[level];
        if (levelCourses.length === 0) return null;
        return (
          <section key={level} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {level}
              </h2>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {levelCourses.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
