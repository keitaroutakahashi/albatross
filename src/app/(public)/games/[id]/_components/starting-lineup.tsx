import Link from "next/link";
import type { GameDetail } from "@/app/_features/games/api/get-games";
import { positionLabel } from "@/app/_features/games/constants/labels";
import { SectionGroup } from "@/app/(public)/games/[id]/_components/section-group";

type Props = {
  game: GameDetail;
};

export const StartingLineup = ({ game }: Props) => {
  const startingMembers = game.gameMembers.filter(
    (gm) => gm.memberType === "starting",
  );

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
              <Link href="/" className="pl-4 underline underline-offset-2">
                {member.member.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SectionGroup>
  );
};
