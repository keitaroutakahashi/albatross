# 設計書

## アーキテクチャ概要

Next.js App Router の動的ルーティング機能を使用し、Server Components ベースの試合詳細ページを実装します。

```
src/app/(public)/games/[id]/
├── page.tsx              # 詳細ページ（Server Component）
└── _components/
    ├── gameHeader.tsx    # ヘッダー情報（日付、リーグ、グラウンド）
    └── scoreBoard.tsx    # スコアボード
```

## コンポーネント設計

### 1. ページコンポーネント（page.tsx）

**責務**:

- 試合データの取得
- 子コンポーネントへのデータ配布
- レイアウト構成

**実装の要点**:

- Server Component として実装
- 動的ルートから ID を受け取る
- ダミーデータから該当試合を検索

### 2. GameHeader コンポーネント

**責務**:

- 試合の基本情報を表示（日付、曜日、年、リーグ名、グラウンド）
- 戻るリンクの提供

**実装の要点**:

- 既存の日付フォーマットユーティリティを再利用
- レスポンシブデザイン対応

### 3. ScoreBoard コンポーネント

**責務**:

- イニングごとの得点をテーブル形式で表示
- 両チームの合計得点を表示
- 勝敗を視覚的に表現

**実装の要点**:

- テーブル形式でスコアを表示
- モバイルでの横スクロール対応
- 勝敗に応じた色分け

## データフロー

### 試合詳細表示

```
1. ユーザーが/games/[id]にアクセス
2. page.tsxがパラメータからidを取得
3. ダミーデータから該当試合を検索
4. GameHeaderとScoreBoardに試合データを渡す
5. 各コンポーネントがUIをレンダリング
```

## データ構造

### 試合データ（拡張版）

```typescript
interface GameDetail {
  id: number;
  gameDate: string;
  leagueName: string;
  opposingTeam: string;
  venue: string;
  teamScore: number;
  opposingTeamScore: number;
  result: "win" | "lose" | "draw";
  pitcher: string;
  isHome: boolean;
  innings: InningScore[];
}

interface InningScore {
  inning: number;
  ourScore: number;
  opponentScore: number;
}
```

## エラーハンドリング戦略

### 存在しない試合ID

- 該当試合が見つからない場合は notFound() を呼び出し
- Next.js の not-found.tsx で 404 ページを表示

## テスト戦略

### ユニットテスト

- 日付フォーマット関数（既存）
- スコア計算ロジック（必要に応じて）

### 統合テスト

- 詳細ページの表示確認

## 依存ライブラリ

新規追加なし（既存のライブラリのみ使用）

## ディレクトリ構造

```
src/app/(public)/games/
├── page.tsx                    # 試合一覧（既存）
├── _components/
│   ├── gameList.tsx            # 既存
│   └── gameItem.tsx            # 既存（リンク追加）
├── _dummy/
│   └── data.ts                 # 既存（イニングスコア追加）
└── [id]/
    ├── page.tsx                # 新規：試合詳細ページ
    └── _components/
        ├── gameHeader.tsx      # 新規：ヘッダー
        └── scoreBoard.tsx      # 新規：スコアボード
```

## 実装の順序

1. ダミーデータの拡張（イニングスコア追加）
2. 試合詳細ページ（page.tsx）の作成
3. GameHeader コンポーネントの作成
4. ScoreBoard コンポーネントの作成
5. 試合一覧アイテムにリンクを追加
6. 動作確認と微調整

## セキュリティ考慮事項

- 現時点ではダミーデータを使用するため、特別な対策は不要
- 将来的なDB連携時にはパラメータのバリデーションを実装

## パフォーマンス考慮事項

- Server Components を使用してクライアントへのJS送信量を最小化
- 画像最適化は Next.js の Image コンポーネントで対応

## 将来の拡張性

- 打撃成績・投手成績タブの追加が容易な構造
- データベース連携時のリファクタリングが最小限
