import {
  isGoogleMapEmbedUrl,
  parseGoogleMapEmbed,
} from "@/app/_utils/google-map";

const EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.5!2d139.65!3d35.66";

describe("parseGoogleMapEmbed", () => {
  it("Google マップの iframe タグから、src だけを取り出す", () => {
    const tag = `<iframe src="${EMBED_URL}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    expect(parseGoogleMapEmbed(tag)).toEqual({ ok: true, url: EMBED_URL });
  });

  it("前後の空白や改行、シングルクォートの src も受け付ける", () => {
    const tag = `\n  <iframe width="600"\n    src='${EMBED_URL}'></iframe>\n`;
    expect(parseGoogleMapEmbed(tag)).toEqual({ ok: true, url: EMBED_URL });
  });

  it("src の &amp; を元に戻す", () => {
    const tag = `<iframe src="https://www.google.com/maps/embed?pb=1&amp;hl=ja"></iframe>`;
    expect(parseGoogleMapEmbed(tag)).toEqual({
      ok: true,
      url: "https://www.google.com/maps/embed?pb=1&hl=ja",
    });
  });

  it("URL だけを貼り付けても受け付ける", () => {
    expect(parseGoogleMapEmbed(`  ${EMBED_URL}  `)).toEqual({
      ok: true,
      url: EMBED_URL,
    });
  });

  it("iframe 以外のタグ・src のない iframe は、貼り付け方のエラーにする", () => {
    for (const input of [
      "<script>alert(1)</script>",
      "<iframe></iframe>",
      `<img src="${EMBED_URL}">`,
    ]) {
      expect(parseGoogleMapEmbed(input)).toEqual({
        ok: false,
        message: "Google マップの iframe の埋め込みコードを貼り付けてください",
      });
    }
  });

  it("Google マップの埋め込み以外の URL は認めない", () => {
    for (const input of [
      "https://example.com/maps/embed?pb=1",
      "https://www.google.com/maps/place/yoyogi",
      "https://www.google.com.evil.example/maps/embed?pb=1",
      "http://www.google.com/maps/embed?pb=1",
      "javascript:alert(1)",
      `<iframe src="https://evil.example/maps/embed"></iframe>`,
    ]) {
      expect(parseGoogleMapEmbed(input)).toEqual({
        ok: false,
        message: "Google マップの埋め込み用の URL ではありません",
      });
    }
  });
});

describe("isGoogleMapEmbedUrl", () => {
  it("埋め込み用の URL だけを true にする", () => {
    expect(isGoogleMapEmbedUrl(EMBED_URL)).toBe(true);
    expect(isGoogleMapEmbedUrl("https://example.com/")).toBe(false);
    expect(isGoogleMapEmbedUrl("not a url")).toBe(false);
  });
});
