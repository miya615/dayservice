"use client";

import { useState } from "react";
import Link from "next/link";
import { Entry, Category, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", { month: "short", day: "numeric", weekday: "short" });
}

export function EntriesContent({ entries }: { entries: Entry[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "すべて">("すべて");

  const filtered = entries.filter((e) => {
    const matchCat = selectedCategory === "すべて" || e.category === selectedCategory;
    const matchSearch = !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.content?.toLowerCase() ?? "").includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="py-8 space-y-6 animate-fade-up relative z-10">

      {/* ヘッダー */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-bold text-white">記録一覧</h1>
        <Link href="/entries/new">
          <div className="w-10 h-10 rounded-2xl btn-primary flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white text-xl leading-none font-light">+</span>
          </div>
        </Link>
      </div>

      {/* 検索 */}
      <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-white/30 flex-shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="キーワードで検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/20"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-white/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* カテゴリフィルター */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {(["すべて", ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat as Category | "すべて")}
            className={`flex-shrink-0 text-xs font-medium px-3.5 py-2 rounded-full transition-all ${
              selectedCategory === cat
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                : "glass text-white/50 hover:text-white/70"
            }`}
          >
            {cat !== "すべて" ? `${CATEGORY_ICONS[cat as Category]} ` : ""}{cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-white/30">{filtered.length}件の記録</p>

      {/* リスト */}
      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center shadow-lg shadow-black/20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-sm font-semibold text-white/50 mb-1">記録が見つかりません</p>
          <p className="text-xs text-white/30">別のキーワードで検索してみてください</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <Link key={entry.id} href={`/entries/${entry.id}`}>
              <div className="glass rounded-2xl overflow-hidden shadow-lg shadow-black/20 active:scale-[0.98] transition-all">
                {entry.image_url && (
                  <img src={entry.image_url} alt="" className="w-full h-44 object-cover" />
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
  );
}
