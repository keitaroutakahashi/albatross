import {
  type AdminFeature,
  canAccess,
  canEnterAdmin,
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

describe("一般ユーザー", () => {
  it("どの機能も使えず、管理画面にも入れない", () => {
    for (const feature of features) {
      expect(canAccess("general", feature)).toBe(false);
    }
    expect(canEnterAdmin("general")).toBe(false);
  });

  it("管理者と運営は管理画面に入れる", () => {
    expect(canEnterAdmin("admin")).toBe(true);
    expect(canEnterAdmin("operator")).toBe(true);
  });
});
