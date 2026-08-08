import { format } from "@formkit/tempo";

const localeJa = "ja";
const localeEn = "en";

export const formatAsMDWithColon = (dateString: string | Date) => {
  const date = new Date(dateString);
  return format(date, "M.D", localeJa);
};

export const formatToShortDayNameEn = (dateString: string | Date) => {
  const date = new Date(dateString);
  return format(date, "ddd", localeEn);
};

/** 曜日のインデックスを返す（0: 日曜, 6: 土曜） */
export const getDayOfWeek = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.getDay();
};

export const formatAsYYYY = (dateString: string | Date) => {
  const date = new Date(dateString);
  return format(date, "YYYY", localeJa);
};

/** "04.06" のように月日をフォーマットする */
export const formatAsMMDDWithDot = (dateString: string | Date) => {
  const date = new Date(dateString);
  return format(date, "MM.DD", localeJa);
};

/** "2025.04.06" のように日付をフォーマットする */
export const formatAsYYYYMMDDWithDot = (dateString: string | Date) => {
  const date = new Date(dateString);
  return format(date, "YYYY.MM.DD", localeJa);
};

/** "2025年4月6日" のように日付をフォーマットする */
export const formatAsFullDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return format(date, "YYYY年M月D日", localeJa);
};

/** "日" のように曜日を返す */
export const formatAsDayName = (dateString: string | Date) => {
  const date = new Date(dateString);
  return format(date, "d", localeJa);
};

/** "14:30" のように24時間表記で時刻を返す */
export const formatAsTime24 = (dateString: string | Date) => {
  const date = new Date(dateString);
  return format(date, "HH:mm", localeJa);
};

export const getCurrentSeason = () => {
  const now = new Date();
  const month = Number(format(now, "M"));
  const year = format(now, "YYYY");

  return month <= 2 ? String(Number(year) - 1) : year;
};
