"use client";
import { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Draggable } from "./Draggable";
import { Droppable } from "./Droppable";

export const DnDContext = () => {
  const containers = ['Placed', 'Paid', 'Ready'];
  const [parent, setParent] = useState('Placed');
  
  const handleDragEnd = (event: any) => {
    const { over } = event;
console.log(over);
    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : 'null');
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {parent === null ? draggableMarkup : null}

      {containers.map((id) => (
        // We updated the Droppable component so it would accept an `id`
        // prop and pass it to `useDroppable`
        <Droppable key={id} id={id}>
          <div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              {id}
            </h3>
            {parent === id ? draggableMarkup : 'Drop here'}
          </div>
        </Droppable>
      ))}
    </DndContext>
  );
};

const DraggableItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="inline-flex items-center gap-x-3 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">
      <svg className="hs-handle cursor-grab shrink-0 size-4 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="5 9 2 12 5 15"></polyline>
        <polyline points="9 5 12 2 15 5"></polyline>
        <polyline points="15 19 12 22 9 19"></polyline>
        <polyline points="19 9 22 12 19 15"></polyline>
        <line x1="2" x2="22" y1="12" y2="12"></line>
        <line x1="12" x2="12" y1="2" y2="22"></line>
      </svg>
      {children}
    </div>);
};

const draggableMarkup = (
  <Draggable id="draggable"><DraggableItem>Drag my Order</DraggableItem></Draggable>
);
