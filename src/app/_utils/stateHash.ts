"use client";

import { type QuoteItem } from "@/app/_types/clientQuote";
/**
 * Encode part of the state to a URL-safe hash string
 */
export const encodeStateToHash = (state: QuoteItem[]): string => {
  const json = JSON.stringify(state);
  const base64 = btoa(encodeURIComponent(json)); // URL-safe base64
  return base64;
};

/**
 * Decode a URL-safe hash string back to state
 */
export const decodeHashToState = () => {
  const params = new URLSearchParams(window.location.search);
  const encodedData = params.get('o');
  if (encodedData) {
    try {
      const json = decodeURIComponent(encodedData);
      return JSON.parse(json);
    } catch (e) {
      console.error("Failed to decode state hash:", e);
      return [];
    }
  }
  return [];
};

export const syncStateToHash = (state: QuoteItem[]) => {
  const stateString = JSON.stringify(state);

  const params = new URLSearchParams(window.location.search);
  params.set('o', encodeURIComponent(stateString));

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, '', newUrl);
};
