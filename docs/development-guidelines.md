# 開発ガイドライン（Development Guidelines）

## 概要

草野球チーム Albatross（Alba）の管理 Web アプリケーションの開発ガイドラインを定義します。

---

## コーディング規約

### 基本方針

- TypeScript の strict モードを有効にし、型安全性を確保する
- Biome によるリンティング・フォーマットを適用する
- 未使用コードは Knip で検出し、速やかに削除する

### TypeScript

#### 型定義

```typescript
// Good: 明示的な型定義
type Game = {
  id: number;
  gameDate: string;
  venue: string;
  teamScore: number;
  opposingTeamScore: number;
};

// Good: 引数には型を指定し、戻り値は型推論に任せる
const formatGameDate = (dateString: string) => {
  return format(new Date(dateString), "YYYY-MM-DD");
};

// Good: 型推論が効く場合は明示的な型注釈を省略
const games = await prisma.game.findMany(); // Game[] と推論される

// Bad: any 型の使用
const processData = (data: any) => { ... };
```

#### 型推論の活用

- 戻り値の型は基本的に型推論に任せる
- 変数宣言時も型推論が効く場合は型注釈を省略する
- 引数の型は必ず指定する（推論できないため）
- 複雑な型や外部に公開する関数は明示的に型を書くことも可

#### 型の使い分け

| 用途           | 推奨          | 説明                        |
| -------------- | ------------- | --------------------------- |
| オブジェクト型 | `type`        | 型エイリアスを使用          |
| React Props    | `type`        | コンポーネントの Props 定義 |
| 拡張が必要な型 | `interface`   | `extends` が必要な場合のみ  |
| Prisma 生成型  | `import type` | 型のみインポートする        |

### React / Next.js

#### コンポーネント定義

```typescript
// Good: アロー関数 + export
export const GameCard = ({ game }: { game: Game }) => {
  return <div className="...">{game.venue}</div>;
};

// Good: Props 型を分離
type Props = {
  game: Game;
  isHighlighted?: boolean;
};

export const GameCard = ({ game, isHighlighted = false }: Props) => {
  return <div className={isHighlighted ? "..." : "..."}>{game.venue}</div>;
};
```

#### Server Components / Client Components

| 種類             | 用途                                    |
| ---------------- | --------------------------------------- |
| Server Component | データフェッチ、SEO、初期レンダリング   |
| Client Component | インタラクティブな UI、イベントハンドラ |

```typescript
// Server Component（デフォルト）
export const GameList = async () => {
  const games = await prisma.game.findMany();
  return <ul>{games.map(...)}</ul>;
};

// Client Component
"use client";

export const GameFilter = () => {
  const [filter, setFilter] = useState("");
  return <input onChange={(e) => setFilter(e.target.value)} />;
};
```

---

## 命名規則

### ファイル・ディレクトリ

| 対象                 | 規則              | 例                      |
| -------------------- | ----------------- | ----------------------- |
| コンポーネント       | `camelCase.tsx`   | `gameCard.tsx`          |
| ページ               | `page.tsx`        | `page.tsx`              |
| レイアウト           | `layout.tsx`      | `layout.tsx`            |
| フック               | `useCamelCase.ts` | `useGameData.ts`        |
| ユーティリティ       | `camelCase.ts`    | `formatDate.ts`         |
| Server Action        | `camelCase.ts`    | `createGame.ts`         |
| 型定義ファイル       | `types.ts`        | `types.ts`              |
| テストファイル       | `*.test.ts(x)`    | `gameCard.test.tsx`     |
| ディレクトリ         | `kebab-case`      | `game-list`             |
| プライベートフォルダ | `_kebab-case`     | `_components`, `_utils` |

### 変数・関数

| 対象                 | 規則               | 例                       |
| -------------------- | ------------------ | ------------------------ |
| 変数                 | `camelCase`        | `gameList`, `userName`   |
| 定数                 | `UPPER_SNAKE_CASE` | `MAX_GAMES`, `API_URL`   |
| 関数                 | `camelCase`        | `formatDate`, `getGames` |
| コンポーネント       | `PascalCase`       | `GameCard`, `Header`     |
| カスタムフック       | `useCamelCase`     | `useGameData`, `useAuth` |
| 型・インターフェース | `PascalCase`       | `Game`, `UserProfile`    |

### Boolean 命名

```typescript
// Good: is, has, can, should などのプレフィックス
const isLoading = true;
const hasError = false;
const canEdit = user.role === "admin";

// Bad: 曖昧な命名
const loading = true;
const error = false;
```

### イベントハンドラ

```typescript
// Good: handle + 動詞
const handleSubmit = () => { ... };
const handleClick = () => { ... };
const handleGameSelect = (game: Game) => { ... };

// Props として渡す場合: on + 動詞
type ButtonProps = {
  onClick: () => void;
  onSubmit: (data: FormData) => void;
};
```

---

## スタイリング規約

### Tailwind CSS

本プロジェクトでは Tailwind CSS を使用してスタイリングを行います。

#### 基本ルール

- インラインスタイル（`style` 属性）は使用しない
- CSS ファイルでのカスタムクラス定義は最小限に抑える
- 共通のデザイントークンは `globals.css` の `@theme` で定義する

#### クラス名の記述順序

1. レイアウト（`flex`, `grid`, `block`）
2. 配置（`justify-*`, `items-*`, `gap-*`）
3. サイズ（`w-*`, `h-*`, `size-*`）
4. 余白（`p-*`, `m-*`）
5. 背景・ボーダー（`bg-*`, `border-*`, `rounded-*`）
6. テキスト（`text-*`, `font-*`）
7. その他（`cursor-*`, `transition-*`）

```tsx
// Good: 順序を意識した記述
<div className="flex items-center gap-4 w-full p-4 bg-white rounded-lg text-sm font-bold">

// Good: レスポンシブ対応
<div className="flex flex-col md:flex-row p-3 md:p-4">
```

#### カスタムテーマ

`globals.css` で定義されたカスタムテーマを使用します。

```css
@theme {
  --size-header-height: 64px;
  --size-footer-height: 80px;
  --color-primary: #00053a;
  --color-secondary: #9e8f42;
}
```

使用例:

```tsx
<header className="h-(--size-header-height)">
<button className="bg-primary text-white">
```

---

## テスト規約

### テスト方針

| テスト種別     | ツール                   | 対象                           |
| -------------- | ------------------------ | ------------------------------ |
| ユニットテスト | Vitest + Testing Library | コンポーネント・ユーティリティ |
| 統合テスト     | Vitest                   | API・データ層                  |
| E2E テスト     | Playwright               | ユーザーフロー全体             |

### カバレッジ目標

| 種別       | 目標 |
| ---------- | ---- |
| 全体       | 80%  |
| 新規コード | 90%  |

### テストファイル配置

- ユニットテスト: 対象ファイルと同じディレクトリに `.test.ts(x)` として配置
- 統合テスト: `tests/integration/`
- E2E テスト: `tests/e2e/`

```
src/app/_utils/date/
├── date.ts
└── date.test.ts    # ユニットテスト
```

### テストの書き方

#### ユニットテスト

```typescript
import { describe, it, expect } from "vitest";
import { formatAsMDWithColon } from "./date";

describe("formatAsMDWithColon", () => {
  it("日付を M.D 形式にフォーマットする", () => {
    expect(formatAsMDWithColon("2025-01-15")).toBe("1.15");
  });

  it("月初の日付を正しくフォーマットする", () => {
    expect(formatAsMDWithColon("2025-03-01")).toBe("3.1");
  });
});
```

#### コンポーネントテスト

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GameCard } from "./gameCard";

describe("GameCard", () => {
  const mockGame = {
    id: 1,
    gameDate: "2025-01-15",
    venue: "東京ドーム",
    teamScore: 5,
    opposingTeamScore: 3,
  };

  it("試合情報を表示する", () => {
    render(<GameCard game={mockGame} />);
    expect(screen.getByText("東京ドーム")).toBeInTheDocument();
  });
});
```

### テスト命名規則

- `describe`: テスト対象（関数名・コンポーネント名）
- `it`: 期待する動作を日本語で記述

```typescript
describe("formatDate", () => {
  it("日付を YYYY-MM-DD 形式に変換する", () => { ... });
  it("無効な日付の場合は空文字を返す", () => { ... });
});
```

---

## Git 規約

### ブランチ戦略

| ブランチ    | 用途                     |
| ----------- | ------------------------ |
| `main`      | 本番環境用（プロテクト） |
| `develop`   | 開発用統合ブランチ       |
| `feature/*` | 機能開発                 |
| `fix/*`     | バグ修正                 |
| `docs/*`    | ドキュメント更新         |

### ブランチ命名規則

```
feature/add-game-list
feature/implement-user-auth
fix/game-date-format
docs/update-readme
```

### コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) 形式を採用します。

#### フォーマット

```
<type>: <description>

[optional body]

[optional footer]
```

#### タイプ一覧

| タイプ     | 用途                                 | 例                                 |
| ---------- | ------------------------------------ | ---------------------------------- |
| `feat`     | 新機能追加                           | `feat: add game list component`    |
| `fix`      | バグ修正                             | `fix: correct date format in game` |
| `docs`     | ドキュメント変更                     | `docs: update README`              |
| `style`    | コードスタイル変更（動作に影響なし） | `style: format code with biome`    |
| `refactor` | リファクタリング                     | `refactor: extract date utils`     |
| `test`     | テスト追加・修正                     | `test: add game card tests`        |
| `chore`    | ビルド・ツール変更                   | `chore: update dependencies`       |

#### コミットメッセージ例

```bash
# Good
feat: add game listing components and error handling templates
fix: update datasource URL syntax in prisma.config.ts
docs: update development guidelines

# Bad
update files
fix bug
WIP
```

### プルリクエスト

#### PR タイトル

コミットメッセージと同様に Conventional Commits 形式を使用します。

```
feat: add user authentication
fix: resolve game date display issue
```

#### PR テンプレート

```markdown
## 概要

変更の概要を記述

## 変更内容

- 変更点 1
- 変更点 2

## テスト

- [ ] ユニットテスト追加
- [ ] ローカル動作確認

## スクリーンショット（UI 変更がある場合）
```

### マージ戦略

- `feature/*`, `fix/*` → `develop`: Squash and Merge
- `develop` → `main`: Merge Commit（リリース履歴を保持）

---

## 開発フロー

### 1. 機能開発の流れ

1. `develop` から `feature/*` ブランチを作成
2. 実装・テスト作成
3. Biome でリント・フォーマット
4. PR 作成、レビュー依頼
5. レビュー承認後、`develop` にマージ

### 2. 開発コマンド

```bash
# 開発サーバー起動（DB 起動・マイグレーション含む）
pnpm dev

# リント・フォーマット
pnpm lint

# データベース操作
pnpm db:up          # DB コンテナ起動
pnpm db:migrate     # マイグレーション実行
pnpm db:seed        # シードデータ投入
pnpm db:studio      # Prisma Studio 起動
pnpm db:rebuild     # DB リセット＋シード

# Prisma Client 生成
pnpm generate:client

# ビルド
pnpm build
```

### 3. コードレビュー観点

- [ ] TypeScript の型が適切に定義されているか
- [ ] コンポーネントの責務が明確か
- [ ] テストが追加されているか
- [ ] 命名規則に従っているか
- [ ] パフォーマンスへの影響はないか
- [ ] セキュリティ上の問題はないか

---

## 更新履歴

| 日付       | 更新内容 | 更新者 |
| ---------- | -------- | ------ |
| 2025-01-11 | 初版作成 | -      |
