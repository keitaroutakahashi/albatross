import {
  calculatePitchCountPerInning,
  formatPitchCountPerInning,
} from "@/app/_utils/stats/pitch-count";

const result = (
  pitchCount: number | null,
  inningsPitched: number,
  partialOuts: number | null = null,
) => ({ pitchCount, inningsPitched, partialOuts });

describe("calculatePitchCountPerInning", () => {
  it("合計球数を投球回で割る", () => {
    // 3 回を 45 球 → 15 球/回
    expect(calculatePitchCountPerInning([result(45, 3)])).toBe(15);
  });

  it("投球回の端数は、アウト数で計算する（5 1/3 回を 80 球 = 80×3÷16）", () => {
    expect(calculatePitchCountPerInning([result(80, 5, 1)])).toBe(15);
  });

  it("複数の投手は、球数もアウト数も合算してから割る（平均の平均にしない）", () => {
    // 1 回 10 球 + 2 回 40 球 = 3 回 50 球 → 16.67 球/回
    const value = calculatePitchCountPerInning([result(10, 1), result(40, 2)]);
    expect(value).toBeCloseTo(16.667, 3);
  });

  it("球数が未入力の登板は、球数もアウト数も集計から除く", () => {
    // 球数なしの 2 回を含めると 30÷3 = 10 になってしまう
    expect(calculatePitchCountPerInning([result(30, 1), result(null, 2)])).toBe(
      30,
    );
  });

  it("球数が入力された登板がなければ null", () => {
    expect(calculatePitchCountPerInning([])).toBeNull();
    expect(calculatePitchCountPerInning([result(null, 3)])).toBeNull();
  });

  it("アウトを 1 つも取っていなければ null（0 で割らない）", () => {
    expect(calculatePitchCountPerInning([result(12, 0)])).toBeNull();
  });

  it("イニング途中で降板した投手のアウト数も含める（0 回 2/3）", () => {
    expect(calculatePitchCountPerInning([result(20, 0, 2)])).toBe(30);
  });
});

describe("formatPitchCountPerInning", () => {
  it("小数第 1 位まで四捨五入する", () => {
    expect(formatPitchCountPerInning(15.25)).toBe("15.3");
    expect(formatPitchCountPerInning(15)).toBe("15.0");
  });

  it("算出できないときは「-」を返す", () => {
    expect(formatPitchCountPerInning(null)).toBe("-");
    expect(formatPitchCountPerInning(null, "")).toBe("");
  });
});
