import Link from "next/link";
import { Button } from "@/app/_components/shadcn/button";

/** 打席・投手の成績は出場した選手に紐づくため、先に選手の登録が必要なことを伝える */
export const LineupRequiredNotice = ({ eventId }: { eventId: number }) => {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-12 text-center">
      <p className="text-base font-bold">
        先に「出場した選手」を登録してください
      </p>
      <Button asChild size="lg" className="h-12">
        <Link href={`/admin/events/${eventId}/lineup`}>
          出場した選手を登録する
        </Link>
      </Button>
    </div>
  );
};
