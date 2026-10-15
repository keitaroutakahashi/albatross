import Link from "next/link";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { MvpGameRow } from "@/app/_features/members/api/get-member-stats";

type Props = {
  rows: MvpGameRow[];
};

/** MVP を獲得した回数と、その試合 */
export const MvpGames = ({ rows }: Props) => (
  <SubSectionGroup title="MVP">
    {rows.length === 0 ? (
      <p className="text-sm text-gray-500">MVP の記録がありません</p>
    ) : (
      <div className="flex flex-col gap-y-3">
        <p className="text-sm">
          獲得回数 <span className="text-xl font-bold">{rows.length}</span> 回
        </p>
        <ul className="border-t">
          {rows.map((row) => (
            <li key={row.eventId}>
              <Link
                href={`/events/${row.eventId}`}
                className="block border-b p-3 text-sm hover:opacity-70"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-gray-500">{row.date}</span>
                  <span className="font-medium">
                    {row.opponentName ?? "対戦相手未定"}
                  </span>
                </span>
                {row.comment && (
                  <span className="mt-1 block whitespace-pre-wrap text-gray-700">
                    {row.comment}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}
  </SubSectionGroup>
);
