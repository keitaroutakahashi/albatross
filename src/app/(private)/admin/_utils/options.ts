import {
  atBatResultFullLabel,
  eventStatusLabel,
  gameTypeLabel,
  handLabel,
  memberCategoryLabel,
  pitchingDecisionLabel,
  positionFullLabel,
  positionLabel,
  userRoleLabel,
  weatherLabel,
} from "@/app/_constants/labels";
import { EVENT_TYPE_LABELS } from "@/app/_features/events/utils/event-type";

type Option = { value: string; label: string };

const toOptions = (labels: Record<string, string>): Option[] =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

export const positionOptions = toOptions(positionFullLabel);

/** 打順表など、幅が限られる画面で使う省略形（投・捕・一…） */
export const positionShortOptions = toOptions(positionLabel);

export const memberCategoryOptions = toOptions(memberCategoryLabel);

export const throwHandOptions = toOptions(handLabel).map((o) => ({
  ...o,
  label: `${o.label}投`,
}));

export const batHandOptions = toOptions(handLabel).map((o) => ({
  ...o,
  label: `${o.label}打`,
}));

export const eventTypeOptions = toOptions(EVENT_TYPE_LABELS);

export const eventStatusOptions = toOptions(eventStatusLabel);

export const gameTypeOptions = toOptions(gameTypeLabel);

export const weatherOptions = toOptions(weatherLabel);

export const firstBattingOptions = [
  { value: "true", label: "先攻" },
  { value: "false", label: "後攻" },
];

export const atBatResultOptions = toOptions(atBatResultFullLabel);

export const pitchingDecisionOptions = toOptions(pitchingDecisionLabel);

/** 途中交代時のアウト数（イニング間交代は未設定） */
export const partialOutsOptions = [
  { value: "0", label: "0アウト" },
  { value: "1", label: "1アウト" },
  { value: "2", label: "2アウト" },
];

/** ロールごとに使える機能の目安を併記する（実際の権限は permissions.ts で決める） */
export const userRoleOptions = [
  { value: "admin", label: `${userRoleLabel.admin}（すべての機能）` },
  { value: "operator", label: `${userRoleLabel.operator}（イベントのみ）` },
];
