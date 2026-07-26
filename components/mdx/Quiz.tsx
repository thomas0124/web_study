"use client";

import { useState } from "react";

interface QuizProps {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export default function Quiz({ question, options, answer, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const isAnswered = selected !== null;
  const isCorrect = selected === answer;

  return (
    <div className="my-8 rounded-2xl border border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 dark:from-blue-950/30 dark:to-indigo-950/20 overflow-hidden not-prose">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 px-5 py-3 bg-blue-600 dark:bg-blue-700">
        <span className="text-white text-xs font-bold tracking-widest uppercase">Quiz</span>
      </div>

      {/* 問題文 */}
      <div className="px-5 pt-4 pb-3">
        <p className="text-gray-900 dark:text-gray-100 font-semibold text-base leading-relaxed">
          {question}
        </p>
      </div>

      {/* 選択肢 */}
      <div className="px-5 pb-4 space-y-2">
        {options.map((opt, i) => {
          let style =
            "w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ";

          if (!isAnswered) {
            style +=
              "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer";
          } else if (i === answer) {
            style +=
              "bg-green-50 dark:bg-green-950/40 border-green-400 dark:border-green-600 text-green-800 dark:text-green-300 cursor-default";
          } else if (i === selected) {
            style +=
              "bg-red-50 dark:bg-red-950/40 border-red-400 dark:border-red-600 text-red-800 dark:text-red-300 cursor-default";
          } else {
            style +=
              "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-default opacity-60";
          }

          return (
            <button
              key={i}
              className={style}
              onClick={() => !isAnswered && setSelected(i)}
              disabled={isAnswered}
            >
              <span className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border ${
                  !isAnswered
                    ? "border-gray-300 dark:border-gray-600 text-gray-500"
                    : i === answer
                    ? "border-green-500 bg-green-500 text-white"
                    : i === selected
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-gray-200 dark:border-gray-700 text-gray-300"
                }`}>
                  {!isAnswered
                    ? String.fromCharCode(65 + i)
                    : i === answer
                    ? "✓"
                    : i === selected
                    ? "✗"
                    : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* 結果フィードバック */}
      {isAnswered && (
        <div className={`mx-5 mb-4 px-4 py-3 rounded-xl text-sm ${
          isCorrect
            ? "bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
            : "bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
        }`}>
          <p className="font-semibold mb-1">
            {isCorrect ? "🎉 正解！" : `❌ 不正解。正解は「${options[answer]}」です。`}
          </p>
          {explanation && (
            <p className="text-xs leading-relaxed opacity-90">{explanation}</p>
          )}
          <button
            onClick={() => setSelected(null)}
            className="mt-2 text-xs underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            もう一度挑戦
          </button>
        </div>
      )}
    </div>
  );
}
