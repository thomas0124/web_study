"use client";

import Link from "next/link";
import type { LessonMeta } from "@/lib/types";

interface Props {
  courseSlug: string;
  lessons: LessonMeta[];
  currentSlug: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ courseSlug, lessons, currentSlug, isOpen = false, onClose }: Props) {
  const currentIdx = lessons.findIndex((l) => l.slug === currentSlug);

  const inner = (
    <div className="w-60 flex-shrink-0">
      <div className="sticky top-20">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
          レッスン一覧
        </p>
        <ul className="space-y-0.5">
          {lessons.map((lesson, idx) => {
            const isActive = lesson.slug === currentSlug;
            const isDone = idx < currentIdx;
            return (
              <li key={lesson.slug}>
                <Link
                  href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isDone
                        ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    }`}
                  >
                    {isDone ? "✓" : idx + 1}
                  </span>
                  <span className="leading-tight">{lesson.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* デスクトップ: 固定表示 */}
      <aside className="hidden lg:block">{inner}</aside>

      {/* モバイル: ドロワー */}
      <div className="lg:hidden">
        {/* オーバーレイ */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
          aria-hidden="true"
        />
        {/* ドロワーパネル */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-950 shadow-2xl transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-800">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">レッスン一覧</span>
            <button
              onClick={onClose}
              aria-label="メニューを閉じる"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(100%-56px)] p-4">
            <ul className="space-y-0.5">
              {lessons.map((lesson, idx) => {
                const isActive = lesson.slug === currentSlug;
                const isDone = idx < currentIdx;
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60"
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : isDone
                            ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                        }`}
                      >
                        {isDone ? "✓" : idx + 1}
                      </span>
                      <span className="leading-tight">{lesson.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
