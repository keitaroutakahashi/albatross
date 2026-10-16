import { SectionGroup } from "@/app/_components/ui/section-group";
import type { PracticeDetail } from "@/app/_features/events/api/get-events";

type Props = {
  practice: PracticeDetail;
};

export const PracticeMembers = ({ practice }: Props) => {
  const { practiceMembers } = practice;

  if (practiceMembers.length === 0) {
    return null;
  }

  return (
    <SectionGroup title={`参加メンバー（${practiceMembers.length}名）`}>
      <div className="bg-gray-50 p-4 rounded">
        <ul className="grid grid-cols-2 gap-2">
          {practiceMembers.map(({ id, member }) => (
            <li
              key={id}
              className="flex items-center text-sm @content:text-base border-b border-gray-300 pb-2 @content:pb-3 last:border-b-0 last:pb-0 [&:nth-last-child(2):nth-child(odd)]:border-b-0 [&:nth-last-child(2):nth-child(odd)]:pb-0"
            >
              <span className="font-bold text-primary">
                {member.uniformNumber}
              </span>
              <span className="pl-4">{member.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionGroup>
  );
};
