import {
  calculateAttendanceRate,
  formatAttendanceRate,
} from "@/app/_utils/stats/attendance";

describe("calculateAttendanceRate", () => {
  it("出席数 ÷ 開催数を返す", () => {
    expect(calculateAttendanceRate(3, 4)).toBe(0.75);
  });

  it("全て出席していれば 1 になる", () => {
    expect(calculateAttendanceRate(5, 5)).toBe(1);
  });

  it("開催済みのイベントが 0 件のときは null を返す", () => {
    expect(calculateAttendanceRate(0, 0)).toBeNull();
  });
});

describe("formatAttendanceRate", () => {
  it("小数第 1 位までのパーセント表記にする", () => {
    expect(formatAttendanceRate(6 / 7)).toBe("85.7%");
  });

  it("100% と 0% も小数第 1 位まで表示する", () => {
    expect(formatAttendanceRate(1)).toBe("100.0%");
    expect(formatAttendanceRate(0)).toBe("0.0%");
  });
});
