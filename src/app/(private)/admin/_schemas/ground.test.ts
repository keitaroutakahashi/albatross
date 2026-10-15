import { groundSchema } from "@/app/(private)/admin/_schemas/ground";

const EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12";

const valid = {
  name: "代々木公園野球場",
  address: "東京都渋谷区代々木神園町2-1",
  access: "",
  url: "https://example.com/",
  imagePath: "",
  mapEmbedUrl: "",
};

describe("groundSchema", () => {
  it("地図は未入力でもよく、null にする", () => {
    expect(groundSchema.parse(valid)).toMatchObject({ mapEmbedUrl: null });
    expect(
      groundSchema.parse({ ...valid, mapEmbedUrl: undefined }),
    ).toMatchObject({ mapEmbedUrl: null });
  });

  it("iframe タグを貼り付けると、src の URL だけを保存する", () => {
    const tag = `<iframe src="${EMBED_URL}" width="600" height="450" loading="lazy"></iframe>`;
    expect(groundSchema.parse({ ...valid, mapEmbedUrl: tag })).toMatchObject({
      mapEmbedUrl: EMBED_URL,
    });
  });

  it("URL だけを貼り付けてもよい", () => {
    expect(
      groundSchema.parse({ ...valid, mapEmbedUrl: EMBED_URL }),
    ).toMatchObject({ mapEmbedUrl: EMBED_URL });
  });

  it("Google マップの埋め込み以外は、地図の欄にエラーを返す", () => {
    const result = groundSchema.safeParse({
      ...valid,
      mapEmbedUrl: "<script>alert(1)</script>",
    });
    expect(result.error?.issues[0]).toMatchObject({
      path: ["mapEmbedUrl"],
      message: "Google マップの iframe の埋め込みコードを貼り付けてください",
    });

    const other = groundSchema.safeParse({
      ...valid,
      mapEmbedUrl: "https://example.com/maps/embed",
    });
    expect(other.error?.issues[0]).toMatchObject({
      path: ["mapEmbedUrl"],
      message: "Google マップの埋め込み用の URL ではありません",
    });
  });
});
