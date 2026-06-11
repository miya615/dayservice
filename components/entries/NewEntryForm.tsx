"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Category, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";

export function NewEntryForm({ editEntry }: {
  editEntry?: {
    id: string;
    title: string;
    content: string | null;
    category: Category;
    entry_date: string;
    image_url: string | null;
  }
}) {
  const router = useRouter();
  const isEdit = !!editEntry;
  const [title, setTitle] = useState(editEntry?.title ?? "");
  const [content, setContent] = useState(editEntry?.content ?? "");
  const [category, setCategory] = useState<Category>(editEntry?.category ?? "日常");
  const [entryDate, setEntryDate] = useState(editEntry?.entry_date ?? new Date().toISOString().split("T")[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editEntry?.image_url ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("タイトルを入力してください"); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }

    let imageUrl = editEntry?.image_url ?? null;
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("entry-images").upload(path, imageFile, { upsert: true });
      if (uploadError) { setError("画像のアップロードに失敗しました"); setLoading(false); return; }
      const { data: urlData } = supabase.storage.from("entry-images").getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    if (isEdit) {
      const { error: updateError } = await supabase.from("entries").update({
        title, content, category, entry_date: entryDate, image_url: imageUrl, updated_at: new Date().toISOString()
      }).eq("id", editEntry!.id);
      if (updateError) { setError(updateError.message); setLoading(false); return; }
      router.push(`/entries/${editEntry!.id}`);
    } else {
      const { error: insertError } = await supabase.from("entries").insert({
        user_id: user.id, title, content, category, entry_date: entryDate, image_url: imageUrl,
      });
      if (insertError) { setError(insertError.message); setLoading(false); return; }
      router.push("/entries");
    }
  }

  return (
    <div className="py-8 animate-fade-up relative z-10">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-8 pt-2">
        <button onClick={() => router.back()} className="w-10 h-10 glass rounded-2xl flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-white/60">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-white">{isEdit ? "記録を編集" : "新しい記録"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 日付 */}
        <div className="glass rounded-2xl p-4">
          <label className="block text-[10px] font-medium text-white/40 mb-2 tracking-widest uppercase">Date</label>
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-white/80"
          />
        </div>

        {/* タイトル */}
        <div className="glass rounded-2xl p-4">
          <label className="block text-[10px] font-medium text-white/40 mb-2 tracking-widest uppercase">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="記録のタイトル"
            className="w-full bg-transparent text-base font-semibold text-white/90 placeholder-white/20"
          />
        </div>

        {/* カテゴリ */}
        <div className="glass rounded-2xl p-4">
          <label className="block text-[10px] font-medium text-white/40 mb-3 tracking-widest uppercase">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl text-xs transition-all ${
                  category === cat
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                    : "glass text-white/50 hover:text-white/70"
                }`}
              >
                <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                <span className="text-[9px] font-medium leading-tight text-center">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 本文 */}
        <div className="glass rounded-2xl p-4">
          <label className="block text-[10px] font-medium text-white/40 mb-2 tracking-widest uppercase">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今日あったこと、感じたこと、気づいたこと..."
            rows={5}
            className="w-full bg-transparent text-sm text-white/80 placeholder-white/20 resize-none leading-relaxed"
          />
        </div>

        {/* 写真 */}
        <div className="glass rounded-2xl p-4">
          <label className="block text-[10px] font-medium text-white/40 mb-3 tracking-widest uppercase">Photo</label>
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="" className="w-full h-52 object-cover rounded-2xl" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-white/10 rounded-2xl h-36 flex flex-col items-center justify-center gap-2 hover:border-white/20 transition-colors">
                <span className="text-3xl opacity-50">📷</span>
                <span className="text-xs text-white/30">タップして写真を選択</span>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-2xl">{error}</div>
        )}

        {/* 保存ボタン */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 rounded-2xl text-white font-semibold text-sm disabled:opacity-50"
        >
          {loading ? "保存中..." : isEdit ? "変更を保存" : "記録を保存"}
        </button>
      </form>
    </div>
  );
}
