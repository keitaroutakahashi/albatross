import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** カラム定義 */
export type ColumnDef<T> = {
  /** カラムの一意キー */
  key: string;
  /** ヘッダーに表示するコンテンツ */
  header: ReactNode;
  /** セルのレンダリング関数 */
  cell: (row: T, index: number) => ReactNode;
  /** テキスト配置（デフォルト: "center"） */
  align?: "left" | "center" | "right";
  /** ヘッダーセルの追加クラス名 */
  headerClassName?: string;
  /** ボディセルの追加クラス名 */
  cellClassName?: string;
};

/** sticky カラムの設定 */
export type StickyConfig = {
  /** sticky にするカラム数（左端から） */
  count: number;
  /** 各カラムの left オフセット値（"left-0", "left-10" 等） */
  offsets: string[];
};

type Props<T> = {
  /** カラム定義の配列 */
  columns: ColumnDef<T>[];
  /** 表示するデータ配列 */
  data: T[];
  /** 各行のユニークキーを返す関数 */
  keyExtractor: (row: T, index: number) => string;
  /** sticky カラム設定 */
  sticky?: StickyConfig;
  /** ラッパー div の追加クラス名 */
  className?: string;
};

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export const DataTable = <T,>({
  columns,
  data,
  keyExtractor,
  sticky,
  className,
}: Props<T>) => {
  const getStickyClasses = (colIndex: number, bgColorClass: string): string => {
    if (!sticky || colIndex >= sticky.count) return "";
    return cn("sticky z-10", sticky.offsets[colIndex], bgColorClass);
  };

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="text-sm @content:text-base border-collapse w-full">
        <thead>
          <tr className="bg-gray-800 text-white">
            {columns.map((col, colIndex) => (
              <th
                key={col.key}
                className={cn(
                  "p-2 whitespace-nowrap text-xs",
                  alignClass[col.align ?? "center"],
                  getStickyClasses(colIndex, "bg-gray-800"),
                  col.headerClassName,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={keyExtractor(row, rowIndex)}
              className="border-b border-gray-200"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={col.key}
                  className={cn(
                    "p-2 whitespace-nowrap",
                    alignClass[col.align ?? "center"],
                    getStickyClasses(colIndex, "bg-white"),
                    col.cellClassName,
                  )}
                >
                  {col.cell(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
