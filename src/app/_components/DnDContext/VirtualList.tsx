"use client";
import React, {useState, use, Suspense, useEffect} from 'react';
import {createPortal} from 'react-dom';
import VirtualList from 'react-tiny-virtual-list';

import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {SortableItem, Props} from './Sortable';
import {Item, Wrapper} from './components';

import './styles.css';

export default function MessageContainer({ messagePromise }: { messagePromise: Promise<VirtualItem[]> }) {
  const messageContent = use(messagePromise);
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Sortable items={messageContent as any} />
    </Suspense>);
};

// TODO: Fix this type for the VirtualItems props
function Sortable({
  adjustScale = false,
  strategy = verticalListSortingStrategy,
  handle = false,
  getItemStyles = () => ({}),
  modifiers,
  items = [],
}: Props) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [elements, setItems] = useState<VirtualItem[]>([...items as unknown as VirtualItem[]]);
  const getIndex = (id: any) => elements.findIndex(item => item.time === id);

  const activeIndex = activeId != null ? getIndex(activeId) : -1;

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || items.length === 0) {
    return <p>No items</p>;
  }
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({active}) => {
        setActiveId(active.id as string);
      }}
      onDragEnd={({over}) => {
        if (over) {
          const overIndex = getIndex(over.id);
          if (activeIndex !== overIndex) {
            setItems((elements) => arrayMove(elements, activeIndex, overIndex));
          }
        }

        setActiveId(null);
      }}
      onDragCancel={() => setActiveId(null)}
      modifiers={modifiers}
    >
      <Wrapper center>
        <SortableContext items={elements as any} strategy={strategy}>
          <VirtualList
            width={500}
            height={600}
            className="virtual-list"
            itemCount={elements.length}
            itemSize={64}
            stickyIndices={
              activeId != null ? [getIndex(activeId)] : undefined
            }
            renderItem={({index, style}) => {
              const id = elements[index].time;
              return (
                <SortableItem
                  key={id}
                  id={id}
                  index={index}
                  handle={handle}
                  wrapperStyle={() => ({
                    ...style,
                    padding: 5,
                  })}
                  style={getItemStyles}
                  useDragOverlay
                />
              );
            }}
          />
        </SortableContext>
      </Wrapper>
      {typeof window !== 'undefined' && createPortal(
        <DragOverlay adjustScale={adjustScale}>
          {activeId != null ? (
            <Item
              value={getItemValue(elements[activeIndex])}
              // edit later whit the real value
              handle={handle}
              style={getItemStyles({
                id: activeId,
                index: activeIndex,
                isDragging: true,
                isSorting: true,
                overIndex: -1,
                isDragOverlay: true,
              })}
              wrapperStyle={{
                padding: 5,
              }}
              dragOverlay
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

const props = {
  strategy: verticalListSortingStrategy,
};

type VirtualItem = {
  time: string;
  messageId: string;
  body: string;
};

const getItemValue = (item: VirtualItem) => {
  const bodyObj = JSON.parse(atob(item.body));
  return `${bodyObj.user.slice(0, 10)} - ${item.messageId.slice(0, 10)}`;
};
