"use client";

import { Checkbox } from "@/app/_components/shadcn/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/shadcn/select";
import { HintTooltip } from "@/app/_components/ui/hint-tooltip";
import type { SeasonModel } from "@/generated/prisma/models/Season";

/** 打者・投手成績ページで共通利用する指標カテゴリの定義 */
export type StatsCategory = {
  key: string;
  label: string;
};

type Props = {
  seasons: SeasonModel[];
  season: string;
  onSeasonChange: (season: string) => void;
  categories: readonly StatsCategory[];
  categoryKey: string;
  onCategoryChange: (key: string) => void;
  qualifiedOnly: boolean;
  onQualifiedChange: (checked: boolean) => void;
  /** 規定打席・規定投球回チェックボックスのラベル */
  qualifiedLabel: string;
  /** 規定打席・規定投球回の説明文（指定するとヒントアイコンを表示する） */
  qualifiedHint?: string;
  /** 選択中の指標に規定条件が適用されない場合はチェックボックスを操作不可にする */
  qualifiedDisabled?: boolean;
  /** 年度切替中などデータ再取得中は true にして操作を止める */
  disabled?: boolean;
};

/**
 * 打者・投手成績ページ共通のフィルタバー。
 * 年度・指標の Select と、規定打席（規定投球回）チェックボックスを並べる。
 */
export const StatsFilterBar = ({
  seasons,
  season,
  onSeasonChange,
  categories,
  categoryKey,
  onCategoryChange,
  qualifiedOnly,
  onQualifiedChange,
  qualifiedLabel,
  qualifiedHint,
  qualifiedDisabled = false,
  disabled = false,
}: Props) => {
  return (
    <div className="flex flex-col gap-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={season}
          onValueChange={onSeasonChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="年度を選択" />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((s) => (
              <SelectItem key={s.id} value={String(s.season)}>
                {s.season} シーズン
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={categoryKey}
          onValueChange={onCategoryChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="項目を選択" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.key} value={category.key}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-x-1.5">
        <label
          htmlFor="stats-filter-bar-qualified"
          className={`flex items-center gap-x-2 text-sm${
            qualifiedDisabled ? " text-gray-400" : ""
          }`}
        >
          <Checkbox
            id="stats-filter-bar-qualified"
            checked={qualifiedOnly}
            onCheckedChange={(checked) => onQualifiedChange(checked === true)}
            disabled={disabled || qualifiedDisabled}
          />
          {qualifiedLabel}
        </label>
        {qualifiedHint && <HintTooltip text={qualifiedHint} />}
      </div>
    </div>
  );
};
