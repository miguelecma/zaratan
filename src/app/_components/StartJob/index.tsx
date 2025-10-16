"use client";

import { useState } from "react";
import { startBackgroundJob } from "@/app/actions";

export default function StartJob() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");

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
    const messageId = await startBackgroundJob(name.length > 0 ? name : "Zaratan");
    if (messageId) {
      setMsg(`Started order with ID ${messageId}`);
      setName("");
    } else {
      setMsg("Failed to start the order");
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
        disabled={name.length < 2 || loading}
        onClick={onClick}
        className="btn btn-primary cursor-pointer h-26 bg-green-500 text-xl sm:text-3xl rounded-lg hover:bg-green-600 bg-gray-50 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
      >
        Start Order
      </button>
      {loading && <div className="text-2xl mt-8">Loading...</div>}
      {msg && <p className="text-center text-lg">{msg}</p>}
    </div>
  );
}
