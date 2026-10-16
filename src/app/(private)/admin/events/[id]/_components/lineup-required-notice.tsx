import Link from "next/link";
import { Button } from "@/app/_components/shadcn/button";

/** 打席・投手の成績はオーダーの選手に紐づくため、先にオーダーの登録が必要なことを伝える */
export const LineupRequiredNotice = ({ eventId }: { eventId: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-12 text-center">
      <p className="text-base font-bold">先に「オーダー」を登録してください</p>
      <Button asChild size="lg" className="h-12">
        <Link href={`/admin/events/${eventId}/lineup`}>オーダーを登録する</Link>
      </Button>
    </div>
  );
};
