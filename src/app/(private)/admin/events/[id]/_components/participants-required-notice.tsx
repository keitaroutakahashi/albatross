import Link from "next/link";
import { Button } from "@/app/_components/shadcn/button";

/** オーダーは参加メンバーの中から選ぶため、先に参加メンバーの登録が必要なことを伝える */
export const ParticipantsRequiredNotice = ({
  eventId,
}: {
  eventId: number;
}) => {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-12 text-center">
      <p className="text-base font-bold">
        先に「参加メンバー」を登録してください
      </p>
      <Button asChild size="lg" className="h-12">
        <Link href={`/admin/events/${eventId}/members`}>
          参加メンバーを登録する
        </Link>
      </Button>
    </div>
  );
};
