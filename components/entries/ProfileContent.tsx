"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CATEGORY_ICONS } from "@/lib/types";

interface Props {
  email: string;
  displayName: string;
  avatarUrl: string | null;
  totalEntries: number;
  photoCount: number;
  categoryStats: Record<string, number>;
  memberSince: string;
}

export function ProfileContent({
  email, displayName: initialDisplayName, avatarUrl,
  totalEntries, photoCount, categoryStats, memberSince,
}: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").upsert({ id: user!.id, display_name: displayName, updated_at: new Date().toISOString() });
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  const topCategories = Object.entries(categoryStats).sort(([, a], [, b]) => b - a).slice(0, 4);

  return (
    <div className="py-8 space-y-5 animate-fade-up relative z-10">
      <h1 className="text-2xl font-bold text-white pt-2">マイページ</h1>

      {/* プロフィールカード */}
      <div className="glass-bright rounded-3xl p-6 shadow-xl shadow-black/20">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-3xl btn-primary flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-indigo-500/30 flex-shrink-0">
            {avatarUrl
              ? <img src={avatarUrl} alt="" className="w-full h-full object-cover rounded-3xl" />
              : displayName.charAt(0).toUpperCase()
            }
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input-field w-full text-base font-semibold px-3 py-2 rounded-xl"
              />
            ) : (
              <p className="text-base font-bold text-white/90 truncate">{displayName}</p>
            )}
            <p className="text-xs text-white/30 mt-0.5 truncate">{email}</p>
            <p className="text-[10px] text-white/20 mt-1">
              {new Date(memberSince).toLocaleDateString("ja-JP")} から利用中
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="flex-1 py-3 glass rounded-2xl text-sm font-medium text-white/50">キャンセル</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 btn-primary rounded-2xl text-sm font-semibold text-white disabled:opacity-60">
                {saving ? "保存中..." : "保存"}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="flex-1 py-3 glass rounded-2xl text-sm font-medium text-white/50">
              名前を変更
            </button>
          )}
        </div>
      </div>

      {/* 統計 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-3xl p-5 text-center shadow-lg shadow-black/20">
          <p className="text-4xl font-bold gradient-text">{totalEntries}</p>
          <p className="text-xs text-white/30 mt-1">総記録数</p>
        </div>
        <div className="glass rounded-3xl p-5 text-center shadow-lg shadow-black/20">
          <p className="text-4xl font-bold gradient-text">{photoCount}</p>
          <p className="text-xs text-white/30 mt-1">写真の記録</p>
        </div>
      </div>

      {/* カテゴリ統計 */}
      {topCategories.length > 0 && (
        <div className="glass rounded-3xl p-5 shadow-lg shadow-black/20">
          <h3 className="text-xs font-semibold text-white/40 mb-4 tracking-widest uppercase">Category</h3>
          <div className="space-y-3.5">
            {topCategories.map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-base w-6 text-center">{CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS] ?? "📝"}</span>
                <span className="text-sm text-white/60 flex-1">{cat}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: `${(count / totalEntries) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/30 w-5 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI機能予告 */}
      <div className="glass rounded-3xl p-5 shadow-lg shadow-black/20 border border-indigo-500/10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">✨</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/70">AI機能 — 近日公開</p>
            <p className="text-xs text-white/30 mt-1 leading-relaxed">
              AI検索、月末レポート、第二の脳機能を準備中。あなたの記録をより深く活用できるようになります。
            </p>
          </div>
        </div>
      </div>

      {/* ログアウト */}
      <button
        onClick={handleSignOut}
        className="w-full py-4 glass rounded-2xl text-sm font-medium text-red-400 border border-red-500/10"
      >
        ログアウト
      </button>
    </div>
  );
}
