import Link from "next/link";
import { Button } from "@/app/_components/shadcn/button";
import { Badge } from "@/app/(private)/admin/_components/badge";
import { ListCard } from "@/app/(private)/admin/_components/list-card";
import {
  findNextStep,
  type ProgressStep,
} from "@/app/(private)/admin/_utils/event-progress";

type Props = {
  eventId: number;
  heading: string;
  steps: ProgressStep[];
  /** 順番に入力する項目のとき、見出しに 1. 2. … の番号を付ける */
  numbered: boolean;
};

/** 次に入力する項目へのボタンと、各項目の入力状況の一覧 */
export const EventSteps = ({ eventId, heading, steps, numbered }: Props) => {
  const next = findNextStep(steps);

  return (
    <>
      {next && (
        <div className="p-4">
          <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-xs font-bold text-muted-foreground">
              次にやること
            </p>
            <Button asChild size="lg" className="h-12">
              <Link href={`/admin/events/${eventId}/${next.path}`}>
                「{next.title}」を入力する
              </Link>
            </Button>
          </div>
        </div>
      )}
      <section>
        <h2 className="px-4 pt-4 pb-2 text-base font-bold">{heading}</h2>
        <ul className="border-t">
          {steps.map((step, index) => (
            <ListCard
              key={step.path}
              href={`/admin/events/${eventId}/${step.path}`}
              title={numbered ? `${index + 1}. ${step.title}` : step.title}
              description={
                (step.done ? null : step.blockedBy) ?? step.description
              }
              trailing={
                step.done ? (
                  <Badge tone="success">{step.summary}</Badge>
                ) : (
                  <Badge tone="muted">未入力</Badge>
                )
              }
            />
          ))}
        </ul>
      </section>
    </>
  );
};
