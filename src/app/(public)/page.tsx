import Link from "next/link";
import { Hero } from "@/app/(public)/_components/hero";

export default function Page() {
  return (
    <div className="">
      <Hero />
      <div className="">
        <Link href="/games">試合一覧</Link>
        <Link href="/members">メンバー一覧</Link>
      </div>
    </div>
  );
}
