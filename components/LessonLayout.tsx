"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import type { LessonMeta } from "@/lib/types";

interface Props {
  courseSlug: string;
  lessons: LessonMeta[];
  currentSlug: string;
  children: React.ReactNode;
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

export default function LessonLayout({ courseSlug, lessons, currentSlug, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* モバイル用ハンバーガーバー */}
      <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-14 z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="レッスン一覧を開く"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
        >
          <MenuIcon />
          <span>レッスン一覧</span>
        </button>
      </div>

      <div className="flex gap-10">
        <Sidebar
          courseSlug={courseSlug}
          lessons={lessons}
          currentSlug={currentSlug}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </>
  );
}
