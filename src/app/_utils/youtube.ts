const WATCH_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
]);
const SHORT_HOST = "youtu.be";

/** YouTube の動画 ID は、英数字・ハイフン・アンダースコアの 11 文字 */
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/** /shorts/ID のように、パスの 2 つ目が動画 ID になる形式 */
const ID_PATH_PREFIXES = new Set(["shorts", "live", "embed", "v"]);

const START_TIME_PATTERN = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;

/** 開始位置（`90`、`90s`、`1m30s`、`1h2m3s`）を秒にする。読み取れないときは 0 */
const parseStartSeconds = (value: string | null): number => {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return Number(value);
  const match = START_TIME_PATTERN.exec(value);
  if (!match) return 0;
  const [, hours, minutes, seconds] = match;
  return (
    Number(hours ?? 0) * 3600 + Number(minutes ?? 0) * 60 + Number(seconds ?? 0)
  );
};

const extractVideoId = (url: URL): string | null => {
  const segments = url.pathname.split("/").filter(Boolean);
  let id: string | undefined;

  if (url.hostname === SHORT_HOST) {
    id = segments[0];
  } else if (WATCH_HOSTS.has(url.hostname)) {
    if (segments[0] === "watch") {
      id = url.searchParams.get("v") ?? undefined;
    } else if (segments.length === 2 && ID_PATH_PREFIXES.has(segments[0])) {
      id = segments[1];
    }
  }

  return id !== undefined && VIDEO_ID_PATTERN.test(id) ? id : null;
};

/**
 * YouTube の動画 URL を、`<iframe>` に表示できる埋め込み用の URL に直す。
 * YouTube は、`/embed/{動画ID}` 以外の URL（視聴ページや共有用の短縮 URL）を枠の中に表示させない。
 * 開始位置（`t` / `start`）は引き継ぐ。YouTube の動画 URL でなければ null。
 */
export const toYouTubeEmbedUrl = (input: string): string | null => {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const id = extractVideoId(url);
  if (id === null) return null;

  const start = parseStartSeconds(
    url.searchParams.get("t") ?? url.searchParams.get("start"),
  );
  return `https://www.youtube.com/embed/${id}${start > 0 ? `?start=${start}` : ""}`;
};
