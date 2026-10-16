import { toYouTubeEmbedUrl } from "@/app/_utils/youtube";

const ID = "5b3pysWf_Yk";
const EMBED = `https://www.youtube.com/embed/${ID}`;

describe("toYouTubeEmbedUrl", () => {
  it("共有で出る短縮 URL を、埋め込み用に直す（si などは引き継がない）", () => {
    expect(
      toYouTubeEmbedUrl(`https://youtu.be/${ID}?si=54JGTd5Vah9xIvcb`),
    ).toBe(EMBED);
  });

  it("視聴ページの URL を、埋め込み用に直す", () => {
    expect(
      toYouTubeEmbedUrl(`https://www.youtube.com/watch?v=${ID}&feature=share`),
    ).toBe(EMBED);
    expect(toYouTubeEmbedUrl(`https://youtube.com/watch?v=${ID}`)).toBe(EMBED);
    expect(toYouTubeEmbedUrl(`https://m.youtube.com/watch?v=${ID}`)).toBe(
      EMBED,
    );
  });

  it("shorts・live・embed の URL も、埋め込み用に直す", () => {
    for (const path of ["shorts", "live", "embed"]) {
      expect(toYouTubeEmbedUrl(`https://www.youtube.com/${path}/${ID}`)).toBe(
        EMBED,
      );
    }
  });

  it("開始位置を、秒にして引き継ぐ", () => {
    expect(toYouTubeEmbedUrl(`https://youtu.be/${ID}?t=90`)).toBe(
      `${EMBED}?start=90`,
    );
    expect(toYouTubeEmbedUrl(`https://youtu.be/${ID}?t=1m30s`)).toBe(
      `${EMBED}?start=90`,
    );
    expect(
      toYouTubeEmbedUrl(`https://www.youtube.com/watch?v=${ID}&t=1h2m3s`),
    ).toBe(`${EMBED}?start=3723`);
    expect(toYouTubeEmbedUrl(`${EMBED}?start=45`)).toBe(`${EMBED}?start=45`);
  });

  it("開始位置が 0 や読み取れない値なら、付けない", () => {
    expect(toYouTubeEmbedUrl(`https://youtu.be/${ID}?t=0`)).toBe(EMBED);
    expect(toYouTubeEmbedUrl(`https://youtu.be/${ID}?t=abc`)).toBe(EMBED);
  });

  it("前後の空白は無視する", () => {
    expect(toYouTubeEmbedUrl(`  https://youtu.be/${ID}  `)).toBe(EMBED);
  });

  it("YouTube の動画 URL でなければ null", () => {
    for (const input of [
      "",
      "foo",
      "https://example.com/watch?v=5b3pysWf_Yk",
      "https://www.youtube.com/",
      "https://www.youtube.com/watch",
      "https://www.youtube.com/watch?v=short",
      "https://www.youtube.com/channel/UC1234567890",
      "https://youtube.com.evil.example/watch?v=5b3pysWf_Yk",
      "https://youtu.be/",
      "javascript:alert(1)",
    ]) {
      expect(toYouTubeEmbedUrl(input)).toBeNull();
    }
  });
});
