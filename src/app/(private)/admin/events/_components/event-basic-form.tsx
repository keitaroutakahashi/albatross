"use client";

import { CalendarClock, CloudSun, Sparkles, Swords, Video } from "lucide-react";
import { EVENT_TYPE_LABELS } from "@/app/_features/events/utils/event-type";
import { DateTimeField } from "@/app/(private)/admin/_components/date-time-field";
import {
  SelectField,
  TextareaField,
  TextField,
} from "@/app/(private)/admin/_components/form-fields";
import { FormSection } from "@/app/(private)/admin/_components/form-section";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import {
  eventStatusOptions,
  firstBattingOptions,
  gameTypeOptions,
  weatherOptions,
} from "@/app/(private)/admin/_utils/options";
import type { EventFormInitial } from "@/app/(private)/admin/events/_components/event-form-initial";

type Option = { value: string; label: string };

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  options: {
    seasons: Option[];
    leagues: Option[];
    grounds: Option[];
    opponents: Option[];
  };
  initial: EventFormInitial;
  deleteTarget: {
    name: string;
    warning?: string;
    action: () => Promise<ActionState>;
  };
};

/** 短い項目を横に 2 つ並べる */
const PairRow = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-3">{children}</div>
);

/**
 * イベントの基本情報。意味のまとまりごとにカードを分ける。
 * - 開催: いつ・どこで・状態
 * - 試合の設定（試合のみ）: 対戦相手・リーグ・試合種別など
 * - 天候 / 戦評・動画 / AI 講評（試合のみ）
 */
export const EventBasicForm = ({
  action,
  options,
  initial,
  deleteTarget,
}: Props) => {
  // 種別は登録後に変更できない（変えると試合・練習の子データが入れ替わるため）
  const { type } = initial;

  return (
    <FormShell action={action} deleteTarget={deleteTarget}>
      {(state) => (
        <>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-muted px-3 py-1 text-sm font-bold">
              {EVENT_TYPE_LABELS[type]}
            </span>
            <span className="text-xs text-muted-foreground">
              種別は変更できません
            </span>
            <input type="hidden" name="type" value={type} />
          </div>

          <FormSection title="開催" icon={CalendarClock}>
            <DateTimeField
              name="date"
              label="日時"
              state={state}
              required
              defaultValue={initial.date}
            />
            <PairRow>
              <SelectField
                name="status"
                label="状態"
                state={state}
                required
                options={eventStatusOptions}
                defaultValue={initial.status}
              />
              <SelectField
                name="seasonId"
                label="シーズン"
                state={state}
                required
                options={options.seasons}
                defaultValue={initial.seasonId}
              />
            </PairRow>
            <SelectField
              name="groundId"
              label="グラウンド"
              state={state}
              placeholder="未選択"
              options={options.grounds}
              defaultValue={initial.groundId}
            />
            <TextField
              name="note"
              label="備考"
              state={state}
              hint="例: 雨天中止"
              maxLength={200}
              defaultValue={initial.note}
            />
          </FormSection>

          {type === "game" && (
            <>
              <FormSection title="試合の設定" icon={Swords}>
                <SelectField
                  name="opponentId"
                  label="対戦相手"
                  state={state}
                  placeholder="未選択"
                  options={options.opponents}
                  defaultValue={initial.opponentId}
                />
                <SelectField
                  name="leagueId"
                  label="リーグ"
                  state={state}
                  placeholder="未選択"
                  options={options.leagues}
                  defaultValue={initial.leagueId}
                />
                <PairRow>
                  <SelectField
                    name="gameType"
                    label="試合種別"
                    state={state}
                    required
                    options={gameTypeOptions}
                    defaultValue={initial.gameType}
                  />
                  <SelectField
                    name="isFirstBatting"
                    label="先攻・後攻"
                    state={state}
                    placeholder="未定"
                    options={firstBattingOptions}
                    defaultValue={initial.isFirstBatting}
                  />
                </PairRow>
                <TextField
                  name="gameNumber"
                  label="試合番号"
                  state={state}
                  required
                  type="number"
                  inputMode="numeric"
                  hint="同日に複数試合がある場合は 2 試合目以降を 2, 3… にする"
                  defaultValue={initial.gameNumber}
                />
              </FormSection>

              <FormSection title="天候" icon={CloudSun}>
                <PairRow>
                  <SelectField
                    name="weather"
                    label="天気"
                    state={state}
                    placeholder="未設定"
                    options={weatherOptions}
                    defaultValue={initial.weather}
                  />
                  <TextField
                    name="temperature"
                    label="気温（℃）"
                    state={state}
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    defaultValue={initial.temperature}
                  />
                </PairRow>
              </FormSection>

              <FormSection title="戦評・動画" icon={Video}>
                <TextareaField
                  name="summary"
                  label="戦評"
                  state={state}
                  maxLength={2000}
                  defaultValue={initial.summary}
                />
                <TextField
                  name="videoUrl"
                  label="試合動画 URL"
                  state={state}
                  type="url"
                  placeholder="https://"
                  defaultValue={initial.videoUrl}
                />
              </FormSection>

              <FormSection title="AI 講評" icon={Sparkles}>
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
        </>
      )}
    </FormShell>
  );
};
