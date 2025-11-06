"use client";

import { useState } from "react";
import { useSelector } from "@/app/_contexts/QuoteContext";
import { type QuoteState } from "@/app/_contexts/QuoteContext/reducer";
import { startBackgroundJob } from "@/app/actions";
import { createOrder } from "@/app/orders/actions";
import { enrichOrderWithPricesCombined } from "@/app/_components/Order";
import data from "@/app/mockdata.json";


export default function StartJob() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  
  const items = useSelector((state: QuoteState) => state.quote[0].items);

  const orderProgressValues = {
    created: '10%', 
    submitted: '20%',
    started: '30%',
  };
  const getOrderProgress = () => {
    if(msg.length > 0) return orderProgressValues.started;
    if(loading) return orderProgressValues.submitted;
    return orderProgressValues.created;
  }

  const onClick = async () => {
    setLoading(true);
    setShareUrl("");
    
    // Create order in Supabase first
    const orderResult = await createOrder(enrichOrderWithPricesCombined(items, data), {
      name: name.length > 0 ? name : "Guest",
    });

    if (orderResult.error) {
      setMsg("Failed to create order: " + orderResult.error);
      setLoading(false);
      return;
    }

    // Then trigger background job (for webhooks, notifications, etc.)
    const messageId = await startBackgroundJob(name.length > 0 ? name : "Zaratan");
    
    if (orderResult.order) {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/order?token=${orderResult.order.share_token}`;
      setShareUrl(url);
      setMsg(`Order created! ${orderResult.order.order_number}`);
      setName("");
    } else {
      setMsg("Order created but failed to start background job");
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-1 text-lg font-medium dark:text-white">
        Progreso de la orden
      </div>
      <div className="w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className="h-6 bg-blue-600 rounded-full dark:bg-blue-500"
          style={{ width: getOrderProgress() }}
        ></div>
      </div>

      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="h-10 border border-gray-300 rounded-lg p-2 my-4" />
      <button
        disabled={name.length < 2 || loading || items.length === 0}
        onClick={onClick}
        className="btn btn-primary cursor-pointer h-26 bg-green-500 text-xl sm:text-3xl rounded-lg hover:bg-green-600 bg-gray-50 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
      >
        Start Order
      </button>
      {loading && <div className="text-2xl mt-8">Loading...</div>}
      {msg && (
        <div className="text-center mt-4">
          <p className="text-lg">{msg}</p>
          {shareUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Share your order:</p>
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="w-full p-2 border rounded text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  alert('Link copied to clipboard!');
                }}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
