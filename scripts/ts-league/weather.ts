/**
 * 試合の天気と気温を、グラウンドの位置と試合の日時から求める。
 * 観測データは Open-Meteo（キー不要）の過去の天気。試合の時間帯の数時間分を見る。
 */
import type { Weather } from "@/generated/prisma/enums";

const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";

/** 試合の長さの目安。開始時刻の時間から、この時間数分（開始時刻の時間を含む）を見る */
const GAME_HOURS = 2;

type Hour = { temperature: number; code: number };

/** グラウンドの Google マップ埋め込み URL（`!2d<経度>!3d<緯度>`）から位置を取り出す */
export const parseCoordinates = (mapEmbedUrl: string | null) => {
  const m = mapEmbedUrl?.match(/!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/);
  return m ? { longitude: Number(m[1]), latitude: Number(m[2]) } : null;
};

/** WMO の天気コードを、アプリの天気（晴れ・曇り・雨・雪）に寄せる。0〜2 は晴れ、3・霧・霧雨（51〜57）は曇り */
const weatherOfCode = (code: number): Weather => {
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snowy";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) {
    return "rainy";
  }
  if (code === 3 || code === 45 || code === 48 || (code >= 51 && code <= 57)) {
    return "cloudy";
  }
  return "sunny";
};

/** 時間帯の中に雪・雨があればそれ、無ければ曇りが半数以上なら曇り、それ以外は晴れ。気温は平均（小数第 1 位） */
const summarize = (hours: Hour[]) => {
  const weathers = hours.map((h) => weatherOfCode(h.code));
  const weather: Weather = weathers.includes("snowy")
    ? "snowy"
    : weathers.includes("rainy")
      ? "rainy"
      : weathers.filter((w) => w === "cloudy").length * 2 >= weathers.length
        ? "cloudy"
        : "sunny";
  const average =
    hours.reduce((total, h) => total + h.temperature, 0) / hours.length;
  return { weather, temperature: Math.round(average * 10) / 10 };
};

type Query = {
  latitude: number;
  longitude: number;
  /** JST の試合日 (YYYY-MM-DD) */
  date: string;
  /** JST の開始時刻 (HH:mm) */
  time: string;
};

/** 試合の時間帯の天気と気温を返す。取れなければ理由を投げる */
export const fetchGameWeather = async ({
  latitude,
  longitude,
  date,
  time,
}: Query) => {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    start_date: date,
    end_date: date,
    hourly: "temperature_2m,weather_code",
    timezone: "Asia/Tokyo",
  });
  const response = await fetch(`${ARCHIVE_URL}?${params}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = (await response.json()) as {
    hourly?: {
      time: string[];
      temperature_2m: (number | null)[];
      weather_code: (number | null)[];
    };
  };
  const hourly = json.hourly;
  if (!hourly) throw new Error("観測データがありません");

  const startHour = Number(time.slice(0, 2));
  const hours = hourly.time.flatMap((t, i): Hour[] => {
    const hour = Number(t.slice(11, 13));
    const temperature = hourly.temperature_2m[i];
    const code = hourly.weather_code[i];
    const inGame = hour >= startHour && hour < startHour + GAME_HOURS;
    return inGame && temperature != null && code != null
      ? [{ temperature, code }]
      : [];
  });
  if (hours.length === 0) {
    throw new Error("試合の時間帯の観測データがありません");
  }
  return summarize(hours);
};
