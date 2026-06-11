"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage("確認メールを送信しました。メールをご確認ください。");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("メールアドレスまたはパスワードが正しくありません");
      else window.location.href = "/";
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen min-h-dvh flex flex-col items-center justify-center px-5 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-60 h-60 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 mb-10 text-center animate-fade-up">
        <div className="w-20 h-20 rounded-3xl btn-primary flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-indigo-500/30">
          <span className="text-white text-3xl">✦</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight gradient-text mb-1">Life Archive</h1>
        <p className="text-sm text-white/40">人生のすべてを、ひとつの場所に</p>
      </div>

      <div className="relative z-10 w-full max-w-sm glass-bright rounded-3xl p-7 shadow-2xl shadow-black/40 animate-fade-up">
        <h2 className="text-lg font-semibold text-white/90 mb-6">
          {isSignUp ? "アカウントを作成" : "おかえりなさい"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 tracking-wider uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field w-full px-4 py-3.5 rounded-2xl text-sm"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 tracking-wider uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input-field w-full px-4 py-3.5 rounded-2xl text-sm"
              placeholder="6文字以上"
            />
          </div>

          {message && (
            <div className={`text-xs px-4 py-3 rounded-2xl ${
              message.includes("メール")
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>{message}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 rounded-2xl text-white font-semibold text-sm mt-2 disabled:opacity-50"
          >
            {loading ? "処理中..." : isSignUp ? "アカウントを作成" : "ログイン"}
          </button>
        </form>

        <button
          onClick={() => { setIsSignUp(!isSignUp); setMessage(""); }}
          className="w-full mt-5 py-2 text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          {isSignUp ? "すでにアカウントをお持ちの方" : "アカウントをお持ちでない方"}
        </button>
      </div>
    </div>
  );
}
