# 設計書

## アーキテクチャ概要

既存のNext.js App Router + React Server Componentsアーキテクチャを維持し、試合詳細ページに新しいコンポーネントを追加する。

```
/games/[id]/page.tsx
├── GameHeader（既存）
├── ScoreBoard（既存）
├── GameSummary（新規）      - 戦評セクション
├── GamePitchers（新規）     - 責任投手・本塁打セクション
└── GameStats（新規）        - 試合統計セクション
```

## コンポーネント設計

### 1. GameSummary

**責務**:

- 試合の戦評（サマリー）を表示
- データがない場合は非表示

**実装の要点**:

- Server Componentとして実装
- 条件付きレンダリングでデータがない場合は何も表示しない

### 2. GamePitchers

**責務**:

- 勝利投手、敗戦投手、セーブ投手を表示
- 本塁打者を表示

**実装の要点**:

- Server Componentとして実装
- 各項目がない場合は「-」を表示
- グリッドレイアウトで整理

### 3. GameStats

**責務**:

- 試合時間を表示
- 参加人数を表示

**実装の要点**:

- Server Componentとして実装
- コンパクトなレイアウト

## データフロー

### 試合詳細表示

```
1. page.tsxがgetGameById()でGameDataを取得
2. 取得したGameDataを各コンポーネントにpropsとして渡す
3. 各コンポーネントが必要なデータを表示
```

## エラーハンドリング戦略

### データ不在時の処理

- GameSummary: データがなければコンポーネント自体を非表示
- GamePitchers: 個別項目がなければ「-」を表示
- GameStats: 個別項目がなければ「-」を表示

## テスト戦略

### ユニットテスト

- 各コンポーネントの表示テスト
- データがない場合の挙動テスト

### 統合テスト

- 試合詳細ページ全体の表示テスト

## 依存ライブラリ

新規ライブラリの追加は不要。既存の依存関係で実装可能。

## ディレクトリ構造

```
src/app/(public)/games/
├── _dummy/
│   └── data.ts              # GameData型とダミーデータを拡張
├── [id]/
│   ├── page.tsx             # 新コンポーネントを追加
│   └── _components/
│       ├── gameHeader.tsx   # 既存
│       ├── scoreBoard.tsx   # 既存
│       ├── gameSummary.tsx  # 新規
│       ├── gamePitchers.tsx # 新規
│       └── gameStats.tsx    # 新規
```

## 実装の順序

1. GameData型を拡張（summary, pitchers, homeRuns, duration, participantsを追加）
2. ダミーデータを更新
3. GameSummaryコンポーネントを実装
4. GamePitchersコンポーネントを実装
5. GameStatsコンポーネントを実装
6. page.tsxを更新して新コンポーネントを組み込み

## セキュリティ考慮事項

- ユーザー入力はないため、XSS対策は不要
- Server Componentのためクライアントサイドでのデータ漏洩リスクなし

## パフォーマンス考慮事項

- Server Componentを使用するため、クライアントサイドのJavaScriptバンドルサイズに影響なし
- 追加のAPIコールなし（既存データ構造の拡張のみ）

## 将来の拡張性

- GameData型の拡張は将来のデータベース連携を見据えた設計
- 各コンポーネントは独立しており、将来的に打撃成績・投手成績コンポーネントを追加可能
