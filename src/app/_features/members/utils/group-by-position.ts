import type { getMembers } from "@/app/_features/members/api/get-members";

type Member = Awaited<ReturnType<typeof getMembers>>[number];

type GroupedMembers = {
  pitchers: Member[];
  catchers: Member[];
  infielders: Member[];
  outfielders: Member[];
};

const INFIELD_POSITIONS = ["first", "second", "third", "shortstop"];
const OUTFIELD_POSITIONS = ["left", "center", "right"];

/** メンバーをポジションカテゴリ別にグループ化する */
export function groupByPosition(members: Member[]): GroupedMembers {
  const result: GroupedMembers = {
    pitchers: [],
    catchers: [],
    infielders: [],
    outfielders: [],
  };

  for (const member of members) {
    const pos = member.position;
    if (pos === "pitcher") {
      result.pitchers.push(member);
    } else if (pos === "catcher") {
      result.catchers.push(member);
    } else if (pos && INFIELD_POSITIONS.includes(pos)) {
      result.infielders.push(member);
    } else if (pos && OUTFIELD_POSITIONS.includes(pos)) {
      result.outfielders.push(member);
    }
  }

  return result;
}
