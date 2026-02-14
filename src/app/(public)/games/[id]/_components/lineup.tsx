import type { GameWithRelations } from "@/app/_features/games/api/getGames";
import { positionLabel } from "@/app/_features/games/constants/labels";
import { SectionHeader } from "@/app/(public)/games/[id]/_components/sectionHeader";

type Props = {
  members: GameWithRelations["gameMembers"];
  title: string;
};

export const Lineup = ({ members, title }: Props) => {
  console.log("members", members);
  return (
    <section className="mb-6">
      <SectionHeader text={title} />
      <div className="bg-gray-50 p-4 rounded">
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center text-sm border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
            >
              {member.battingOrder && (
                <span className="w-8 font-bold text-gray-700">
                  {member.battingOrder}
                </span>
              )}
              {member.position && (
                <span className="w-8 text-center text-gray-500">
                  {positionLabel[member.position]}
                </span>
              )}
              <span className="flex-1 font-medium">{member.member.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
