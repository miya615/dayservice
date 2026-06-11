"use client";

import Link from "next/link";
import { Entry, CATEGORY_ICONS } from "@/lib/types";

const MONTHS_JP = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

type GroupedEntries = { year: number; months: { month: number; entries: Entry[] }[] }[];

function groupByYearMonth(entries: Entry[]): GroupedEntries {
  const map = new Map<string, Entry[]>();
  for (const e of entries) {
    const [y, m] = e.entry_date.split("-");
    const key = `${y}-${m}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  const years = new Map<number, Map<number, Entry[]>>();
  for (const [key, ents] of map) {
    const [y, m] = key.split("-").map(Number);
    if (!years.has(y)) years.set(y, new Map());
    years.get(y)!.set(m, ents);
  }
  return [...years.entries()].sort(([a], [b]) => b - a).map(([year, monthMap]) => ({
    year,
    months: [...monthMap.entries()].sort(([a], [b]) => b - a).map(([month, entries]) => ({ month, entries })),
  }));
}

export function TimelineContent({ entries }: { entries: Entry[] }) {
  const grouped = groupByYearMonth(entries);

  return (
    <div className="py-8 animate-fade-up relative z-10">
      <h1 className="text-2xl font-bold text-white mb-8 pt-2">人生年表</h1>

      {grouped.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center shadow-lg shadow-black/20">
          <div className="w-16 h-16 rounded-3xl glass-bright flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🗓</span>
          </div>
          <p className="text-sm font-semibold text-white/50 mb-1">まだ記録がありません</p>
          <Link href="/entries/new" className="inline-block mt-4 text-sm text-indigo-400 font-medium">
            最初の記録を追加 →
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map(({ year, months }) => (
            <div key={year}>
              {/* 年マーカー */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl btn-primary flex items-center justify-center shadow-xl shadow-indigo-500/30 flex-shrink-0">
                  <span className="text-white text-xs font-bold">{year}</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/30 to-transparent" />
              </div>

              {months.map(({ month, entries: monthEntries }) => (
                <div key={month} className="ml-7 mb-7">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500/50 flex-shrink-0" />
                    <span className="text-xs font-semibold text-white/40 tracking-wider">
                      {MONTHS_JP[month - 1]}
                      <span className="text-white/20 font-normal ml-1.5">({monthEntries.length}件)</span>
                    </span>
                  </div>

                  <div className="ml-4 space-y-3">
                    {monthEntries.map((entry) => (
                      <Link key={entry.id} href={`/entries/${entry.id}`}>
                        <div className="glass rounded-2xl overflow-hidden shadow-lg shadow-black/20 active:scale-[0.98] transition-all flex">
                          <div className="w-0.5 bg-gradient-to-b from-indigo-500/40 to-purple-500/20 flex-shrink-0" />
                          <div className="flex-1 p-3.5">
                            <div className="flex items-start gap-3">
                              {entry.image_url && (
                                <img src={entry.image_url} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                                    {CATEGORY_ICONS[entry.category]} {entry.category}
                                  </span>
                                  <span className="text-[9px] text-white/25">
                                    {Number(entry.entry_date.split("-")[2])}日
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-white/90 leading-snug">{entry.title}</p>
                                {entry.content && (
                                  <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{entry.content}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
