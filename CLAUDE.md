@AGENTS.md

# Life Archive — プロジェクト記録

## プロジェクト概要

**アプリ名**: Life Archive
**コンセプト**: 人生を記録し、あとから振り返れる「なんでも記録アプリ」
**リポジトリ**: https://github.com/miya615/dayservice（ブランチ: `claude/zealous-einstein-a0pns7`）
**本番URL**: https://dayservice.vercel.app（※現在mainブランチが反映中。ブランチ変更要）

---

## 技術スタック

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (Auth / Database / Storage)
- **Vercel** デプロイ

---

## Supabase情報

- **Project URL**: `https://seqakyxrkjirpwoahpwb.supabase.co`
- **Anon Key**: Vercelの環境変数 `NEXT_PUBLIC_SUPABASE_ANON_KEY` に保存済み
- **Storageバケット**: `entry-images`（公開バケット）
- **セットアップSQL**: `supabase-setup.sql`

---

## 環境変数（.env.local）

```env
NEXT_PUBLIC_SUPABASE_URL=https://seqakyxrkjirpwoahpwb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_hacpe...（Vercelに設定済み）
```

---

## ディレクトリ構成

```
app/
  auth/page.tsx              # ログイン・新規登録
  page.tsx                   # ホーム
  entries/
    page.tsx                 # 記録一覧
    new/page.tsx             # 新規記録追加
    [id]/page.tsx            # 記録詳細
    [id]/edit/page.tsx       # 記録編集
  timeline/page.tsx          # 人生年表
  profile/page.tsx           # マイページ

components/
  layout/
    AppShell.tsx             # ページラッパー
    BottomNav.tsx            # 下部ナビゲーション（4タブ）
  entries/
    HomeContent.tsx          # ホーム画面UI
    EntriesContent.tsx       # 記録一覧UI（検索・フィルター）
    NewEntryForm.tsx         # 記録作成・編集フォーム
    EntryDetail.tsx          # 記録詳細UI
    TimelineContent.tsx      # 年表UI
    ProfileContent.tsx       # マイページUI

lib/
  supabase/
    client.ts                # ブラウザ用Supabaseクライアント
    server.ts                # サーバー用Supabaseクライアント
    middleware.ts            # 認証ミドルウェア
  types.ts                   # TypeScript型定義（Entry, Profile, Category）

proxy.ts                     # Next.js 16 プロキシ（旧middleware）
supabase-setup.sql           # DB・RLS・Storage設定SQL
.env.local.example           # 環境変数テンプレート
```

---

## DB設計

### profiles テーブル
```sql
id           uuid (primary key, auth.usersと連携)
display_name text
avatar_url   text
created_at   timestamptz
updated_at   timestamptz
```

### entries テーブル
```sql
id          uuid (primary key)
user_id     uuid (auth.usersと連携)
title       text (必須)
content     text
category    text (日常/健康/仕事/学習/お金/人間関係/アイデア/思い出)
entry_date  date
image_url   text
created_at  timestamptz
updated_at  timestamptz
```

---

## 機能一覧（Ver1完成済み）

- ✅ メール認証（Supabase Auth）
- ✅ 記録の作成・編集・削除
- ✅ カテゴリ分類（8種類）
- ✅ 写真アップロード（Supabase Storage）
- ✅ キーワード検索・カテゴリフィルター
- ✅ 人生年表（年・月ごとの縦型タイムライン）
- ✅ マイページ（統計・プロフィール編集）
- ✅ スマホファースト・Glassmorphism UI
- ✅ 下部ナビゲーション（ホーム・記録・年表・マイページ）

---

## UIデザイン方針（決定済み）

- **テーマ**: ダーク背景 `#0a0a1a` + インディゴ・パープルの光彩
- **カード**: `glass`（`rgba(255,255,255,0.06)` + `backdrop-filter:blur(24px)`）
- **ボタン**: `btn-primary`（インディゴ→パープルグラデーション）
- **テキスト**: 白/半透明階調（`text-white/90`, `text-white/40` など）
- **グラデーションテキスト**: `gradient-text`クラス
- **アニメーション**: `animate-fade-up`, `animate-fade-in`, `animate-scale-in`
- **フォント**: Hiragino Sans / Noto Sans JP / システムフォント

---

## 将来のAI機能拡張メモ

- `entries.content` をそのまま OpenAI Embeddings API に渡せる設計
- AI検索・月末レポート・第二の脳機能を予定（Ver2以降）

```typescript
// 将来の実装例
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: entry.content,
});
```

---

## Vercelデプロイ状況

- **プロジェクト**: `dayservice`（miya615s-projects）
- **環境変数**: `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 設定済み
- **未解決**: ブランチが `main`（旧バージョン）のまま → `claude/zealous-einstein-a0pns7` に変更が必要

### ブランチ変更の方法（未完了）
Vercel Dashboard → プロジェクト設定 → ビルドとデプロイ → 本番ブランチ を変更する

---

## 次のリポジトリ

今後は `miya615/life-archive` リポジトリで作業予定。

```bash
git clone https://github.com/miya615/life-archive.git
cd life-archive
claude
```
