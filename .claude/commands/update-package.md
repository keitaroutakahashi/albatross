# パッケージアップデート

pnpm を使用して全てのパッケージを最新バージョンにアップデートしてください。

## 手順

1. `pnpm update --latest` を実行して全パッケージを最新にアップデート
2. package.json を確認し、バージョン指定から `^` や `~` を削除して固定バージョンにする
3. `pnpm install` を実行して lockfile を更新
4. `pnpm lint` と `pnpm typecheck` を実行して問題がないか確認
5. 問題があれば修正を試みる
