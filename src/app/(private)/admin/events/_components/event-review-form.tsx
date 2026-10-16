"use client";

import { Cloud, CloudRain, Snowflake, Sun } from "lucide-react";
import Link from "next/link";
import { weatherLabel } from "@/app/_constants/labels";
import {
  SegmentedField,
  TextareaField,
  TextField,
} from "@/app/(private)/admin/_components/form-fields";
import { FormSection } from "@/app/(private)/admin/_components/form-section";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { MvpField } from "@/app/(private)/admin/events/_components/mvp-field";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  eventId: number;
  /** MVP に選べる、この試合の参加メンバー */
  mvpCandidates: { value: string; label: string }[];
  initial: {
    weather: string;
    temperature: string;
    summary: string;
    videoUrl: string;
    aiGoodPoints: string;
    aiBadPoints: string;
    /** 保存済みの MVP（表示順） */
    mvps: { memberId: string; comment: string }[];
  };
};

/** 天気は、未設定に戻せるようにする */
const weatherSegments = [
  { value: "", label: "未設定" },
  { value: "sunny", label: weatherLabel.sunny, icon: Sun },
  { value: "cloudy", label: weatherLabel.cloudy, icon: Cloud },
  { value: "rainy", label: weatherLabel.rainy, icon: CloudRain },
  { value: "snowy", label: weatherLabel.snowy, icon: Snowflake },
];

/** 試合の振り返り（試合のみ）。天候・戦評・動画・MVP・AI 講評 */
export const EventReviewForm = ({
  action,
  eventId,
  mvpCandidates,
  initial,
}: Props) => {
  return (
    <FormShell action={action}>
      {(state) => (
        <>
          <FormSection title="天候">
            <SegmentedField
              name="weather"
              label="天気"
              state={state}
              stacked
              options={weatherSegments}
              defaultValue={initial.weather}
            />
            <TextField
              name="temperature"
              label="気温（℃）"
              state={state}
              type="number"
              inputMode="decimal"
              step="0.1"
              hint="気温を入力するときは、天気も選んでください"
              defaultValue={initial.temperature}
            />
          </FormSection>

          <FormSection title="戦評">
            <TextareaField
              name="summary"
              label="戦評"
              state={state}
              maxLength={2000}
              defaultValue={initial.summary}
            />
          </FormSection>

          <FormSection title="動画">
            <TextField
              name="videoUrl"
              label="試合動画 URL"
              state={state}
              type="url"
              placeholder="https://"
              hint="YouTube の動画 URL（共有で出る URL でも可）"
              defaultValue={initial.videoUrl}
            />
          </FormSection>

          <FormSection title="MVP">
            {mvpCandidates.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                MVP は参加メンバーの中から選びます。先に
                <Link
                  href={`/admin/events/${eventId}/members`}
                  className="mx-1 font-bold text-foreground underline underline-offset-2"
                >
                  参加メンバー
                </Link>
                を入力してください。
              </p>
            ) : (
              <MvpField
                state={state}
                candidates={mvpCandidates}
                initial={initial.mvps}
              />
            )}
          </FormSection>

          <FormSection title="AI 講評">
            <TextareaField
              name="aiGoodPoints"
              label="良かった点"
              state={state}
              maxLength={2000}
              defaultValue={initial.aiGoodPoints}
            />
            <TextareaField
              name="aiBadPoints"
              label="改善点"
              state={state}
              maxLength={2000}
              defaultValue={initial.aiBadPoints}
            />
          </FormSection>
        </>
      )}
    </FormShell>
  );
};
