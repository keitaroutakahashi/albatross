"use client";

import Link from "next/link";
import { Button } from "@/app/_components/shadcn/button";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-16">
      <p className="text-lg font-bold">エラーが発生しました</p>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => reset()}>
          再読み込み
        </Button>
        <Button asChild>
          <Link href="/admin">管理トップへ</Link>
        </Button>
      </div>
    </div>
  );
}
