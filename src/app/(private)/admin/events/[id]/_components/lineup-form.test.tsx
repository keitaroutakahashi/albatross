import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { LineupForm } from "@/app/(private)/admin/events/[id]/_components/lineup-form";

const members = [
  { value: "1", label: "田中" },
  { value: "2", label: "鈴木" },
  { value: "3", label: "佐藤" },
];

const initialStarters = Array.from({ length: 9 }, () => ({
  memberId: "",
  position: "",
}));

/** 検証エラーで差し戻す Server Action。送信値を values に入れて返す */
const failingAction = async (
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => ({
  message: "入力内容を確認してください",
  fieldErrors: { "starterMember-0": "エラー" },
  values: {
    starterMember: formData.getAll("starterMember") as string[],
    starterPosition: formData.getAll("starterPosition") as string[],
    benchMember: formData.getAll("benchMember") as string[],
  },
});

const submit = async () => {
  const form = document.getElementById("admin-form") as HTMLFormElement;
  fireEvent.submit(form);
  await waitFor(() =>
    expect(screen.getAllByText("入力内容を確認してください")).toHaveLength(1),
  );
};

describe("LineupForm のエラー差し戻し", () => {
  it("エラーで差し戻されても、スタメンの入力内容を保持する", async () => {
    render(
      <LineupForm
        action={failingAction}
        members={members}
        initialStarters={initialStarters}
        initialBench={[]}
      />,
    );
    fireEvent.change(screen.getByLabelText("1 選手"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("1 守備位置"), {
      target: { value: "pitcher" },
    });
    fireEvent.change(screen.getByLabelText("3 選手"), {
      target: { value: "3" },
    });

    await submit();

    expect(screen.getByLabelText("1 選手")).toHaveValue("2");
    expect(screen.getByLabelText("1 守備位置")).toHaveValue("pitcher");
    expect(screen.getByLabelText("3 選手")).toHaveValue("3");
  });

  it("エラーで差し戻されても、ベンチの入力内容を保持する", async () => {
    render(
      <LineupForm
        action={failingAction}
        members={members}
        initialStarters={initialStarters}
        initialBench={["1"]}
      />,
    );
    fireEvent.change(screen.getByLabelText("ベンチ 1 選手"), {
      target: { value: "3" },
    });

    await submit();

    expect(screen.getByLabelText("ベンチ 1 選手")).toHaveValue("3");
  });
});
