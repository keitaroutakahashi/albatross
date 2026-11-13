import type { Metadata } from "next";
import { Root } from "@/app/(public)/contribution-stats/_components/root";

export const metadata: Metadata = {
  title: "貢献度",
};

export default async function Page() {
  return <Root />;
}
