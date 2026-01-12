# リポジトリ構造定義書（Repository Structure Document）

## 概要

草野球チーム Albatross（Alba）の管理 Web アプリケーションのリポジトリ構造を定義します。

---

## プロジェクト構造

```
albatross/
├── .claude/                    # Claude Code 設定
│   ├── commands/               # スラッシュコマンド
│   ├── skills/                 # タスクモード別スキル
│   └── agents/                 # サブエージェント定義
├── .github/                    # GitHub 設定
│   └── workflows/              # GitHub Actions ワークフロー
├── .vscode/                    # VS Code 設定
├── docs/                       # プロジェクトドキュメント
│   └── ideas/                  # 下書き・アイデア
├── prisma/                     # Prisma（データベース）
│   ├── migrations/             # マイグレーションファイル
│   ├── schema.prisma           # スキーマ定義
│   └── seed.ts                 # シードデータ
├── public/                     # 静的ファイル
│   └── images/                 # 画像ファイル
├── src/                        # ソースコード
│   ├── app/                    # Next.js App Router
│   │   ├── (private)/          # 認証必須ページ
│   │   ├── (public)/           # 認証不要ページ
│   │   │   └── [feature]/      # 機能別ページ
│   │   │       ├── _components/  # ページ固有コンポーネント
│   │   │       ├── _dummy/       # ダミーデータ（開発用）
│   │   │       └── page.tsx      # ページコンポーネント
│   │   ├── _actions/           # Server Actions
│   │   ├── _components/        # 共通コンポーネント
│   │   │   ├── header/
│   │   │   └── footer/
│   │   ├── _features/          # 機能別モジュール
│   │   │   └── [feature]/
│   │   │       └── components/
│   │   ├── _hooks/             # カスタムフック
│   │   ├── _utils/             # ユーティリティ関数
│   │   │   └── date/
│   │   ├── api/                # API Routes（必要な場合のみ）
│   │   ├── error.tsx           # エラーページ
│   │   ├── global-error.tsx    # グローバルエラーページ
│   │   ├── globals.css         # グローバルスタイル
│   │   ├── globals.d.ts        # グローバル型定義
│   │   ├── layout.tsx          # ルートレイアウト
│   │   └── not-found.tsx       # 404 ページ
│   ├── generated/              # 自動生成ファイル
│   │   └── prisma/             # Prisma Client
│   └── lib/                    # ライブラリ設定
│       └── prisma.ts           # Prisma クライアント初期化
├── tests/                      # テストファイル
│   ├── integration/            # 統合テスト
│   ├── e2e/                    # E2E テスト
│   └── vitest.setup.ts         # Vitest セットアップ
├── .env.local                  # 環境変数（ローカル）
├── .env.preview                # 環境変数（プレビュー）
├── .env.production             # 環境変数（本番）
├── .env.example                # 環境変数サンプル
├── .gitignore                  # Git 除外設定
├── .node-version               # Node.js バージョン
├── biome.json                  # Biome 設定
├── docker-compose.yml          # Docker Compose 設定
├── knip.json                   # Knip 設定
├── next.config.ts              # Next.js 設定
├── package.json                # パッケージ設定
├── pnpm-lock.yaml              # pnpm ロックファイル
├── pnpm-workspace.yaml         # pnpm ワークスペース設定
├── postcss.config.mjs          # PostCSS 設定
├── prisma.config.ts            # Prisma 設定
├── tsconfig.json               # TypeScript 設定
└── vitest.config.ts            # Vitest 設定
```

---

## ディレクトリ詳細

### ルートディレクトリ

| ディレクトリ/ファイル | 役割                                           |
| --------------------- | ---------------------------------------------- |
| `.claude/`            | Claude Code の設定ファイル                     |
| `.github/`            | GitHub Actions ワークフローなどの GitHub 設定  |
| `.vscode/`            | VS Code のプロジェクト固有設定                 |
| `docs/`               | プロジェクトドキュメント                       |
| `prisma/`             | Prisma スキーマ、マイグレーション、シード      |
| `public/`             | 静的ファイル（画像、favicon など）             |
| `src/`                | アプリケーションソースコード                   |
| `tests/`              | テストファイルとテスト設定                     |

### src/app/ ディレクトリ

Next.js App Router のディレクトリ構成に従います。

| ディレクトリ      | 役割                                           |
| ----------------- | ---------------------------------------------- |
| `(private)/`      | 認証が必要なページ群（Route Group）            |
| `(public)/`       | 認証不要のページ群（Route Group）              |
| `_actions/`       | Server Actions（データ操作処理）               |
| `_components/`    | アプリ全体で共有するコンポーネント             |
| `_features/`      | 機能別に分割したモジュール                     |
| `_hooks/`         | カスタム React フック                          |
| `_utils/`         | ユーティリティ関数                             |
| `api/`            | API Routes（Server Actions で代替できない場合）|

### 機能別ディレクトリ（例: games）

```
src/app/(public)/games/
├── _components/        # このページ専用のコンポーネント
│   ├── gameList.tsx
│   └── gameItem.tsx
├── _dummy/             # 開発用ダミーデータ
│   └── data.ts
├── [id]/               # 動的ルート（試合詳細）
│   ├── page.tsx
│   └── edit/
│       └── page.tsx
├── new/                # 新規作成ページ
│   └── page.tsx
└── page.tsx            # 一覧ページ
```

### src/lib/ ディレクトリ

| ファイル     | 役割                                   |
| ------------ | -------------------------------------- |
| `prisma.ts`  | Prisma Client のシングルトンインスタンス |

### src/generated/ ディレクトリ

| ディレクトリ | 役割                                   |
| ------------ | -------------------------------------- |
| `prisma/`    | Prisma Client の自動生成コード         |

### docs/ ディレクトリ

| ファイル                    | 役割                         |
| --------------------------- | ---------------------------- |
| `product-requirements.md`   | プロダクト要求定義書         |
| `functional-design.md`      | 機能設計書                   |
| `architecture.md`           | アーキテクチャ設計書         |
| `repository-structure.md`   | リポジトリ構造定義書（本書） |
| `development-guidelines.md` | 開発ガイドライン             |
| `glossary.md`               | 用語集                       |

---

## ファイル配置ルール

### コンポーネントの配置

| 種類                   | 配置場所                               |
| ---------------------- | -------------------------------------- |
| 全体共通コンポーネント | `src/app/_components/`                 |
| 機能共通コンポーネント | `src/app/_features/[feature]/components/` |
| ページ固有コンポーネント | `src/app/(public|private)/[feature]/_components/` |

### Server Actions の配置

| 種類               | 配置場所                               |
| ------------------ | -------------------------------------- |
| 共通アクション     | `src/app/_actions/`                    |
| 機能固有アクション | `src/app/_features/[feature]/actions/` |

### ユーティリティの配置

| 種類               | 配置場所                               |
| ------------------ | -------------------------------------- |
| 汎用ユーティリティ | `src/app/_utils/`                      |
| 機能固有ユーティリティ | `src/app/_features/[feature]/utils/` |

### 型定義の配置

| 種類               | 配置場所                               |
| ------------------ | -------------------------------------- |
| グローバル型定義   | `src/app/globals.d.ts`                 |
| 機能固有型定義     | `src/app/_features/[feature]/types.ts` |
| Prisma 生成型      | `src/generated/prisma/`                |

### テストファイルの配置

| 種類                 | 配置場所                           |
| -------------------- | ---------------------------------- |
| ユニットテスト       | 対象ファイルと同じディレクトリ     |
| 統合テスト           | `tests/integration/`               |
| E2E テスト           | `tests/e2e/`                       |
| テストセットアップ   | `tests/vitest.setup.ts`            |

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

## 命名規則

### ディレクトリ名

| 種類                 | 規則              | 例                         |
| -------------------- | ----------------- | -------------------------- |
| Route Group          | `(kebab-case)`    | `(public)`, `(private)`    |
| プライベートフォルダ | `_kebab-case`     | `_components`, `_utils`    |
| 機能フォルダ         | `kebab-case`      | `games`, `events`          |
| 動的ルート           | `[param]`         | `[id]`, `[userId]`         |

### ファイル名

| 種類               | 規則              | 例                         |
| ------------------ | ----------------- | -------------------------- |
| ページ             | `page.tsx`        | `page.tsx`                 |
| レイアウト         | `layout.tsx`      | `layout.tsx`               |
| コンポーネント     | `camelCase.tsx`   | `gameCard.tsx`             |
| フック             | `useCamelCase.ts` | `useGameData.ts`           |
| ユーティリティ     | `camelCase.ts`    | `formatDate.ts`            |
| Server Action      | `camelCase.ts`    | `createGame.ts`            |
| 型定義             | `types.ts`        | `types.ts`                 |
| 定数               | `constants.ts`    | `constants.ts`             |
| テスト             | `*.test.ts(x)`    | `gameCard.test.tsx`        |

### index.tsx の使用

コンポーネントディレクトリでは `index.tsx` を使用してエクスポートを簡潔にします。

```
src/app/_components/header/
├── index.tsx           # エクスポート & メインコンポーネント
├── headerLogo.tsx      # サブコンポーネント
└── headerMenu.tsx      # サブコンポーネント
```

---

## インポートルール

### パスエイリアス

`@/` エイリアスを使用し、相対パスでのインポートは禁止します。

```typescript
// Good
import { Header } from "@/app/_components/header";
import { prisma } from "@/lib/prisma";

// Bad
import { Header } from "../../_components/header";
import { prisma } from "../../../lib/prisma";
```

### インポート順序

1. React / Next.js
2. 外部ライブラリ
3. 内部モジュール（`@/` エイリアス）
4. 相対パス（同一ディレクトリ内のみ許可）
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

---

## 依存関係のルール

### レイヤー間の依存

```
ページ (Server Components)
    ↓ (OK)
Server Actions / _features
    ↓ (OK)
lib (Prisma)
    ↓ (OK)
generated (Prisma Client)
```

**禁止される依存**:

- `_components/` → `_actions/` (❌)
- `lib/` → `_features/` (❌)
- 循環依存 (❌)

### モジュール間の依存

**循環依存の禁止**:

```typescript
// ❌ 悪い例: 循環依存
// fileA.ts
import { funcB } from "./fileB";

// fileB.ts
import { funcA } from "./fileA"; // 循環依存
```

**解決策**:

```typescript
// ✅ 良い例: 共通モジュールの抽出
// shared.ts
export interface SharedType {
  /* ... */
}

// fileA.ts
import { SharedType } from "./shared";

// fileB.ts
import { SharedType } from "./shared";
```

---

## 環境変数

### ファイル構成

| ファイル           | 用途             | Git 管理 |
| ------------------ | ---------------- | -------- |
| `.env.local`       | ローカル開発用   | 除外     |
| `.env.preview`     | プレビュー環境用 | 除外     |
| `.env.production`  | 本番環境用       | 除外     |
| `.env.example`     | サンプル         | 含める   |

### 必要な環境変数

| 変数名         | 説明                   |
| -------------- | ---------------------- |
| `DATABASE_URL` | PostgreSQL 接続文字列  |
| `NEXTAUTH_URL` | NextAuth.js のベース URL |
| `NEXTAUTH_SECRET` | NextAuth.js のシークレット |

---

## 自動生成ファイル

以下のファイル/ディレクトリは自動生成されるため、手動で編集しないでください。

| パス                    | 生成コマンド           | 説明                 |
| ----------------------- | ---------------------- | -------------------- |
| `src/generated/prisma/` | `pnpm generate:client` | Prisma Client        |
| `.next/`                | `pnpm build`           | Next.js ビルド成果物 |
| `node_modules/`         | `pnpm install`         | 依存パッケージ       |
| `pnpm-lock.yaml`        | `pnpm install`         | ロックファイル       |

---

## 特殊ディレクトリ

### .steering/ (ステアリングファイル)

**役割**: 特定の開発作業における「今回何をするか」を定義

**構造**:

```
.steering/
└── [YYYYMMDD]-[task-name]/
    ├── requirements.md      # 今回の作業の要求内容
    ├── design.md            # 変更内容の設計
    └── tasklist.md          # タスクリスト
```

**命名規則**: `20250115-add-user-profile` 形式

### .claude/ (Claude Code 設定)

**役割**: Claude Code 設定とカスタマイズ

**構造**:

```
.claude/
├── commands/                # スラッシュコマンド
├── skills/                  # タスクモード別スキル
└── agents/                  # サブエージェント定義
```

---

## スケーリング戦略

### 機能の追加

新しい機能を追加する際の配置方針:

1. **小規模機能**: 既存ディレクトリに配置
2. **中規模機能**: `_features/` にサブディレクトリを作成
3. **大規模機能**: 独立したモジュールとして分離

**例**:

```
src/app/_features/
├── game/                    # 試合関連機能
│   ├── components/
│   ├── actions/
│   └── utils/
└── stats/                   # 成績関連機能
    ├── components/
    ├── actions/
    └── utils/
```

### ファイルサイズの管理

**ファイル分割の目安**:

- 1 ファイル: 300 行以下を推奨
- 300-500 行: リファクタリングを検討
- 500 行以上: 分割を強く推奨

---

## 除外設定

### .gitignore

プロジェクトで除外すべきファイル:

- `node_modules/`
- `.next/`
- `src/generated/`
- `.env.local`
- `.env.preview`
- `.env.production`
- `.steering/`
- `*.log`
- `.DS_Store`

---

## 更新履歴

| 日付       | 更新内容 | 更新者 |
| ---------- | -------- | ------ |
| 2025-01-12 | 初版作成 | -      |
