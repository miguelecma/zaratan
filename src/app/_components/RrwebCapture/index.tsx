"use client";

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    rrweb?: any;
  }
}

type RrwebCaptureProps = {
  bufferSize?: number;
  endpoint?: string;
};

export default function RrwebCapture({ bufferSize = 200, endpoint = "/api/rrweb" }: RrwebCaptureProps) {
  const isStartedRef = useRef(false);
  const sendingRef = useRef(false);
  const eventsRef = useRef<any[]>([]);
  const clickSamplesRef = useRef<{ x: number; y: number; ts: number; selector: string }[]>([]);
  const recentClicksRef = useRef<{ x: number; y: number; ts: number; selector: string }[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function startRecordingIfAvailable() {
      if (isStartedRef.current) return;
      if (!window.rrweb?.record) return;

      isStartedRef.current = true;

      window.rrweb.record({
        emit(event: any) {
          const arr = eventsRef.current;
          arr.push(event);
          if (arr.length > bufferSize) {
            arr.shift();
          }
        },
      });
    }

    // Try immediately in case rrweb is already present (CDN or dynamic)
    startRecordingIfAvailable();

    // Also retry shortly in case the CDN script loads after this effect
    const retryTimer = setInterval(() => {
      if (isStartedRef.current) {
        clearInterval(retryTimer);
      } else {
        startRecordingIfAvailable();
      }
    }, 300);

    function sendBuffered(triggeredBy: string, meta?: any) {
      if (sendingRef.current) return; // basic throttle to avoid spamming
      sendingRef.current = true;

      const eventsToSend = eventsRef.current.slice();
      // eslint-disable-next-line no-console
      console.log("[rrweb] sending", eventsToSend.length, "events triggered by", triggeredBy);
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: eventsToSend, triggeredBy, meta }),
      })
        .catch(() => {})
        .finally(() => {
          // reset for next trigger
          eventsRef.current = [];
          setTimeout(() => {
            sendingRef.current = false;
          }, 1500);
        });
    }

    function sendHeatmapBatch(reason: string) {
      const batch = clickSamplesRef.current.slice();
      if (batch.length === 0) return;
      // reset immediately to avoid double send
      clickSamplesRef.current = [];
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: [], triggeredBy: "heatmap_batch", meta: { reason, clicks: batch } }),
      }).catch(() => {});
    }

    function getSelector(element: Element | null): string {
      if (!element || !(element instanceof Element)) return "unknown";
      // Build a short, privacy-friendly selector
      const parts: string[] = [];
      let el: Element | null = element;
      let depth = 0;
      while (el && depth < 4) {
        let part = el.tagName.toLowerCase();
        const id = el.getAttribute("id");
        if (id && id.length <= 64) {
          part += `#${id}`;
          parts.unshift(part);
          break;
        }
        const className = (el.getAttribute("class") || "")
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .join(".");
        if (className) part += `.${className}`;
        parts.unshift(part);
        el = el.parentElement;
        depth += 1;
      }
      return parts.join(" > ");
    }

    function handleClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const selector = getSelector(target);
      const sample = { x: Math.round(e.clientX), y: Math.round(e.clientY), ts: Date.now(), selector };
      // collect for heatmap
      clickSamplesRef.current.push(sample);

      // maintain recent clicks window (1s) for rage-click detection
      const now = sample.ts;
      const windowMs = 1000;
      const radiusPx = 30;
      recentClicksRef.current.push(sample);
      recentClicksRef.current = recentClicksRef.current.filter((c) => now - c.ts <= windowMs);
      const sameSpotClicks = recentClicksRef.current.filter((c) => {
        const dx = c.x - sample.x;
        const dy = c.y - sample.y;
        return dx * dx + dy * dy <= radiusPx * radiusPx && c.selector === sample.selector;
      });
      if (sameSpotClicks.length >= 3) {
        // trigger once and clear window to avoid immediate repeats
        sendBuffered("rage_click", { selector: sample.selector, x: sample.x, y: sample.y, count: sameSpotClicks.length });
        recentClicksRef.current = [];
      }
    }

    function onWindowError(event: ErrorEvent) {
      sendBuffered("error", { message: event.message, filename: event.filename, lineno: event.lineno, colno: event.colno });
    }

    function onUnhandledRejection(event: PromiseRejectionEvent) {
      sendBuffered("unhandledrejection", { reason: String((event as any)?.reason ?? "unknown") });
    }

    window.addEventListener("error", onWindowError);
    window.addEventListener("unhandledrejection", onUnhandledRejection as any);
    window.addEventListener("click", handleClick, { capture: true });

    // periodic heatmap batch sending
    const heatmapTimer = setInterval(() => sendHeatmapBatch("interval"), 10000);

    return () => {
      clearInterval(retryTimer);
      clearInterval(heatmapTimer);
      window.removeEventListener("error", onWindowError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection as any);
      window.removeEventListener("click", handleClick, { capture: true } as any);
    };
  }, [bufferSize, endpoint]);

  return null;
}


