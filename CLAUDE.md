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
│   ├── (public)/          # 公開ページ
│   │   └── games/
│   │       ├── _components/  # games 専用コンポーネント
│   │       ├── _data/        # データ取得関数
│   │       └── [id]/         # 試合詳細ページ
│   ├── (private)/         # 認証が必要なページ
│   ├── _actions/          # Server Actions
│   ├── _components/       # 共通コンポーネント（header, footer）
│   ├── _features/         # 機能別コンポーネント
│   ├── _hooks/            # カスタムフック
│   └── _utils/            # ユーティリティ関数
├── generated/prisma/      # Prisma 生成ファイル（編集不可）
└── lib/                   # ライブラリ設定
prisma/
├── schema.prisma          # DB スキーマ定義
├── seed.ts                # シードデータ実行エントリ
├── seeds/                 # シードデータ（テーブル毎）
└── migrations/            # マイグレーションファイル
docs/                      # ドキュメント
```

## コーディング規約

### 共通

- コメントやドキュメントは日本語で記述
- 相対パス (`./`, `../`) ではなく絶対パス (`@/`) を使用
- スペースインデント、行幅 80 文字（Biome）

### FrontEnd

- コンポーネント名は、LowerCase、プライベートは `_` プレフィックス

### Database

- enum を使う場合は小文字にする

## 注意事項

- `src/generated/` 配下は自動生成ファイルのため編集禁止
- DB 操作前に `pnpm db:up` で Docker コンテナを起動すること
