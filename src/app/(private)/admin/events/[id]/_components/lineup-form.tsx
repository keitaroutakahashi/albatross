"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  type Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { useRef, useState } from "react";
import { AddRemoveButtons } from "@/app/(private)/admin/_components/add-remove-buttons";
import { FormSection } from "@/app/(private)/admin/_components/form-section";
import { FormShell } from "@/app/(private)/admin/_components/form-shell";
import { NativeSelect } from "@/app/(private)/admin/_components/native-select";
import {
  LINEUP_FIELDS,
  MAX_BENCH,
  MAX_STARTERS,
  MIN_STARTERS,
  rowFieldName,
  STARTERS_ERROR_KEY,
} from "@/app/(private)/admin/_schemas/lineup";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { positionShortOptions } from "@/app/(private)/admin/_utils/options";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  members: Option[];
  /** 1 番から順の行。未登録の打順は空文字 */
  initialStarters: { memberId: string; position: string }[];
  initialBench: string[];
};

const toArray = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

/** エラー再表示時は送信した値、初回は初期値を返す */
const rowValue = (
  state: ActionState,
  field: string,
  index: number,
  initial: string,
): string =>
  state.values ? (toArray(state.values[field])[index] ?? "") : initial;

type SelectProps = {
  state: ActionState;
  field: keyof typeof LINEUP_FIELDS;
  index: number;
  initial: string;
  options: Option[];
  placeholder: string;
  label: string;
};

/** 同名の select を並べて、送信順で行に対応づける */
const RowSelect = ({
  state,
  field,
  index,
  initial,
  options,
  placeholder,
  label,
}: SelectProps) => {
  const value = rowValue(state, field, index, initial);
  const error = state.fieldErrors?.[rowFieldName(field, index)];
  return (
    <NativeSelect
      // エラー差し戻し後も選択を保つため、送信値が変わったら作り直す
      key={value}
      name={field}
      defaultValue={value}
      aria-label={label}
      aria-invalid={!!error}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </NativeSelect>
  );
};

type StarterRow = { key: number; memberId: string; position: string };

const OrderBadge = ({ order }: { order: number }) => (
  <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary tabular-nums">
    {order}
  </span>
);

/** 掴んで持ち上げている行の見た目。入力欄は操作できないので表示だけにする */
const StarterOverlay = ({
  row,
  order,
  members,
}: {
  row: StarterRow;
  order: number;
  members: Option[];
}) => {
  const position = positionShortOptions.find((o) => o.value === row.position);
  const member = members.find((o) => o.value === row.memberId);
  return (
    <div className="grid cursor-grabbing grid-cols-[1.5rem_1.5rem_5.5rem_1fr] items-center gap-2 rounded-lg border border-primary/30 bg-background p-2 shadow-xl ring-4 ring-primary/10">
      <GripVertical className="mx-auto size-4 text-primary" />
      <OrderBadge order={order} />
      <span className="truncate text-sm font-medium">
        {position?.label ?? "-"}
      </span>
      <span
        className={cn(
          "truncate text-sm font-medium",
          !member && "text-muted-foreground",
        )}
      >
        {member?.label ?? "選手名"}
      </span>
    </div>
  );
};

const lockHorizontal: Modifier = ({ transform }) => ({ ...transform, x: 0 });

type StarterItemProps = {
  row: StarterRow;
  index: number;
  members: Option[];
  errors: string[];
  /** 送信値が変わったら select を作り直すための key。RowSelect と同じ理由 */
  resetKey: string;
  onChange: (patch: Partial<Pick<StarterRow, "memberId" | "position">>) => void;
};

const StarterItem = ({
  row,
  index,
  members,
  errors,
  resetKey,
  onChange,
}: StarterItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.key });
  const order = index + 1;

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(0, ${Math.round(transform.y)}px, 0)`
          : undefined,
        transition,
      }}
      // 掴んでいる間は元の位置を「置き場所の枠」にして、実体は DragOverlay に任せる
      className={cn(
        isDragging &&
          "rounded-lg bg-primary/5 outline-2 outline-offset-4 outline-primary/40 outline-dashed",
      )}
    >
      <div
        className={cn(
          "grid grid-cols-[1.5rem_1.5rem_5.5rem_1fr] items-center gap-2",
          isDragging && "invisible",
        )}
      >
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`${order} 番の打順を並べ替え`}
          className="flex h-10 touch-none cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
        <OrderBadge order={order} />
        <NativeSelect
          // 送信後のフォームリセットは、制御中の value ではなくマウント時の defaultValue に
          // 戻す。送信値が変わるたびに作り直し、defaultValue で入力を保つ
          key={`position:${resetKey}`}
          name={LINEUP_FIELDS.starterPosition}
          defaultValue={row.position}
          onChange={(e) => onChange({ position: e.target.value })}
          aria-label={`${order} 守備位置`}
        >
          <option value="">-</option>
          {positionShortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          key={`member:${resetKey}`}
          name={LINEUP_FIELDS.starterMember}
          defaultValue={row.memberId}
          onChange={(e) => onChange({ memberId: e.target.value })}
          aria-label={`${order} 選手`}
        >
          <option value="">選手名</option>
          {members.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </NativeSelect>
      </div>
      {errors.map((message) => (
        <p
          key={message}
          role="alert"
          className="mt-1 pl-16 text-xs text-destructive"
        >
          {message}
        </p>
      ))}
    </li>
  );
};

const dndAccessibility = {
  screenReaderInstructions: {
    draggable:
      "スペースキーで掴み、矢印キーで移動、もう一度スペースキーで置きます。Esc で取り消します。",
  },
  announcements: {
    onDragStart: () => "掴みました",
    onDragOver: ({ over }: { over: { id: string | number } | null }) =>
      over ? "移動中" : undefined,
    onDragEnd: () => "置きました",
    onDragCancel: () => "取り消しました",
  },
};

export const LineupForm = ({
  action,
  members,
  initialStarters,
  initialBench,
}: Props) => {
  // 並べ替えで行と入力値を一緒に動かすため、スタメンは state で持つ
  const nextKey = useRef(initialStarters.length);
  const [starters, setStarters] = useState<StarterRow[]>(() =>
    initialStarters.map((s, key) => ({ key, ...s })),
  );
  const [benchCount, setBenchCount] = useState(initialBench.length);
  const [activeKey, setActiveKey] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const resizeStarters = (next: number) =>
    setStarters((prev) =>
      next > prev.length
        ? [...prev, { key: nextKey.current++, memberId: "", position: "" }]
        : prev.slice(0, next),
    );

  const activeIndex = starters.findIndex((r) => r.key === activeKey);
  const activeRow = activeIndex >= 0 ? starters[activeIndex] : undefined;

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveKey(null);
    if (!over || active.id === over.id) return;
    setStarters((prev) => {
      const from = prev.findIndex((r) => r.key === active.id);
      const to = prev.findIndex((r) => r.key === over.id);
      return arrayMove(prev, from, to);
    });
  };

  const updateStarter = (
    key: number,
    patch: Partial<Pick<StarterRow, "memberId" | "position">>,
  ) =>
    setStarters((prev) =>
      prev.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    );

  return (
    <FormShell action={action}>
      {(state) => {
        const rowError = (field: keyof typeof LINEUP_FIELDS, i: number) =>
          state.fieldErrors?.[rowFieldName(field, i)];

        return (
          <>
            <FormSection title="スタメン">
              <DndContext
                id="lineup-starters"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={({ active }) => setActiveKey(Number(active.id))}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveKey(null)}
                accessibility={dndAccessibility}
              >
                <SortableContext
                  items={starters.map((r) => r.key)}
                  strategy={verticalListSortingStrategy}
                >
                  <ol className="flex flex-col gap-3">
                    {starters.map((row, i) => (
                      <StarterItem
                        key={row.key}
                        row={row}
                        index={i}
                        members={members}
                        errors={[
                          rowError("starterMember", i),
                          rowError("starterPosition", i),
                        ].filter((e): e is string => !!e)}
                        resetKey={
                          state.values
                            ? `${rowValue(state, LINEUP_FIELDS.starterMember, i, "")}|${rowValue(state, LINEUP_FIELDS.starterPosition, i, "")}`
                            : "initial"
                        }
                        onChange={(patch) => updateStarter(row.key, patch)}
                      />
                    ))}
                  </ol>
                </SortableContext>
                <DragOverlay modifiers={[lockHorizontal]}>
                  {activeRow && (
                    <StarterOverlay
                      row={activeRow}
                      order={activeIndex + 1}
                      members={members}
                    />
                  )}
                </DragOverlay>
              </DndContext>
              {state.fieldErrors?.[STARTERS_ERROR_KEY] && (
                <p role="alert" className="text-sm text-destructive">
                  {state.fieldErrors[STARTERS_ERROR_KEY]}
                </p>
              )}
              <AddRemoveButtons
                count={starters.length}
                min={MIN_STARTERS}
                max={MAX_STARTERS}
                noun="打順"
                onChange={resizeStarters}
              />
            </FormSection>

            <FormSection title="ベンチ">
              <ul className="flex flex-col gap-3">
                {Array.from({ length: benchCount }, (_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: 行の並びが識別子
                  <li key={i}>
                    <RowSelect
                      state={state}
                      field="benchMember"
                      index={i}
                      initial={initialBench[i] ?? ""}
                      options={members}
                      placeholder="選手名"
                      label={`ベンチ ${i + 1} 選手`}
                    />
                    {rowError("benchMember", i) && (
                      <p role="alert" className="mt-1 text-xs text-destructive">
                        {rowError("benchMember", i)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
              {state.fieldErrors?.[LINEUP_FIELDS.benchMember] && (
                <p role="alert" className="text-sm text-destructive">
                  {state.fieldErrors[LINEUP_FIELDS.benchMember]}
                </p>
              )}
              <AddRemoveButtons
                count={benchCount}
                max={MAX_BENCH}
                noun="ベンチ"
                onChange={setBenchCount}
              />
            </FormSection>
          </>
        );
      }}
    </FormShell>
  );
};
