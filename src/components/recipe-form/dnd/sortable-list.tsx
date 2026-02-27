 "use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { DraggableAttributes } from "@dnd-kit/core/dist/hooks/useDraggable";
import { CSS } from "@dnd-kit/utilities";

export interface SortableItemData {
  id: string;
}

export interface SortableRenderProps {
  setNodeRef: (element: HTMLElement | null) => void;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  style: CSSProperties;
  isDragging: boolean;
}

interface SortableListProps<T extends SortableItemData> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, sortable: SortableRenderProps, index: number) => ReactNode;
}

interface SortableListItemProps {
  id: string;
  children: (sortable: SortableRenderProps) => ReactNode;
}

function SortableListItem({ id, children }: SortableListItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({
        setNodeRef,
        attributes,
        listeners,
        style,
        isDragging,
      })}
    </div>
  );
}

export function SortableList<T extends SortableItemData>({
  items,
  onReorder,
  renderItem,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const ids = useMemo(() => items.map((item) => item.id), [items]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {items.map((item, index) => (
          <SortableListItem key={item.id} id={item.id}>
            {(sortable) => renderItem(item, sortable, index)}
          </SortableListItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}

