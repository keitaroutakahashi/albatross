import {
  type AdminFeature,
  canAccess,
} from "@/app/(private)/admin/_utils/permissions";

const features: AdminFeature[] = ["events", "members", "options", "users"];

describe("canAccess", () => {
  it("管理者はすべての機能を使える", () => {
    for (const feature of features) {
      expect(canAccess("admin", feature)).toBe(true);
    }
  });

  it("運営はイベントだけ使える", () => {
    expect(canAccess("operator", "events")).toBe(true);
    expect(canAccess("operator", "members")).toBe(false);
    expect(canAccess("operator", "options")).toBe(false);
    expect(canAccess("operator", "users")).toBe(false);
  });
});
