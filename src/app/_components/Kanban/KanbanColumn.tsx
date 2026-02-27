'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Order } from '@/app/_types/database';
import OrderCard from './OrderCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  orders: Order[];
  color?: string;
}

export default function KanbanColumn({ id, title, orders, color = 'bg-gray-50' }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col w-80 min-w-[320px] flex-shrink-0">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{orders.length} orders</p>
      </div>
      
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-lg p-4 transition-colors ${color} ${
          isOver ? 'ring-2 ring-blue-500 bg-blue-100' : ''
        }`}
      >
        <SortableContext
          items={orders.map(o => o.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
            {orders.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No orders
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

