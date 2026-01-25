---
description: "新しいページのテンプレートファイルを作成する"
---

## やること

- 引数で指定した名前で新しいテンプレートファイルを作成する
- 作成するディレクトリは、`src/app/$ARGUMENTS`
- 作成するファイルは、`src/app/$ARGUMENTS/page.tsx`, `src/app/$ARGUMENTS/_components/root.tsx`

## ファイルの内容

### `src/app/$ARGUMENTS/page.tsx`

```tsx
import { PageTitle } from "@/app/_components/ui/pageTitle";
import { Root } from "@/app/$ARGUMENTS/_components/root";

export default async function Page() {
  return (
    <div>
      <PageTitle title="TEST" subtitle="テスト" />
      <Root />
    </div>
  );
}
```
