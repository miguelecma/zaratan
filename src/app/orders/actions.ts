'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { QuoteItem } from '@/app/_types/clientQuote';
import { OrderStatus, OrderInsert } from '@/app/_types/database';

/**
 * Create a new order
 * Supports both authenticated and anonymous orders
 */
export async function createOrder(
  items: QuoteItem[],
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  }
) {
  const supabase = await createClient();
  
  // Get current user (if authenticated)
  const { data: { user } } = await supabase.auth.getUser();

  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : 0;
    return sum + price;
  }, 0);

  const orderData: OrderInsert = {
    client_id: user?.id || null,
    items,
    total_amount: totalAmount,
    status: 'placed',
    guest_name: guestInfo?.name || null,
    guest_email: guestInfo?.email || null,
    guest_phone: guestInfo?.phone || null,
  };

  const { data: order, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return { error: error.message };
  }

  // Create order event
  await supabase.from('order_events').insert({
    order_id: order.id,
    event_type: 'created',
    new_value: 'placed',
    created_by: user?.id || null,
  });

  revalidatePath('/order');
  revalidatePath('/management');
  
  return { success: true, order };
}

/**
 * Get order by ID
 * Can be accessed by owner or anyone with valid share token
 */
export async function getOrder(orderId: string) {
  const supabase = await createClient();
  
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { order };
}

/**
 * Get order by share token
 * Allows anyone with the token to view the order
 */
export async function getOrderByShareToken(shareToken: string) {
  const supabase = await createClient();
  
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('share_token', shareToken)
    .gt('share_expires_at', new Date().toISOString())
    .single();

  if (error) {
    return { error: 'Order not found or share link expired' };
  }

  return { order };
}

/**
 * Get all orders for current user
 */
export async function getMyOrders() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { orders };
}

/**
 * Get all orders (for restaurant management)
 * Requires service role or appropriate permissions
 */
export async function getAllOrders() {
  const supabase = await createClient();
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { orders };
}

/**
 * Get orders by status (for Kanban board)
 */
export async function getOrdersByStatus(status: OrderStatus) {
  const supabase = await createClient();
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { orders };
}

/**
 * Update order status
 * Creates an audit event
 */
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  // Get current order for audit trail
  const { data: currentOrder } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  const oldStatus = currentOrder?.status;

  // Update order
  const { error } = await supabase
    .from('orders')
    .update({ 
      status: newStatus,
      completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined,
    })
    .eq('id', orderId);

  if (error) {
    return { error: error.message };
  }

  // Create order event
  await supabase.from('order_events').insert({
    order_id: orderId,
    event_type: 'status_change',
    old_value: oldStatus,
    new_value: newStatus,
    created_by: user?.id || null,
  });

  revalidatePath('/management');
  
  return { success: true };
}

/**
 * Update order items
 */
export async function updateOrderItems(orderId: string, items: QuoteItem[]) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  // Recalculate total
  const totalAmount = items.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : 0;
    return sum + price;
  }, 0);

  const { error } = await supabase
    .from('orders')
    .update({ 
      items,
      total_amount: totalAmount,
    })
    .eq('id', orderId);

  if (error) {
    return { error: error.message };
  }

  // Create order event
  await supabase.from('order_events').insert({
    order_id: orderId,
    event_type: 'updated',
    new_value: 'items_updated',
    created_by: user?.id || null,
  });

  revalidatePath('/order');
  revalidatePath('/management');
  
  return { success: true };
}

/**
 * Generate a shareable URL for an order
 */
export async function getOrderShareUrl(orderId: string) {
  const supabase = await createClient();
  
  const { data: order } = await supabase
    .from('orders')
    .select('share_token')
    .eq('id', orderId)
    .single();

  if (!order) {
    return { error: 'Order not found' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/order?token=${order.share_token}`;
  
  return { shareUrl };
}

/**
 * Delete an order (soft delete by marking as cancelled)
 */
export async function cancelOrder(orderId: string) {
  return updateOrderStatus(orderId, 'cancelled');
}

