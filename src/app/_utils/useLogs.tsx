import { useEffect, useState, use } from "react";
import { getLogs } from "@/app/actions";

const fetchLogs = async () => {
  const logs = await getLogs();
  return logs.events;
};

export const useLogs = () => {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
  return { logs };
};