# 開発ガイドライン (Development Guidelines)

## 概要

草野球チーム Albatross（Alba）の管理 Web アプリケーションの開発規約とプロセスを定義します。

---

## コーディング規約

### 命名規則

#### 変数・関数

**TypeScript/JavaScript**:

```typescript
// ✅ 良い例
const userProfileData = fetchUserProfile();
function calculateBattingAverage(atBats: number, hits: number): number {}
const isAuthenticated = true;
const hasPermission = false;

// ❌ 悪い例
const data = fetch();
const flag = true;
function calc(a: number, b: number): number {}
```

**原則**:

- 変数: camelCase、名詞または名詞句
- 関数: camelCase、動詞で始める
- 定数: UPPER_SNAKE_CASE
- Boolean: `is`, `has`, `should`, `can` で始める

#### クラス・インターフェース・型

```typescript
// コンポーネント: PascalCase
function GameScoreBoard() {}
function BattingStatsForm() {}

// インターフェース: PascalCase
interface Game {}
interface BattingStats {}

// 型エイリアス: PascalCase
type GameResult = "WIN" | "LOSE" | "DRAW" | "TBD";
type UserRole = "ADMIN" | "STAFF" | "PLAYER";
```

#### ファイル名

```
// コンポーネント: camelCase.tsx
gameCard.tsx
battingStatsForm.tsx

// ユーティリティ: camelCase.ts
formatDate.ts
calculateStats.ts

// 定数: camelCase.ts または constants.ts
constants.ts
gameConstants.ts

// ページコンポーネント: page.tsx (Next.js App Router)
page.tsx
layout.tsx
error.tsx
```

### コードフォーマット

**Biome を使用**:

- インデント: タブ（Biome デフォルト）
- 行の長さ: 80 文字
- セミコロン: 必須
- クォート: ダブルクォート

**設定例 (biome.json)**:

```json
{
  "formatter": {
    "indentStyle": "tab",
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always"
    }
  }
}
```

### インポート規則

**パスエイリアス**:

`@/` エイリアスを使用し、相対パスでのインポートは同一ディレクトリ内のみ許可します。

```typescript
// ✅ 良い例
import { Header } from "@/app/_components/header";
import { prisma } from "@/lib/prisma";
import type { Game } from "@/generated/prisma";

// ❌ 悪い例
import { Header } from "../../_components/header";
import { prisma } from "../../../lib/prisma";
```

**インポート順序**:

1. React / Next.js
2. 外部ライブラリ
3. 内部モジュール（`@/` エイリアス）
4. 相対パス（同一ディレクトリ内のみ）
5. 型インポート

```typescript
// 1. React / Next.js
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. 外部ライブラリ
import { format } from "@formkit/tempo";

// 3. 内部モジュール
import { Header } from "@/app/_components/header";
import { prisma } from "@/lib/prisma";

// 4. 相対パス（同一ディレクトリ内）
import { GameCard } from "./gameCard";

// 5. 型インポート
import type { Game } from "@/generated/prisma";
```

### コメント規約

**TSDoc 形式**:

````typescript
/**
 * 打率を計算する
 *
 * @param atBats - 打数
 * @param hits - 安打数
 * @returns 打率（小数点3桁）
 * @throws {Error} 打数が0以下の場合
 *
 * @example
 * ```typescript
 * const avg = calculateBattingAverage(100, 30);
 * // returns 0.300
 * ```
 */
function calculateBattingAverage(atBats: number, hits: number): number {
  if (atBats <= 0) {
    throw new Error("打数は1以上である必要があります");
  }
  return hits / atBats;
}
````

**インラインコメント**:

```typescript
// ✅ 良い例: なぜそうするかを説明
// 規定打席に満たない場合はランキング対象外
if (plateAppearances < minimumPlateAppearances) {
  return null;
}

// ❌ 悪い例: 何をしているか（コードを見れば分かる）
// 打席数をチェック
if (plateAppearances < minimumPlateAppearances) {
  return null;
}
```

### エラーハンドリング

**原則**:

- 予期されるエラー: 適切に処理してユーザーにフィードバック
- 予期しないエラー: 上位に伝播してログに記録
- エラーを無視しない

**Server Actions でのエラーハンドリング**:

```typescript
"use server";

import { revalidatePath } from "next/cache";

export async function createGame(formData: FormData) {
  try {
    // バリデーション
    const gameDate = formData.get("gameDate");
    if (!gameDate) {
      return { error: "試合日は必須です" };
    }

    // データベース操作
    await prisma.game.create({
      data: {
        // ...
      },
    });

    revalidatePath("/games");
    return { success: true };
  } catch (error) {
    console.error("試合作成エラー:", error);
    return { error: "試合の作成に失敗しました" };
  }
}
```

---

## React / Next.js 規約

### Server Components と Client Components

**デフォルトは Server Components**:

```typescript
// Server Component（デフォルト）
// データフェッチ、SEO最適化に使用
async function GameList() {
  const games = await prisma.game.findMany();
  return (
    <ul>
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </ul>
  );
}
```

**Client Components が必要な場合のみ `"use client"` を追加**:

```typescript
"use client";

// Client Component
// useState, useEffect, イベントハンドラ等が必要な場合
import { useState } from "react";

function ScoreInput() {
  const [score, setScore] = useState(0);

  return (
    <input
      type="number"
      value={score}
      onChange={(e) => setScore(Number(e.target.value))}
    />
  );
}
```

### Server Actions

**フォーム処理には Server Actions を使用**:

```typescript
// src/app/_actions/game.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGame(formData: FormData) {
  const gameDate = formData.get("gameDate") as string;
  const opponentTeamId = formData.get("opponentTeamId") as string;

  await prisma.game.create({
    data: {
      gameDate: new Date(gameDate),
      opponentTeamId: parseInt(opponentTeamId),
      // ...
    },
  });

  revalidatePath("/games");
}
```

```typescript
// ページコンポーネント
import { createGame } from "@/app/_actions/game";

function NewGameForm() {
  return (
    <form action={createGame}>
      <input type="date" name="gameDate" required />
      <button type="submit">作成</button>
    </form>
  );
}
```

### コンポーネント設計

**Props の型定義**:

```typescript
interface GameCardProps {
  game: Game;
  showDetails?: boolean;
}

function GameCard({ game, showDetails = false }: GameCardProps) {
  return (
    <div>
      <h3>{game.opponentTeam.name}</h3>
      {showDetails && <p>{game.notes}</p>}
    </div>
  );
}
```

**コンポーネントの配置ルール**:

| 種類                     | 配置場所                                          |
| ------------------------ | ------------------------------------------------- |
| 全体共通コンポーネント   | `src/app/_components/`                            |
| 機能共通コンポーネント   | `src/app/_features/[feature]/components/`         |
| ページ固有コンポーネント | `src/app/(public\|private)/[feature]/_components/` |

---

## Git 運用ルール

### ブランチ戦略

**ブランチ構成**:

```
main (本番環境)
└── develop (開発・統合環境)
    ├── feature/* (新機能開発)
    ├── fix/* (バグ修正)
    └── refactor/* (リファクタリング)
```

**運用ルール**:

- **main**: 本番リリース済みの安定版コードのみを保持
- **develop**: 次期リリースに向けた最新の開発コード
- **feature/\*、fix/\***: develop から分岐し、作業完了後に PR で develop へマージ
- **直接コミット禁止**: すべてのブランチで PR レビューを必須

**ブランチ命名規則**:

```
feature/add-user-authentication
feature/game-score-input
fix/batting-average-calculation
refactor/game-list-component
```

### コミットメッセージ規約

**Conventional Commits 形式**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 一覧**:

| Type     | 説明                     |
| -------- | ------------------------ |
| feat     | 新機能                   |
| fix      | バグ修正                 |
| docs     | ドキュメント             |
| style    | コードフォーマット       |
| refactor | リファクタリング         |
| test     | テスト追加・修正         |
| chore    | ビルド、補助ツール等     |

**例**:

```
feat(game): 試合スコア入力機能を追加

イニングごとの得点を入力できる機能を実装しました。
- スコアボードコンポーネントを追加
- Server Action でのスコア保存処理を実装
- 入力バリデーションを追加

Closes #45
```

### プルリクエストプロセス

**作成前のチェック**:

- [ ] 全てのテストがパス
- [ ] Lint エラーがない
- [ ] 型チェックがパス
- [ ] 競合が解決されている

**PR テンプレート**:

```markdown
## 概要

[変更内容の簡潔な説明]

## 変更理由

[なぜこの変更が必要か]

## 変更内容

- [変更点 1]
- [変更点 2]

## テスト

- [ ] ユニットテスト追加
- [ ] 手動テスト実施

## スクリーンショット(該当する場合)

[画像]

## 関連 Issue

Closes #[Issue 番号]
```

**レビュープロセス**:

1. セルフレビュー
2. 自動テスト実行（CI）
3. レビュアーアサイン
4. レビューフィードバック対応
5. 承認後マージ

---

## テスト戦略

### テストの種類

| テスト種別   | ツール                   | 対象範囲                       | カバレッジ目標 |
| ------------ | ------------------------ | ------------------------------ | -------------- |
| ユニットテスト | Vitest + Testing Library | コンポーネント・ユーティリティ | 80%            |
| 統合テスト   | Vitest                   | Server Actions・データ層       | 70%            |
| E2E テスト   | Playwright               | 主要ユーザーフロー             | 主要フロー網羅 |

### テストの書き方

**Given-When-Then パターン**:

```typescript
describe("calculateBattingAverage", () => {
  it("正常なデータで打率を計算できる", () => {
    // Given: 準備
    const atBats = 100;
    const hits = 30;

    // When: 実行
    const result = calculateBattingAverage(atBats, hits);

    // Then: 検証
    expect(result).toBe(0.3);
  });

  it("打数が0の場合エラーをスローする", () => {
    // Given: 準備
    const atBats = 0;
    const hits = 0;

    // When/Then: 実行と検証
    expect(() => calculateBattingAverage(atBats, hits)).toThrow();
  });
});
```

### テストファイルの配置

| 種類               | 配置場所                       |
| ------------------ | ------------------------------ |
| ユニットテスト     | 対象ファイルと同じディレクトリ |
| 統合テスト         | `tests/integration/`           |
| E2E テスト         | `tests/e2e/`                   |

**例**:

```
src/app/_utils/date/
├── date.ts
└── date.test.ts    # ユニットテスト

tests/
├── integration/    # 統合テスト
├── e2e/            # E2E テスト
└── vitest.setup.ts # セットアップ
```

---

## コードレビュー基準

### レビューポイント

**機能性**:

- [ ] 要件を満たしているか
- [ ] エッジケースが考慮されているか
- [ ] エラーハンドリングが適切か

**可読性**:

- [ ] 命名が明確か
- [ ] コメントが適切か
- [ ] 複雑なロジックが説明されているか

**保守性**:

- [ ] 重複コードがないか
- [ ] 責務が明確に分離されているか
- [ ] 変更の影響範囲が限定的か

**パフォーマンス**:

- [ ] 不要な計算がないか
- [ ] データベースクエリが最適化されているか

**セキュリティ**:

- [ ] 入力検証が適切か
- [ ] 機密情報がハードコードされていないか
- [ ] 権限チェックが実装されているか

### レビューコメントの書き方

**優先度の明示**:

- `[必須]`: 修正必須
- `[推奨]`: 修正推奨
- `[提案]`: 検討してほしい
- `[質問]`: 理解のための質問

**例**:

```markdown
[必須] セキュリティ: ユーザー入力がサニタイズされていません。
XSS 対策として、入力値をエスケープしてください。

[推奨] パフォーマンス: この処理はループ外に移動できます。

[提案] 可読性: この変数名を `gameDate` から `scheduledGameDate` に
変更すると、予定日であることが明確になります。
```

---

## 開発環境セットアップ

### 必要なツール

| ツール     | バージョン | インストール方法              |
| ---------- | ---------- | ----------------------------- |
| Node.js    | 24.x       | `volta install node@24`       |
| pnpm       | 10.x       | `npm install -g pnpm`         |
| Docker     | -          | Docker Desktop をインストール |

### セットアップ手順

```bash
# 1. リポジトリのクローン
git clone https://github.com/your-org/albatross.git
cd albatross

# 2. 依存関係のインストール
pnpm install

# 3. 環境変数の設定
cp .env.example .env.local
# .env.local ファイルを編集

# 4. データベースの起動
docker compose up -d

# 5. Prisma クライアントの生成
pnpm generate:client

# 6. データベースのマイグレーション
pnpm db:migrate

# 7. 開発サーバーの起動
pnpm dev
```

### 主要なスクリプト

| スクリプト           | 説明                       |
| -------------------- | -------------------------- |
| `pnpm dev`           | 開発サーバー起動           |
| `pnpm build`         | プロダクションビルド       |
| `pnpm lint`          | Lint チェック              |
| `pnpm format`        | コードフォーマット         |
| `pnpm test`          | テスト実行                 |
| `pnpm generate:client` | Prisma クライアント生成    |
| `pnpm db:migrate`    | データベースマイグレーション |

---

## 品質自動化

### CI/CD (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: "24"
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

### 自動チェック項目

| 項目             | ツール     | タイミング           |
| ---------------- | ---------- | -------------------- |
| Lint チェック    | Biome      | コミット前、CI       |
| フォーマット     | Biome      | コミット前、CI       |
| 型チェック       | TypeScript | コミット前、CI       |
| テスト実行       | Vitest     | CI                   |
| ビルド確認       | Next.js    | CI                   |
| 未使用コード検出 | Knip       | 定期実行（週次など） |

---

## 更新履歴

| 日付       | 更新内容 | 更新者 |
| ---------- | -------- | ------ |
| 2025-01-12 | 初版作成 | -      |
