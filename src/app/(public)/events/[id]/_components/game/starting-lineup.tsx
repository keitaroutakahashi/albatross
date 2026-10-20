import Link from "next/link";
import { SectionGroup } from "@/app/_components/ui/section-group";
import { positionLabel } from "@/app/_constants/labels";
import type { GameDetail } from "@/app/_features/games/api/get-games";

type Props = {
  game: GameDetail;
};

export const StartingLineup = ({ game }: Props) => {
  const startingMembers = game.gameMembers.filter(
    (gm) => gm.memberType === "starting",
  );

  // 終了した試合は、情報があるものだけを表示する
  if (game.event.status === "completed" && startingMembers.length === 0) {
    return null;
  }

  return (
    <SectionGroup title="スターティングメンバー">
      <div className="bg-gray-50 p-4 rounded">
        <ul className="space-y-2 @content:space-y-3">
          {startingMembers.map((member) => (
            <li
              key={member.id}
              className="flex items-center text-sm @content:text-base border-b border-gray-300 pb-2 @content:pb-3 last:border-b-0 last:pb-0"
            >
              <span className="w-10 text-center font-bold text-primary">
                {member.battingOrder}
              </span>
              {member.position && (
                <span className="w-10 text-center text-gray-600">
                  {positionLabel[member.position]}
                </span>
              )}
              {member.member.category === "guest" ? (
                <span className="pl-4">{member.member.name}</span>
              ) : (
                <Link
                  href={`/members/${member.memberId}`}
                  className="pl-4 underline underline-offset-2"
                >
                  {member.member.name}
                </Link>
              )}
              {member.member.uniformNumber && (
                <span className="pl-2 text-xs @content:text-sm text-gray-500">
                  #{member.member.uniformNumber}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </SectionGroup>
  );
};
