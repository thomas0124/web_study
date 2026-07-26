import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Web学習ロードマップ",
    template: "%s | Web学習ロードマップ",
  },
  description:
    "Web未経験者から仕事で使えるレベルまで。HTML/CSS・JavaScript・React・バックエンド・セキュリティを体系的に学ぶ無料学習サイト。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
