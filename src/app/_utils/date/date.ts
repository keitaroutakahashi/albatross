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

export const getCurrentSeason = () => {
  const now = new Date();
  const month = Number(format(now, "M"));
  const year = format(now, "YYYY");

  return month <= 2 ? String(Number(year) - 1) : year;
};
