'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Order } from '@/app/_types/database';
import { QuoteItem } from '@/app/_types/clientQuote';

interface OrderCardProps {
  order: Order;
  isDragging?: boolean;
}

const countOrderItems = (items: QuoteItem[]) => {
  const countedItems = Object.create(null);
  items.forEach(item => {
    countedItems[item.id as string] = (countedItems[item.id as string] || 0) + 1;
  });
  return countedItems;
};

export default function OrderCard({ order, isDragging = false }: OrderCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const displayName = order.guest_name || 'Guest';
  const itemCount = order.items?.length || 0;
  const formattedDate = new Date(order.created_at).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const countedItems = countOrderItems(order.items);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 bg-white rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">
            {order.order_number}
          </h3>
          <p className="text-xs text-gray-500">{displayName}</p>
        </div>
        {order.total_amount && (
          <span className="text-sm font-semibold text-gray-900">
            ${order.total_amount.toFixed(2)}
          </span>
        )}
      </div>
      
      <div className="space-y-1 mb-2">
        {Object.entries(countedItems)?.slice(0, 3).map((item: any, idx: number) => (
          <div key={idx} className="text-xs text-gray-600">
            {item[1] || 1}x {item[0]}
          </div>
        ))}
        {Object.entries(countedItems).length > 3 && (
          <div className="text-xs text-gray-400">
            +{Object.entries(countedItems).length - 3} more items
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{formattedDate}</span>
        <span>{itemCount} items</span>
        <span>{order.status}</span>
      </div>
    </div>
  );
}

