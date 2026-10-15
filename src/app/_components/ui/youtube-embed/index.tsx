import { toYouTubeEmbedUrl } from "@/app/_utils/youtube";

type Props = {
  /** YouTube の動画 URL。共有用の短縮 URL や視聴ページの URL でもよい */
  url: string;
};

/**
 * 表示するときだけ付ける、プレーヤーの指定。保存する URL には含めない。
 * 自動再生はせず、再生ボタンとコントロールバーを表示する。スマホでも、全画面にならずに再生する。
 */
const PLAYER_PARAMS = {
  autoplay: "0",
  controls: "1",
  playsinline: "1",
} as const;

const toPlayerUrl = (embedUrl: string): string => {
  const url = new URL(embedUrl);
  for (const [key, value] of Object.entries(PLAYER_PARAMS)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
};

/**
 * YouTube の動画を埋め込む。
 * YouTube は埋め込み用の URL しか枠の中に表示させないため、どの形の URL でも、ここで直してから使う。
 */
export const YouTubeEmbed = ({ url }: Props) => {
  const embedUrl = toYouTubeEmbedUrl(url);
  if (embedUrl === null) return null;

  return (
    <iframe
      // width / height 属性を付けると、固定の高さが aspect-video より優先され、スマホで縦に大きくなる
      className="aspect-video w-full @content:w-140"
      src={toPlayerUrl(embedUrl)}
      title="試合動画"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
};
