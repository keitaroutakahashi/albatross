# リポジトリ構造定義書（Repository Structure）

## 概要

草野球チーム Albatross（Alba）の管理 Web アプリケーションのリポジトリ構造を定義します。

---

## フォルダ・ファイル構成

```
albatross/
├── .claude/                    # Claude Code 設定
├── .github/                    # GitHub 設定
│   └── workflows/              # GitHub Actions ワークフロー
├── .vscode/                    # VS Code 設定
├── docs/                       # ドキュメント
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
│   └── vitest.setup.ts         # Vitest セットアップ
├── .env.local                  # 環境変数（ローカル）
├── .env.preview                # 環境変数（プレビュー）
├── .env.production             # 環境変数（本番）
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

## ディレクトリの役割

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

---

## ファイル配置ルール

### 1. コンポーネントの配置

| 種類                   | 配置場所                               |
| ---------------------- | -------------------------------------- |
| 全体共通コンポーネント | `src/app/_components/`                 |
| 機能共通コンポーネント | `src/app/_features/[feature]/components/` |
| ページ固有コンポーネント | `src/app/(public|private)/[feature]/_components/` |

### 2. Server Actions の配置

| 種類               | 配置場所                               |
| ------------------ | -------------------------------------- |
| 共通アクション     | `src/app/_actions/`                    |
| 機能固有アクション | `src/app/_features/[feature]/actions/` |

### 3. ユーティリティの配置

| 種類               | 配置場所                               |
| ------------------ | -------------------------------------- |
| 汎用ユーティリティ | `src/app/_utils/`                      |
| 機能固有ユーティリティ | `src/app/_features/[feature]/utils/` |

### 4. 型定義の配置

| 種類               | 配置場所                               |
| ------------------ | -------------------------------------- |
| グローバル型定義   | `src/app/globals.d.ts`                 |
| 機能固有型定義     | `src/app/_features/[feature]/types.ts` |
| Prisma 生成型      | `src/generated/prisma/`                |

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
| コンポーネント     | `PascalCase.tsx`  | `GameCard.tsx`             |
| フック             | `useCamelCase.ts` | `useGameData.ts`           |
| ユーティリティ     | `camelCase.ts`    | `formatDate.ts`            |
| Server Action      | `camelCase.ts`    | `createGame.ts`            |
| 型定義             | `types.ts`        | `types.ts`                 |
| 定数               | `constants.ts`    | `constants.ts`             |
| テスト             | `*.test.ts(x)`    | `GameCard.test.tsx`        |

### index.tsx の使用

コンポーネントディレクトリでは `index.tsx` を使用してエクスポートを簡潔にします。

```
src/app/_components/header/
├── index.tsx           # エクスポート & メインコンポーネント
├── HeaderLogo.tsx      # サブコンポーネント
└── HeaderMenu.tsx      # サブコンポーネント
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
import { GameCard } from "./GameCard";

// 5. 型インポート
import type { Game } from "@/generated/prisma";
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

---

## テストファイルの配置

### 配置ルール

| 種類                 | 配置場所                           |
| -------------------- | ---------------------------------- |
| ユニットテスト       | 対象ファイルと同じディレクトリ     |
| 統合テスト           | `tests/integration/`               |
| E2E テスト           | `tests/e2e/`                       |
| テストセットアップ   | `tests/vitest.setup.ts`            |

### 例

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

## 自動生成ファイル

以下のファイル/ディレクトリは自動生成されるため、手動で編集しないでください。

| パス                    | 生成コマンド         | 説明                 |
| ----------------------- | -------------------- | -------------------- |
| `src/generated/prisma/` | `pnpm generate:client` | Prisma Client      |
| `.next/`                | `pnpm build`         | Next.js ビルド成果物 |
| `node_modules/`         | `pnpm install`       | 依存パッケージ       |
| `pnpm-lock.yaml`        | `pnpm install`       | ロックファイル       |

---

## 更新履歴

| 日付       | 更新内容 | 更新者 |
| ---------- | -------- | ------ |
| 2025-01-11 | 初版作成 | -      |
