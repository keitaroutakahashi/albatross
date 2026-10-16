import { atBatResultGroups } from "@/app/(private)/admin/_utils/options";
import { AtBatResult } from "@/generated/prisma/enums";

describe("atBatResultGroups", () => {
  it("すべての打席結果が、どれか 1 つのまとまりにちょうど 1 回ずつ入る", () => {
    const values = atBatResultGroups.flatMap((g) =>
      g.options.map((o) => o.value),
    );
    expect([...values].sort()).toEqual(Object.values(AtBatResult).sort());
  });

  it("各項目には表示名がある", () => {
    for (const group of atBatResultGroups) {
      for (const option of group.options) {
        expect(option.label).toBeTruthy();
      }
    }
  });
});
