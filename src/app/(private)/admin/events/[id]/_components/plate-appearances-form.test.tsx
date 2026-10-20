import { render, screen } from "@testing-library/react";
import { PlateAppearancesForm } from "@/app/(private)/admin/events/[id]/_components/plate-appearances-form";

const renderForm = (initialStolenBases: number) =>
  render(
    <PlateAppearancesForm
      action={vi.fn()}
      initialRows={[]}
      initialStolenBases={initialStolenBases}
    />,
  );

describe("PlateAppearancesForm の盗塁数", () => {
  it("登録済みの盗塁数を初期値として表示する", () => {
    renderForm(3);
    expect(screen.getByLabelText("盗塁数")).toHaveValue(3);
  });

  it("盗塁がなければ 0 を表示する", () => {
    renderForm(0);
    expect(screen.getByLabelText("盗塁数")).toHaveValue(0);
  });
});
