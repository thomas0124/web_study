import { getCourses } from "@/lib/content";
import CourseCard from "@/components/CourseCard";
import type { Level } from "@/lib/types";

const levelOrder: Level[] = ["入門", "中級", "上級"];

const levelMeta: Record<Level, { icon: string; description: string; color: string }> = {
  入門: {
    icon: "🌱",
    description: "プログラミング未経験から始める基礎固め",
    color: "text-green-700 dark:text-green-400",
  },
  中級: {
    icon: "🌿",
    description: "基礎を活かして実践的なスキルを身につける",
    color: "text-yellow-700 dark:text-yellow-400",
  },
  上級: {
    icon: "🌳",
    description: "プロとして活躍するための専門知識",
    color: "text-red-700 dark:text-red-400",
  },
};

export default function HomePage() {
  const courses = getCourses();
  const totalLessons = courses.reduce((sum, c) => sum + c.lessonCount, 0);

  const grouped = levelOrder.reduce<Record<Level, typeof courses>>(
    (acc, level) => {
      acc[level] = courses.filter((c) => c.level === level);
      return acc;
    },
    { 入門: [], 中級: [], 上級: [] }
  );

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30 border-b border-gray-100 dark:border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.08),_transparent_60%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span>✨</span>
            <span>無料・ログイン不要・日本語対応</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent leading-tight pb-1">
            Web学習ロードマップ
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Web未経験から仕事で使えるプロへ。<br />
            HTML/CSS・JavaScript・React・バックエンド・セキュリティを<br className="hidden sm:block" />
            体系的に学べる無料カリキュラム。
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{courses.length}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">コース</p>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalLessons}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">レッスン</p>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">3</p>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">レベル</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses by level */}
      <div className="max-w-6xl mx-auto px-4 py-14">
        {levelOrder.map((level) => {
          const levelCourses = grouped[level];
          if (levelCourses.length === 0) return null;
          const meta = levelMeta[level];
          return (
            <section key={level} className="mb-14">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{meta.icon}</span>
                <h2 className={`text-xl font-bold ${meta.color}`}>{level}</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 ml-10">
                {meta.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {levelCourses.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
