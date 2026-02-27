import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { user, order } = data;

    const supabase = await createClient();

    // Get current authenticated user (if any)
    const { data: { user: authUser } } = await supabase.auth.getUser();

    // Calculate total amount from order items
    const totalAmount = order?.reduce((sum: number, item: any) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0) || 0;

    // Create order in Supabase
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        client_id: authUser?.id || null,
        items: order || [],
        total_amount: totalAmount,
        status: 'placed',
        guest_name: authUser ? null : user,
        metadata: { source: 'qstash_webhook' }
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order in Supabase:', orderError);
      return NextResponse.json(
        { success: false, error: orderError.message },
        { status: 500 }
      );
    }

    // Create order event
    await supabase.from('order_events').insert({
      order_id: orderData.id,
      event_type: 'created',
      new_value: 'placed',
      metadata: { source: 'qstash_webhook', user_name: user },
    });

    // Still send to webhook for external integrations if needed
    try {
      await fetch("https://firstqstashmessage.requestcatcher.com/test", {
        method: "POST",
        body: JSON.stringify({ ...data, order_id: orderData.id }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (webhookError) {
      console.error('Webhook error (non-critical):', webhookError);
    }

    return NextResponse.json({ 
      success: true, 
      order: orderData,
      share_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order?token=${orderData.share_token}`
    });

  } catch (error) {
    console.error('Error in register API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

