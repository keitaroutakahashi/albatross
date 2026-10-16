import { isGoogleMapEmbedUrl } from "@/app/_utils/google-map";

type Props = {
  /** Google マップの埋め込み用 URL（iframe の src） */
  url: string;
  /** 地図の内容を伝える名前（読み上げ用） */
  title: string;
};

/**
 * Google マップの埋め込み地図。
 * iframe タグは保存せず、この部品で組み立てる。保存済みの値でも、念のため埋め込み用の URL か確認する。
 */
export const GoogleMapEmbed = ({ url, title }: Props) => {
  if (!isGoogleMapEmbedUrl(url)) return null;

  return (
    <iframe
      src={url}
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className="h-52 w-full rounded-md border-0 md:h-64"
    />
  );
};
