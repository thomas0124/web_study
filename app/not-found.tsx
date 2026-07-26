import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="text-6xl font-bold text-gray-200 dark:text-gray-800 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        ページが見つかりません
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        お探しのコースまたはレッスンは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
      >
        コース一覧へ戻る
      </Link>
    </div>
  );
}
