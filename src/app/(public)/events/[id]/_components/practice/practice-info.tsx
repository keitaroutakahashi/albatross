import { SectionGroup } from "@/app/_components/ui/section-group";
import { SubSectionGroup } from "@/app/_components/ui/sub-section-group";
import type { PracticeDetail } from "@/app/_features/events/api/get-events";

type Props = {
  practice: PracticeDetail;
};

export const PracticeInfo = ({ practice }: Props) => {
  const { ground, event } = practice;

  return (
    <SectionGroup title="練習情報">
      <SubSectionGroup title="グラウンド">
        {ground ? (
          <div>
            <a
              href={ground.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold underline underline-offset-2 hover:opacity-70"
            >
              {ground.name}
            </a>
            <p className="text-xs text-gray-500 mt-1">( {ground.address} )</p>
            <p className="text-xs mt-2 text-gray-700">{ground.access}</p>
          </div>
        ) : (
          <p className="text-sm font-semibold">会場未定</p>
        )}
      </SubSectionGroup>

      {event.note && (
        <SubSectionGroup title="メモ">
          <p className="text-sm whitespace-pre-wrap">{event.note}</p>
        </SubSectionGroup>
      )}
    </SectionGroup>
  );
};
