import { PageTitle } from "@/app/_components/ui/page-title";
import { ALL_SEASONS } from "@/app/_constants/stats";
import { getMemberStats } from "@/app/_features/members/api/get-member-stats";
import { getMember } from "@/app/_features/members/api/get-members";
import { getSeasons } from "@/app/_features/seasons/api/get-seasons";
import { Profile } from "@/app/(public)/members/[id]/_components/profile";
import { Stats } from "@/app/(public)/members/[id]/_components/stats";

type Props = {
  id: number;
};

export const Root = async ({ id }: Props) => {
  const member = await getMember(id);
  const [seasons, stats] = await Promise.all([
    getSeasons(),
    getMemberStats(id, ALL_SEASONS),
  ]);

  return (
    <div>
      <PageTitle title="MEMBERS" subtitle="メンバー" />

      <main className="py-6 px-3 flex flex-col gap-y-12">
        <Profile id={id} />
        <Stats memberId={id} seasons={seasons} initialStats={stats} />
      </main>
    </div>
  );
};
