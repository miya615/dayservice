# dayservice プロジェクト概要

## プロジェクトの目的
デイサービス施設スタッフが外出レクリエーションの記録・管理・分析を行うためのWebアプリケーション。

## 技術スタック
- **フロントエンド:** 純粋な HTML / CSS / JavaScript（フレームワーク不使用）
- **データ保存:** ブラウザの localStorage（`dayservice_v8` キー）
- **外部連携:** Google Apps Script（GAS）Webhook によるスプレッドシート同期（任意）
- **ビルド不要:** `index.html` 1ファイルだけで動作する

## ファイル構成
```
dayservice/
└── index.html   # アプリ全体（HTML + CSS + JS がすべて含まれる）
```

## 主な機能
1. **ダッシュボード** — 月間統計・ミニカレンダー・直近のスケジュール・通知
2. **外出記録の管理（CRUD）** — 日付・場所・駐車場・費用・評価・スタッフ・タグ・メモ・URL
3. **一覧表示** — 検索・フィルター・ソート（日付/場所/評価/費用）
4. **カレンダー表示** — 月別グリッドでアクティビティを可視化
5. **お気に入り機能** — スター付き記録を一覧表示
6. **場所マップ** — 訪問場所の統計・Google マップ連携
7. **CSV エクスポート / インポート** — データのバックアップと復元
8. **GAS 連携** — Google スプレッドシートへの自動同期

## データ構造（レコードスキーマ）
```javascript
{
  id: "timestamp+random",
  date: "YYYY-MM-DD",
  place: "場所名",
  parking: "yes" | "no",
  cost: "数値文字列 or 空文字",
  rating: "⭐⭐⭐⭐⭐ とても良かった" など,
  staff: "スタッフ名",
  tags: ["🌸 公園・自然", ...],  // 12種類のタグから複数選択
  note: "メモ（自由記述）",
  url: "公式サイトURL",
  favorite: boolean,
  createdAt: "ISO日時",
  updatedAt: "ISO日時"  // 任意
}
```

## 主要な関数
| 関数 | 役割 |
|------|------|
| `getR()` / `saveR()` | データの読み書き（localStorage） |
| `renderAll()`, `renderDashboard()`, `renderSearch()` | 各ビューの描画 |
| `openRegModal()`, `saveRecord()`, `deleteRecord()` | CRUD操作 |
| `setView()`, `onSearch()`, `setSort()` | ナビゲーション・フィルター |
| `exportCSV()`, `importCSV()`, `sendToGAS()` | データ入出力 |
| `showToast()`, `mo()` / `mc()` | トースト通知・モーダル操作 |

## デザイン方針
- 温かみのある配色（アースカラー：グリーン・オレンジ・ブラウン系）
- レスポンシブ対応（モバイルファースト、700px 以下でサイドバーをトグル）
- 時間帯に応じたあいさつ（朝／昼／夕）

## 開発ブランチ
- 作業ブランチ: `claude/great-euler-7jkqkf`
- メインブランチ: `main`

## 作業上の注意
- ファイルは `index.html` 1本のみ。新しいファイルを追加する前に確認すること
- localStorage のデータはブラウザ依存のため、バックアップは CSV エクスポートを使う
- GAS 連携の Webhook URL はユーザーが別途設定する（ソースには含まれない）

## 進捗・未完了タスク
（次回セッション開始時にここを更新してください）

- [ ] 未完了タスクがあればここに記載する
