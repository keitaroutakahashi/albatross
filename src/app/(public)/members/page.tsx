import type { Metadata } from "next";
import { Root } from "@/app/(public)/members/_components/root";

export const metadata: Metadata = {
  title: "メンバー一覧",
};

export default async function Page() {
  return <Root />;
}
