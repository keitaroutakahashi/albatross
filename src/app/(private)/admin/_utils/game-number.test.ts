import {
  assignGameNumbers,
  isSameJstDay,
} from "@/app/(private)/admin/_utils/game-number";

const at = (iso: string) => new Date(`${iso}+09:00`);

describe("assignGameNumbers", () => {
  it("日時の早い順に 1, 2, … と番号を付ける（登録順ではない）", () => {
    const numbers = assignGameNumbers([
      { id: 10, date: at("2026-10-04T13:00:00") },
      { id: 11, date: at("2026-10-04T09:30:00") },
    ]);
    expect(numbers.get(11)).toBe(1);
    expect(numbers.get(10)).toBe(2);
  });

  it("日時が同じ試合は、登録順（id の小さい順）にする", () => {
    const numbers = assignGameNumbers([
      { id: 21, date: at("2026-10-04T10:00:00") },
      { id: 20, date: at("2026-10-04T10:00:00") },
    ]);
    expect(numbers.get(20)).toBe(1);
    expect(numbers.get(21)).toBe(2);
  });

  it("1 試合だけなら番号 1、試合がなければ空", () => {
    expect(
      assignGameNumbers([{ id: 5, date: at("2026-10-04T10:00:00") }]).get(5),
    ).toBe(1);
    expect(assignGameNumbers([]).size).toBe(0);
  });

  it("途中の試合が抜けても、残りは詰めて番号を付ける", () => {
    const numbers = assignGameNumbers([
      { id: 1, date: at("2026-10-04T09:00:00") },
      { id: 3, date: at("2026-10-04T15:00:00") },
    ]);
    expect([numbers.get(1), numbers.get(3)]).toEqual([1, 2]);
  });
});

describe("isSameJstDay", () => {
  it("日本時間で同じ日なら true（UTC では日付が違っても）", () => {
    // 2026-10-05 00:30 JST と 2026-10-05 23:00 JST
    expect(
      isSameJstDay(
        new Date("2026-10-04T15:30:00Z"),
        new Date("2026-10-05T14:00:00Z"),
      ),
    ).toBe(true);
  });

  it("日本時間で日付をまたぐなら false", () => {
    expect(
      isSameJstDay(at("2026-10-04T23:59:00"), at("2026-10-05T00:00:00")),
    ).toBe(false);
  });
});
