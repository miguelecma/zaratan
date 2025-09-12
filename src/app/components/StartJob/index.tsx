"use client";

import { useState } from "react";
import { startBackgroundJob } from "@/app/actions";

export default function StartJob() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onClick = async () => {
    setLoading(true);
    const messageId = await startBackgroundJob();
    if (messageId) {
      setMsg(`Started order with ID ${messageId}`);
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
          style={{ width: "45%" }}
        ></div>
      </div>
      <button
        onClick={onClick}
        className="btn btn-primary cursor-pointer h-26 bg-green-500 text-xl sm:text-3xl rounded-lg hover:bg-green-600"
      >
        Start Order
      </button>
      {loading && <div className="text-2xl mt-8">Loading...</div>}
      {msg && <p className="text-center text-lg">{msg}</p>}
    </div>
  );
}
