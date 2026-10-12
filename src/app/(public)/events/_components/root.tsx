import { Suspense } from "react";
import { PageTitle } from "@/app/_components/ui/page-title";
import { EventFilter } from "@/app/(public)/events/_components/event-filter";
import { EventList } from "@/app/(public)/events/_components/event-list";

type Props = {
  season?: string;
  type?: string;
};

export const Root = async ({ season, type }: Props) => {
  return (
    <div>
      <PageTitle title="EVENT" subtitle="イベント情報" />

      <main className="py-10">
        <div className="flex justify-center">
          <Suspense fallback={<div>Loading...</div>}>
            <EventFilter />
          </Suspense>
        </div>

        <div className="px-5 mt-10">
          <EventList season={season} type={type} />
        </div>
      </main>
    </div>
  );
};
