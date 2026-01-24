# Albatross

野球チーム管理 Web アプリケーション

詳細は `docs/product-requirements.md` を参照。

## 技術スタック

| カテゴリ             | 技術                         |
| -------------------- | ---------------------------- |
| フレームワーク       | Next.js 16.x (App Router)    |
| UI                   | React 19.x, Tailwind CSS 4.x |
| 言語                 | TypeScript 5.x               |
| DB                   | PostgreSQL, Prisma 7.x       |
| リンター             | Biome, Knip                  |
| テスト               | Vitest, Testing Library      |
| パッケージマネージャ | pnpm                         |

## コマンド

```bash
# 開発
pnpm dev              # 開発サーバー起動（DB起動・マイグレーション含む）
pnpm build            # ビルド
pnpm start            # 本番サーバー起動

# コード品質
pnpm lint             # Biome + Knip でリント
pnpm typecheck        # 型チェック

# データベース
pnpm db:up            # Docker で PostgreSQL 起動
pnpm db:migrate       # マイグレーション実行
pnpm db:seed          # シードデータ投入
pnpm db:reset         # DB リセット
pnpm db:studio        # Prisma Studio 起動
pnpm generate:client  # Prisma Client 生成
```

## ディレクトリ構成

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # 公開ページ（games など）
│   ├── _components/       # 共通コンポーネント（header, footer）
│   └── _utils/            # ユーティリティ関数
├── generated/prisma/      # Prisma 生成ファイル（編集不可）
└── lib/                   # ライブラリ設定
prisma/
└── schema.prisma          # DB スキーマ定義
docs/                      # ドキュメント
```

## コーディング規約

- **インポートパス**: 相対パス (`./`, `../`) ではなく絶対パス (`@/`) を使用
- **フォーマット**: スペースインデント、行幅 80 文字（Biome）
- **コンポーネント**: LowerCase、プライベートは `_` プレフィックス
- **日本語**: コメントやドキュメントは日本語で記述

## 注意事項

- `src/generated/` 配下は自動生成ファイルのため編集禁止
- DB 操作前に `pnpm db:up` で Docker コンテナを起動すること
