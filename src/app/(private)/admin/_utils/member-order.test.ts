import {
  sortMembersByUniformNumber,
  sortMembersForSelect,
} from "@/app/(private)/admin/_utils/member-order";

const member = (
  uniformNumber: string | null,
  name: string,
  isActive = true,
) => ({
  uniformNumber,
  name,
  isActive,
});

describe("sortMembersByUniformNumber", () => {
  it("背番号を数値として小さい順に並べる", () => {
    const sorted = sortMembersByUniformNumber([
      member("10", "a"),
      member("2", "b"),
      member("100", "c"),
      member("1", "d"),
    ]);
    expect(sorted.map((m) => m.uniformNumber)).toEqual(["1", "2", "10", "100"]);
  });

  it("現役メンバーを先に、非現役は後ろにそれぞれ背番号順で並べる", () => {
    const sorted = sortMembersByUniformNumber([
      member("1", "非現役の1番", false),
      member("20", "現役の20番"),
      member("3", "現役の3番"),
      member("5", "非現役の5番", false),
    ]);
    expect(sorted.map((m) => m.name)).toEqual([
      "現役の3番",
      "現役の20番",
      "非現役の1番",
      "非現役の5番",
    ]);
  });

  it("数値が同じ背番号は、0 が多い方を先にする", () => {
    const sorted = sortMembersByUniformNumber([
      member("10", "a"),
      member("2", "b"),
      member("1", "c"),
      member("01", "d"),
      member("001", "e"),
    ]);
    expect(sorted.map((m) => m.uniformNumber)).toEqual([
      "001",
      "01",
      "1",
      "2",
      "10",
    ]);
  });

  it("背番号が完全に同じときは名前順にする", () => {
    const sorted = sortMembersByUniformNumber([
      member("5", "ぼ"),
      member("5", "あ"),
    ]);
    expect(sorted.map((m) => m.name)).toEqual(["あ", "ぼ"]);
  });

  it("背番号の無いメンバー（助っ人）は、現役の中の最後に並べる", () => {
    const sorted = sortMembersByUniformNumber([
      member(null, "助"),
      member("2", "b"),
      member("1", "a"),
      member("3", "c", false),
    ]);
    expect(sorted.map((m) => m.name)).toEqual(["a", "b", "助", "c"]);
  });

  it("元の配列は変更しない", () => {
    const input = [member("2", "b"), member("1", "a")];
    sortMembersByUniformNumber(input);
    expect(input.map((m) => m.uniformNumber)).toEqual(["2", "1"]);
  });
});

describe("sortMembersForSelect", () => {
  it("背番号の無いメンバーは、非現役より後ろの一番最後に並べる", () => {
    const sorted = sortMembersForSelect([
      member(null, "現役の助っ人"),
      member("3", "非現役の3番", false),
      member("10", "現役の10番"),
      member("2", "現役の2番"),
    ]);
    expect(sorted.map((m) => m.name)).toEqual([
      "現役の2番",
      "現役の10番",
      "非現役の3番",
      "現役の助っ人",
    ]);
  });

  it("背番号の無いメンバー同士は、現役を先に名前順にする", () => {
    const sorted = sortMembersForSelect([
      member(null, "あ", false),
      member(null, "ぼ"),
      member(null, "い"),
    ]);
    expect(sorted.map((m) => m.name)).toEqual(["い", "ぼ", "あ"]);
  });

  it("元の配列は変更しない", () => {
    const input = [member("2", "b"), member("1", "a")];
    sortMembersForSelect(input);
    expect(input.map((m) => m.uniformNumber)).toEqual(["2", "1"]);
  });
});
