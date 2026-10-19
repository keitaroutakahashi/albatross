/**
 * 進捗バーの開始・終了を、next/link のクリック以外からも知らせる仕組み。
 * router.push・Server Action のリダイレクト・成績フィルターの読み込みなど、
 * リンクを押さずに始まる待ち時間でも、バーを出すために使う。
 */
export const PROGRESS_START_EVENT = "navigation-progress:start";
export const PROGRESS_FINISH_EVENT = "navigation-progress:finish";

export const startNavigationProgress = (): void => {
  window.dispatchEvent(new Event(PROGRESS_START_EVENT));
};

export const finishNavigationProgress = (): void => {
  window.dispatchEvent(new Event(PROGRESS_FINISH_EVENT));
};
