import { PageTitle } from "@/app/_components/ui/page-title";
import { getMember } from "@/app/_features/members/api/get-members";
import { Profile } from "@/app/(public)/members/[id]/_components/profile";

type Props = {
  id: number;
};

export const Root = async ({ id }: Props) => {
  const member = await getMember(id);

  console.log(member);

  return (
    <div>
      <PageTitle title="MEMBERS" subtitle="メンバー" />

      <main className="py-6 px-3 flex flex-col gap-y-12">
        <Profile id={id} />
      </main>
    </div>
  );
};
