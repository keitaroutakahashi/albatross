import type { Metadata } from "next";
import { Root } from "@/app/(public)/pitching-stats/_components/root";

export const metadata: Metadata = {
  title: "投手成績",
};

export default async function Page() {
  return <Root />;
}
