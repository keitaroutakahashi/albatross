"use client";

import { useState } from "react";
import { EVENT_TYPE_LABELS } from "@/app/_features/events/utils/event-type";
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
  eventTypeOptions,
  firstBattingOptions,
  gameTypeOptions,
  weatherOptions,
} from "@/app/(private)/admin/_utils/options";
import type { EventFormInitial } from "@/app/(private)/admin/events/_components/event-form-initial";
import type { EventType } from "@/generated/prisma/enums";

type Option = { value: string; label: string };

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  options: {
    seasons: Option[];
    leagues: Option[];
    grounds: Option[];
    opponents: Option[];
  };
  /** 編集時のみ指定する */
  initial?: EventFormInitial;
  deleteTarget?: {
    name: string;
    warning?: string;
    action: () => Promise<ActionState>;
  };
};

/** 自チーム・相手チームの同じ項目を横に並べる */
const PairRow = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-3">{children}</div>
);

export const EventForm = ({
  action,
  options,
  initial,
  deleteTarget,
}: Props) => {
  const isEdit = initial !== undefined;
  const [type, setType] = useState<EventType>(initial?.type ?? "game");

  return (
    <FormShell action={action} deleteTarget={deleteTarget}>
      {(state) => (
        <>
          <FormSection title="基本情報">
            {isEdit ? (
              // 種別は作成後に変更できないため、表示のみにして値だけ送る
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">種別</span>
                <p className="text-base">{EVENT_TYPE_LABELS[type]}</p>
                <input type="hidden" name="type" value={type} />
              </div>
            ) : (
              <SelectField
                name="type"
                label="種別"
                state={state}
                required
                options={eventTypeOptions}
                defaultValue={type}
                onChange={(value) => setType(value as EventType)}
              />
            )}
            <TextField
              name="date"
              label="日時"
              state={state}
              required
              type="datetime-local"
              defaultValue={initial?.date}
            />
            <SelectField
              name="status"
              label="状態"
              state={state}
              required
              options={eventStatusOptions}
              defaultValue={initial?.status ?? "scheduled"}
            />
            <SelectField
              name="seasonId"
              label="シーズン"
              state={state}
              required
              options={options.seasons}
              defaultValue={initial?.seasonId ?? options.seasons[0]?.value}
            />
            <TextField
              name="note"
              label="備考"
              state={state}
              hint="例: 雨天中止"
              maxLength={200}
              defaultValue={initial?.note}
            />
          </FormSection>

          {type === "practice" && (
            <FormSection title="練習情報">
              <SelectField
                name="groundId"
                label="グラウンド"
                state={state}
                placeholder="未選択"
                options={options.grounds}
                defaultValue={initial?.groundId}
              />
            </FormSection>
          )}

          {type === "game" && (
            <>
              <FormSection title="試合情報">
                <TextField
                  name="gameNumber"
                  label="試合番号"
                  state={state}
                  required
                  type="number"
                  inputMode="numeric"
                  hint="同日に複数試合がある場合は 2 試合目以降を 2, 3… にする"
                  defaultValue={initial?.gameNumber ?? "1"}
                />
                <SelectField
                  name="gameType"
                  label="試合種別"
                  state={state}
                  required
                  options={gameTypeOptions}
                  defaultValue={initial?.gameType ?? "undecided"}
                />
                <SelectField
                  name="isFirstBatting"
                  label="攻守"
                  state={state}
                  placeholder="未定"
                  options={firstBattingOptions}
                  defaultValue={initial?.isFirstBatting}
                />
                <SelectField
                  name="leagueId"
                  label="リーグ"
                  state={state}
                  placeholder="未選択"
                  options={options.leagues}
                  defaultValue={initial?.leagueId}
                />
                <SelectField
                  name="groundId"
                  label="グラウンド"
                  state={state}
                  placeholder="未選択"
                  options={options.grounds}
                  defaultValue={initial?.groundId}
                />
                <SelectField
                  name="opponentId"
                  label="対戦相手"
                  state={state}
                  placeholder="未選択"
                  options={options.opponents}
                  defaultValue={initial?.opponentId}
                />
              </FormSection>

              <FormSection title="試合結果">
                <p className="-mt-2 text-xs text-muted-foreground">
                  勝敗は得点から自動で設定されます。
                </p>
                <PairRow>
                  <TextField
                    name="teamScore"
                    label="得点（自）"
                    state={state}
                    type="number"
                    inputMode="numeric"
                    defaultValue={initial?.teamScore}
                  />
                  <TextField
                    name="opponentScore"
                    label="得点（相手）"
                    state={state}
                    type="number"
                    inputMode="numeric"
                    defaultValue={initial?.opponentScore}
                  />
                  <TextField
                    name="teamHits"
                    label="安打（自）"
                    state={state}
                    type="number"
                    inputMode="numeric"
                    defaultValue={initial?.teamHits}
                  />
                  <TextField
                    name="opponentHits"
                    label="安打（相手）"
                    state={state}
                    type="number"
                    inputMode="numeric"
                    defaultValue={initial?.opponentHits}
                  />
                  <TextField
                    name="teamErrors"
                    label="失策（自）"
                    state={state}
                    type="number"
                    inputMode="numeric"
                    defaultValue={initial?.teamErrors}
                  />
                  <TextField
                    name="opponentErrors"
                    label="失策（相手）"
                    state={state}
                    type="number"
                    inputMode="numeric"
                    defaultValue={initial?.opponentErrors}
                  />
                  <TextField
                    name="teamForfeitedRuns"
                    label="献上点（自）"
                    state={state}
                    type="number"
                    inputMode="numeric"
                    defaultValue={initial?.teamForfeitedRuns}
                  />
                  <TextField
                    name="opponentForfeitedRuns"
                    label="献上点（相手）"
                    state={state}
                    type="number"
                    inputMode="numeric"
                    defaultValue={initial?.opponentForfeitedRuns}
                  />
                </PairRow>
              </FormSection>

              <FormSection title="天候">
                <SelectField
                  name="weather"
                  label="天気"
                  state={state}
                  placeholder="未設定"
                  options={weatherOptions}
                  defaultValue={initial?.weather}
                />
                <TextField
                  name="temperature"
                  label="気温（℃）"
                  state={state}
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  defaultValue={initial?.temperature}
                />
              </FormSection>

              <FormSection title="戦評・動画">
                <TextareaField
                  name="summary"
                  label="戦評"
                  state={state}
                  maxLength={2000}
                  defaultValue={initial?.summary}
                />
                <TextField
                  name="videoUrl"
                  label="試合動画 URL"
                  state={state}
                  type="url"
                  placeholder="https://"
                  defaultValue={initial?.videoUrl}
                />
              </FormSection>

              <FormSection title="AI 講評">
                <TextareaField
                  name="aiGoodPoints"
                  label="良かった点"
                  state={state}
                  maxLength={2000}
                  defaultValue={initial?.aiGoodPoints}
                />
                <TextareaField
                  name="aiBadPoints"
                  label="改善点"
                  state={state}
                  maxLength={2000}
                  defaultValue={initial?.aiBadPoints}
                />
              </FormSection>
            </>
          )}
        </>
      )}
    </FormShell>
  );
};
