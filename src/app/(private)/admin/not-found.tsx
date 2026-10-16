import Link from "next/link";
import { Button } from "@/app/_components/shadcn/button";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-16">
      <p className="text-lg font-bold">データが見つかりません</p>
      <Button asChild>
        <Link href="/admin">管理トップへ</Link>
      </Button>
    </div>
  );
}
