import KanbanBoard from '@/app/_components/Kanban/KanbanBoard';
import { getAllOrders } from '@/app/orders/actions';

export default async function Page() {
  const result = await getAllOrders();
  const orders = result.orders || [];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">
            Drag and drop orders between columns to update their status
          </p>
        </div>
        
        <KanbanBoard initialOrders={orders} />
      </div>
    </main>
  );
}
