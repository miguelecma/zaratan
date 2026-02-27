'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Order, OrderStatus } from '@/app/_types/database';
import { updateOrderStatus, getAllOrders } from '@/app/orders/actions';
import KanbanColumn from './KanbanColumn';
import OrderCard from './OrderCard';

interface KanbanData {
  placed: Order[];
  paid: Order[];
  ready: Order[];
}

export default function KanbanBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<KanbanData>({
    placed: initialOrders.filter(o => o.status === 'placed'),
    paid: initialOrders.filter(o => o.status === 'paid'),
    ready: initialOrders.filter(o => o.status === 'ready'),
  });
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragEndEvent) => {
    const { active } = event;
    const order = findOrderById(active.id as string);
    setActiveOrder(order);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveOrder(null);

    if (!over) return;

    const orderId = active.id as string;
    const newStatus = over.id as OrderStatus;
    const order = findOrderById(orderId);

    if (!order || order.status === newStatus) return;
    // check if new status is placed, paid or ready
    const statuses = ['placed', 'paid', 'ready'];
    if (!statuses.includes(newStatus)) return;

    // Optimistic update
    setOrders(prev => {
      const oldStatus = order.status;
      const newOrders = { ...prev };
      
      console.log(orderId, newStatus);
      // Remove from old column
      newOrders[oldStatus as keyof typeof newOrders] = newOrders[oldStatus as keyof typeof newOrders].filter((o: any) => o.id !== orderId);
      
      // Add to new column
      const updatedOrder = { ...order, status: newStatus };
      newOrders[newStatus as keyof typeof newOrders] = [...newOrders[newStatus as keyof typeof newOrders], updatedOrder];
      
      return newOrders;
    });

    // Update on server
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (result.error) {
      console.error('Failed to update order:', result.error);
      // Revert optimistic update
      setOrders(prev => {
        const newOrders = { ...prev };
        newOrders[newStatus as keyof typeof newOrders] = newOrders[newStatus as keyof typeof newOrders].filter(o => o.id !== orderId);
        newOrders[order.status as keyof typeof newOrders] = [...newOrders[order.status as keyof typeof newOrders], order];
        return newOrders;
      });
    }
  };

  const handleDragCancel = () => {
    setActiveOrder(null);
  };

  const findOrderById = (id: string): Order | null => {
    for (const column of Object.values(orders)) {
      const order = column.find((o: Order) => o.id === id);
      if (order) return order;
    }
    return null;
  };

  // Poll for updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await getAllOrders();
      if (result.orders) {
        setOrders({
          placed: result.orders.filter(o => o.status === 'placed'),
          paid: result.orders.filter(o => o.status === 'paid'),
          ready: result.orders.filter(o => o.status === 'ready'),
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 p-4 overflow-x-auto min-h-screen">
        <KanbanColumn
          key="placed"
          id="placed"
          title="Placed Orders"
          orders={orders.placed}
          color="bg-blue-50"
        />
        <KanbanColumn
          key="paid"
          id="paid"
          title="Paid Orders"
          orders={orders.paid}
          color="bg-green-50"
        />
        <KanbanColumn
          key="ready"
          id="ready"
          title="Ready Orders"
          orders={orders.ready}
          color="bg-purple-50"
        />
      </div>
      
      <DragOverlay>
        {activeOrder ? <OrderCard order={activeOrder} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}

