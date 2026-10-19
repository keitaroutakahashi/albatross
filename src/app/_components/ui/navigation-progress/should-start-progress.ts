type Input = {
  /** Link（next/link）がクライアント遷移として処理したクリックは、ここで true になる */
  defaultPrevented: boolean;
  /** 0: 左クリック */
  button: number;
  /** Ctrl・Cmd・Shift・Alt のいずれかが押されている（新しいタブなどで開く操作） */
  hasModifier: boolean;
  /** クリックされたリンクの target 属性 */
  target: string | null;
  isDownload: boolean;
  /** クリックされたリンクの href（絶対 URL） */
  href: string | null;
  /** 今開いているページの URL */
  currentUrl: string;
};

/**
 * クリックが、同じサイト内の別ページへの画面遷移か。
 * 進捗バーは、遷移が終わったときに URL が変わることで消すため、URL が変わらないクリック
 * （同じページへのリンク、#ハッシュだけの移動）では出さない。出すと消えずに残ってしまう。
 */
export const shouldStartProgress = ({
  defaultPrevented,
  button,
  hasModifier,
  target,
  isDownload,
  href,
  currentUrl,
}: Input): boolean => {
  if (!defaultPrevented || button !== 0 || hasModifier || isDownload) {
    return false;
  }
  if (target && target !== "_self") return false;
  if (!href) return false;

  const next = new URL(href, currentUrl);
  const current = new URL(currentUrl);
  if (next.origin !== current.origin) return false;
  return next.pathname !== current.pathname || next.search !== current.search;
};
