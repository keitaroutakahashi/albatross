import Link from "next/link";
import { SectionGroup } from "@/app/_components/ui/section-group";
import type { GameDetail } from "@/app/_features/games/api/get-games";

type Props = {
  game: GameDetail;
};

export const BenchLineup = ({ game }: Props) => {
  const benchMembers = game.gameMembers.filter(
    (gm) => gm.memberType === "bench",
  );

  return (
    <SectionGroup title="ベンチ入りメンバー">
      <div className="bg-gray-50 p-4 rounded">
        <ul className="grid grid-cols-2 gap-2">
          {benchMembers.map((member) => (
            <li
              key={member.id}
              className="flex items-center text-sm @content:text-base border-b border-gray-300 pb-2 @content:pb-3 last:border-b-0 last:pb-0 [&:nth-last-child(2):nth-child(odd)]:border-b-0 [&:nth-last-child(2):nth-child(odd)]:pb-0"
            >
              <span className="font-bold text-primary">
                {member.member.uniformNumber}
              </span>
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
