import { PageTitle } from "@/app/_components/ui/page-title";
import { SectionGroup } from "@/app/_components/ui/section-group";
import { getMembers } from "@/app/_features/members/api/get-members";
import { groupByPosition } from "@/app/_features/members/utils/group-by-position";
import { MemberItem } from "@/app/(public)/members/_components/member-item";

export const Root = async () => {
  const members = await getMembers();
  const groupedMembers = groupByPosition(members);

  return (
    <div>
      <PageTitle title="MEMBERS" subtitle="メンバー" />

      <main className="py-6 px-3 flex flex-col gap-y-12">
        <SectionGroup title="投手">
          <div className="flex flex-col gap-y-4">
            {groupedMembers.pitchers.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        </SectionGroup>
        <SectionGroup title="捕手">
          <div className="flex flex-col gap-y-4">
            {groupedMembers.catchers.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        </SectionGroup>
        <SectionGroup title="内野手">
          <div className="flex flex-col gap-y-4">
            {groupedMembers.infielders.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        </SectionGroup>
        <SectionGroup title="外野手">
          <div className="flex flex-col gap-y-4">
            {groupedMembers.outfielders.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        </SectionGroup>
      </main>
    </div>
  );
};
