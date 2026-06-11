"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Entry, CATEGORY_ICONS } from "@/lib/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
}

export function EntryDetail({ entry }: { entry: Entry }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const supabase = createClient();
    if (entry.image_url) {
      const path = entry.image_url.split("/entry-images/")[1];
      if (path) await supabase.storage.from("entry-images").remove([path]);
    }
    await supabase.from("entries").delete().eq("id", entry.id);
    router.push("/entries");
  }

  return (
    <div className="py-8 animate-fade-up relative z-10">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <button onClick={() => router.back()} className="w-10 h-10 glass rounded-2xl flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-white/60">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div className="flex gap-2">
          <Link href={`/entries/${entry.id}/edit`}>
            <div className="h-10 px-5 glass rounded-2xl flex items-center text-sm font-medium text-white/70">編集</div>
          </Link>
          <button
            onClick={() => setShowConfirm(true)}
            className="h-10 px-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm font-medium text-red-400"
          >
            削除
          </button>
        </div>
      </div>

      {/* 写真 */}
      {entry.image_url && (
        <div className="rounded-3xl overflow-hidden mb-5 shadow-2xl shadow-black/40">
          <img src={entry.image_url} alt="" className="w-full max-h-72 object-cover" />
        </div>
      )}

      {/* コンテンツカード */}
      <div className="glass rounded-3xl p-6 shadow-xl shadow-black/20 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
            {CATEGORY_ICONS[entry.category]} {entry.category}
          </span>
          <span className="text-xs text-white/30">{formatDate(entry.entry_date)}</span>
        </div>

        <h1 className="text-2xl font-bold text-white leading-snug">{entry.title}</h1>

        {entry.content && (
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
        )}

        <div className="pt-3 border-t border-white/5">
          <p className="text-[10px] text-white/20">
            作成: {new Date(entry.created_at).toLocaleDateString("ja-JP")}
            {entry.updated_at !== entry.created_at && (
              <> ・ 更新: {new Date(entry.updated_at).toLocaleDateString("ja-JP")}</>
            )}
          </p>
        </div>
      </div>

      {/* 削除確認モーダル */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50 p-5 animate-fade-in">
          <div className="glass-bright rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
            <h3 className="text-base font-semibold text-white/90 mb-2">記録を削除しますか？</h3>
            <p className="text-sm text-white/40 mb-6">この操作は取り消せません。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3.5 glass rounded-2xl text-sm font-medium text-white/60"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3.5 bg-red-500 rounded-2xl text-sm font-semibold text-white disabled:opacity-60"
              >
                {deleting ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
