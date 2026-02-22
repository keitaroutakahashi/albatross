import Link from "next/link";
import type { Member } from "@/generated/prisma/client";

type Props = {
  member: Member;
};

export const MemberItem = ({ member }: Props) => {
  return (
    <Link href={`/members/${member.id}`} className="flex items-center gap-x-2">
      <p className="text-gray-500 font-bold w-8 text-center">
        {member.uniformNumber}
      </p>
      <p className="text-primary font-bold">{member.name}</p>
    </Link>
  );
};
