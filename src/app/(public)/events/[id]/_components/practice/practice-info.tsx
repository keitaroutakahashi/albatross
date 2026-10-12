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
          <>
            <p className="text-sm">{ground.name}</p>
            <p className="text-xs mt-2 text-gray-500">{ground.address}</p>
            {ground.access && (
              <p className="text-xs mt-1 text-gray-500">{ground.access}</p>
            )}
            <a
              href={ground.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs mt-2 inline-block underline underline-offset-2 hover:opacity-70"
            >
              公式サイト
            </a>
          </>
        ) : (
          <p className="text-sm">会場未定</p>
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
