"use client";
import { useReducer } from "react";
import {
  reducer as quoteReducer,
  INITIAL_STATE,
} from "./reducer";
import { Context as QuoteContext } from "./index";

export const QuoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [quoteState, quoteDispatch] = useReducer(
    quoteReducer,
    INITIAL_STATE,
  );
  
  return (
    <QuoteContext.Provider
      value={{ state: quoteState, dispatch: quoteDispatch }}
    >
      {children}
    </QuoteContext.Provider>
  );
};
