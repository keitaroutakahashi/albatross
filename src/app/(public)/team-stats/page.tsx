import type { Metadata } from "next";
import { Root } from "@/app/(public)/team-stats/_components/root";

export const metadata: Metadata = {
  title: "チーム成績",
};

export default async function Page() {
  return <Root />;
}
