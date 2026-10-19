import { renderHook } from "@testing-library/react";
import {
  PROGRESS_FINISH_EVENT,
  PROGRESS_START_EVENT,
} from "@/app/_components/ui/navigation-progress/events";
import { useNavigationProgressWhile } from "@/app/_components/ui/navigation-progress/use-navigation-progress-while";

const listen = () => {
  const events: string[] = [];
  const onStart = () => events.push("start");
  const onFinish = () => events.push("finish");
  window.addEventListener(PROGRESS_START_EVENT, onStart);
  window.addEventListener(PROGRESS_FINISH_EVENT, onFinish);
  return {
    events,
    stop: () => {
      window.removeEventListener(PROGRESS_START_EVENT, onStart);
      window.removeEventListener(PROGRESS_FINISH_EVENT, onFinish);
    },
  };
};

describe("useNavigationProgressWhile", () => {
  it("待機中でなければ何も通知しない", () => {
    const { events, stop } = listen();
    renderHook(() => useNavigationProgressWhile(false));
    expect(events).toEqual([]);
    stop();
  });

  it("待機が始まると開始、終わると終了を通知する", () => {
    const { events, stop } = listen();
    const { rerender } = renderHook(
      ({ pending }) => useNavigationProgressWhile(pending),
      { initialProps: { pending: false } },
    );
    rerender({ pending: true });
    expect(events).toEqual(["start"]);
    rerender({ pending: false });
    expect(events).toEqual(["start", "finish"]);
    stop();
  });

  it("待機中に画面から外れたときも終了を通知する", () => {
    const { events, stop } = listen();
    const { unmount } = renderHook(() => useNavigationProgressWhile(true));
    unmount();
    expect(events).toEqual(["start", "finish"]);
    stop();
  });
});
