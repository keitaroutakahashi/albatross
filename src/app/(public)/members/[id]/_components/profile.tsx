import { DescriptionList } from "@/app/_components/ui/description-list";
import { SectionGroup } from "@/app/_components/ui/section-group";
import { handLabel, positionLabel } from "@/app/_constants/labels";
import { getMember } from "@/app/_features/members/api/get-members";

type Props = {
  id: number;
};

export const Profile = async ({ id }: Props) => {
  const member = await getMember(id);
  const profileList = [
    { id: "name", title: "名前", description: member.name },
    {
      id: "uniformNumber",
      title: "背番号",
      description: member.uniformNumber,
    },
    {
      id: "position",
      title: "ポジション",
      description: positionLabel[member.position],
    },
    {
      id: "subPositions",
      title: "サブポジション",
      description:
        member.subPositions.map((p) => positionLabel[p]).join("、") || "",
    },
    {
      id: "batThrow",
      title: "投/打",
      description: `${handLabel[member.batHand]} / ${handLabel[member.throwHand]}`,
    },
  ];

  return (
    <SectionGroup title="プロフィール">
      <DescriptionList items={profileList} />
    </SectionGroup>
  );
};
