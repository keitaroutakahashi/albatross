import { notFound } from "next/navigation";

/** URL の動的セグメントを ID に変換する。不正な値は 404 にする */
export const parseId = (value: string): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return id;
};
