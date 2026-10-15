const EMBED_HOST = "www.google.com";
const EMBED_PATH = "/maps/embed";

/** iframe タグから src の値を取り出す（ダブルクォート・シングルクォートのどちらも） */
const IFRAME_SRC_PATTERN =
  /^<iframe\b[^>]*?\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i;

/** HTML の属性値に入っている文字参照のうち、URL で使われるものを元に戻す */
const decodeAttribute = (value: string): string =>
  value.replaceAll("&amp;", "&");

/** Google マップの埋め込み用 URL か。他のサイトや、埋め込み以外のページは認めない */
export const isGoogleMapEmbedUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === EMBED_HOST &&
      url.pathname === EMBED_PATH
    );
  } catch {
    return false;
  }
};

type Result = { ok: true; url: string } | { ok: false; message: string };

/**
 * Google マップの「地図を埋め込む」で出る iframe タグ、または、その src の URL から、
 * 埋め込み用の URL を取り出す。タグそのものは保存せず、URL だけを返す。
 */
export const parseGoogleMapEmbed = (input: string): Result => {
  const trimmed = input.trim();
  let candidate = trimmed;

  if (trimmed.startsWith("<")) {
    const match = IFRAME_SRC_PATTERN.exec(trimmed);
    const src = match?.[1] ?? match?.[2];
    if (src === undefined) {
      return {
        ok: false,
        message: "Google マップの iframe の埋め込みコードを貼り付けてください",
      };
    }
    candidate = decodeAttribute(src);
  }

  if (!isGoogleMapEmbedUrl(candidate)) {
    return {
      ok: false,
      message: "Google マップの埋め込み用の URL ではありません",
    };
  }
  return { ok: true, url: candidate };
};
