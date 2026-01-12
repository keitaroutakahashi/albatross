import { format } from "@formkit/tempo";

const localeJa = "ja";
const localeEn = "en";

export const formatAsMDWithColon = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "M.D", localeJa);
};

export const formatToShortDayNameEn = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "ddd", localeEn);
};

export const formatAsYYYY = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "YYYY", localeJa);
};
