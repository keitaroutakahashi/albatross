/**
 * グラウンドが 1 件に決まらないときに、マスタから表記の似たものを候補として挙げる。
 * 候補はあくまで提示用。どれを使うかは人が決める（自動で選ばない）。
 */

export type GroundCandidate = { id: number; name: string; score: number };

/** 空白・末尾の「野球場」「球場」「グラウンド」を除いて、表記ゆれを吸収する */
export const normalizeGroundName = (name: string) =>
  name
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .replace(/(野球場|球場|グラウンド)$/, "")
    .toLowerCase();

const bigrams = (s: string) => {
  const set = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
  return set;
};

// 2 文字ずつの Dice 係数。片方がもう片方を含むときは、短い名前でも高く評価する
const similarity = (a: string, b: string) => {
  if (a === "" || b === "") return 0;
  if (a.includes(b) || b.includes(a)) return 0.9;
  const x = bigrams(a);
  const y = bigrams(b);
  if (x.size === 0 || y.size === 0) return 0;
  let common = 0;
  for (const g of x) if (y.has(g)) common++;
  return (2 * common) / (x.size + y.size);
};

export const suggestGrounds = (
  source: string,
  grounds: { id: number; name: string }[],
  limit = 5,
): GroundCandidate[] => {
  const target = normalizeGroundName(source);
  return grounds
    .map((g) => ({
      id: g.id,
      name: g.name,
      score: similarity(target, normalizeGroundName(g.name)),
    }))
    .sort((a, b) => b.score - a.score || a.id - b.id)
    .slice(0, limit);
};
