"use client";

import { useState } from "react";
import {startBackgroundJob} from "@/app/actions";

export default function StartJob() {
  const [loading, setLoading] = useState(false);
const [msg, setMsg] = useState("");

  const onClick = async () => {
    setLoading(true);
    const messageId =  await startBackgroundJob();
    if (messageId) {
      setMsg(`Started order with ID ${messageId}`);
    } else {
      setMsg("Failed to start the order");
    }
    setLoading(false);
  } 
  return (
    <div className="flex h-lvh items-center justify-center">
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
