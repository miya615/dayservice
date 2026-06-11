"use client";

import Link from "next/link";
import { Entry, CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", { month: "short", day: "numeric", weekday: "short" });
}

function todayJP() {
  return new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
}

interface Props {
  entries: Entry[];
  monthCount: number;
  displayName: string;
}

export function HomeContent({ entries, monthCount, displayName }: Props) {
  return (
    <div className="py-8 space-y-7 animate-fade-up relative z-10">

      {/* ヘッダー */}
      <div className="pt-2">
        <p className="text-xs text-white/30 font-medium tracking-widest uppercase mb-2">{todayJP()}</p>
        <h1 className="text-2xl font-bold text-white leading-tight">
          こんにちは、<span className="gradient-text">{displayName}</span>
        </h1>
        <p className="text-sm text-white/40 mt-1">今日は何を記録しますか？</p>
      </div>

      {/* クイック追加 */}
      <Link href="/entries/new">
        <div className="glass-bright rounded-3xl p-5 shadow-xl shadow-black/20 active:scale-[0.97] transition-all duration-200 border border-indigo-500/20 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl btn-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
              <span className="text-white text-2xl leading-none font-light">+</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white/90">新しい記録を追加</p>
              <p className="text-xs text-white/40 mt-0.5">出来事、気持ち、アイデアを残す</p>
            </div>
            <span className="text-white/20 text-lg group-active:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </Link>

      {/* 統計 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-3xl p-5 shadow-lg shadow-black/20">
          <p className="text-xs text-white/30 mb-2 tracking-wider">今月の記録</p>
          <p className="text-4xl font-bold gradient-text">{monthCount}</p>
          <p className="text-xs text-white/30 mt-1">件</p>
        </div>
        <Link href="/timeline">
          <div className="glass rounded-3xl p-5 shadow-lg shadow-black/20 h-full flex flex-col justify-between active:scale-95 transition-transform">
            <p className="text-xs text-white/30 tracking-wider">人生年表</p>
            <div className="mt-3">
              <p className="text-2xl mb-1">🗓</p>
              <p className="text-sm font-semibold text-white/70">振り返る →</p>
            </div>
          </div>
        </Link>
      </div>

      {/* 最近の記録 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white/60 tracking-wider uppercase">Recent</h2>
          <Link href="/entries" className="text-xs text-indigo-400 font-medium">すべて見る</Link>
        </div>

        {entries.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center shadow-lg shadow-black/20">
            <div className="w-16 h-16 rounded-3xl glass-bright flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✦</span>
            </div>
            <p className="text-sm font-semibold text-white/60 mb-1">まだ記録がありません</p>
            <p className="text-xs text-white/30">最初の記録を残してみましょう</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <Link key={entry.id} href={`/entries/${entry.id}`}>
                <div
                  className="glass rounded-2xl overflow-hidden shadow-lg shadow-black/20 active:scale-[0.98] transition-all"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {entry.image_url && (
                    <img src={entry.image_url} alt="" className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                        {CATEGORY_ICONS[entry.category]} {entry.category}
                      </span>
                      <span className="text-[10px] text-white/30 ml-auto">{formatDate(entry.entry_date)}</span>
                    </div>
                    <p className="text-sm font-semibold text-white/90">{entry.title}</p>
                    {entry.content && (
                      <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">{entry.content}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
