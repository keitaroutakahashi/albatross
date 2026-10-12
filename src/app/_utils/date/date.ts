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

const monthInJstFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Tokyo",
  month: "numeric",
});

/** 日本時間での月（1〜12）を返す。サーバーのタイムゾーンに依存しない */
export const getMonthInJst = (date: Date) =>
  Number(monthInJstFormatter.format(date));

const jstDateTimeFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const jstDayNameFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  weekday: "short",
});

/** `<input type="datetime-local">` 用に "2026-10-25T09:00"（日本時間）へ変換する */
export const toJstDateTimeLocal = (date: Date): string =>
  jstDateTimeFormatter.format(date).replace(" ", "T");

/**
 * `datetime-local` の値（"2026-10-25T09:00"）を日本時間として Date に変換する。
 * `new Date(value)` はサーバーのタイムゾーンで解釈されるため使わない。
 */
export const parseJstDateTimeLocal = (value: string): Date =>
  new Date(`${value}:00+09:00`);

/** "2026/10/25(日) 09:00" のように日本時間で表示用にフォーマットする */
export const formatJstDateTimeWithDay = (date: Date): string => {
  const [day, time] = jstDateTimeFormatter.format(date).split(" ");
  return `${day.replaceAll("-", "/")}(${jstDayNameFormatter.format(date)}) ${time}`;
};

/** 日本時間で date と同じ日になる範囲 [start, end) を返す */
export const getJstDayRange = (date: Date): { start: Date; end: Date } => {
  const day = toJstDateTimeLocal(date).slice(0, 10);
  const start = new Date(`${day}T00:00:00+09:00`);
  return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
};

/** 日本時間の暦日で、now が date と同じ日、またはそれ以降か（時刻は問わない） */
export const isOnOrAfterJstDay = (now: Date, date: Date): boolean =>
  toJstDateTimeLocal(now).slice(0, 10) >= toJstDateTimeLocal(date).slice(0, 10);
