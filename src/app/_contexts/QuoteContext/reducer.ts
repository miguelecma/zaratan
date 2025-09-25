import {
  type FormEntry,
  type ClientQuote,
  QuoteItem,
} from "@/app/_types/clientQuote";
import { syncStateToHash, decodeHashToState } from "@/app/_utils/stateHash";

const getPriceState = (_a: any, _b: any) => {}; //TODO

const STEP_NUMBER = "STEP_NUMBER";

export type QuoteState = {
  [STEP_NUMBER]: number;
  form: FormEntry; //TODO: define the type for quote, update form type
  quote: ClientQuote[];
};

const objectWindowExists = typeof window !== 'undefined';
const initialQuote = objectWindowExists ? decodeHashToState() : [];
//TODO: define the type for quote, update form type
export const INITIAL_STATE: QuoteState = {
  [STEP_NUMBER]: 0,
  form: {
    fieldID: "",
    fieldValue: "",
  },
  quote: [
    {
      items: [...initialQuote],
      detail: null,
    },
  ],
};

export enum ActionsTypes {
  SET_STEP_NUMBER = "SET_STEP_NUMBER",
  SET_FORM = "SET_FORM",
  ADD_ONE = "ADD_ONE",
  DELETE_ONE = "DELETE_ONE",
  DELETE_ALL_ITEMS = "DELETE_ALL_ITEMS",
  SET_RULE_1 = "SET_RULE_1",
}

interface SetStepNumber {
  type: ActionsTypes.SET_STEP_NUMBER;
  payload: number;
}

interface SetForm {
  type: ActionsTypes.SET_FORM;
  payload: FormEntry;
}

interface SetRule1 {
  type: ActionsTypes.SET_RULE_1;
  payload: FormEntry | null;
}

interface SetQuantity {
  type:
    | ActionsTypes.ADD_ONE
    | ActionsTypes.DELETE_ONE
    | ActionsTypes.DELETE_ALL_ITEMS;
  payload: string;
}

export type Action = SetStepNumber | SetForm | SetRule1 | SetQuantity;

export const actionCreators = {
  setStepNumber: (step: number): SetStepNumber => ({
    type: ActionsTypes.SET_STEP_NUMBER,
    payload: step,
  }),
  setForm: (data: FormEntry): SetForm => ({
    type: ActionsTypes.SET_FORM,
    payload: data,
  }),
  setRule1: (data: FormEntry): SetRule1 => ({
    type: ActionsTypes.SET_RULE_1,
    payload: data,
  }),
  increment: (itemId: string): SetQuantity => ({
    type: ActionsTypes.ADD_ONE,
    payload: itemId,
  }),
  decrement: (itemId: string): SetQuantity => ({
    type: ActionsTypes.DELETE_ONE,
    payload: itemId,
  }),
  deleteAllItems: (itemId: string): SetQuantity => ({
    type: ActionsTypes.DELETE_ALL_ITEMS,
    payload: itemId,
  }),
};

export const reducer = (state: QuoteState, action: Action): QuoteState => {
  switch (action.type) {
    case ActionsTypes.SET_STEP_NUMBER: {
      return { ...state, [STEP_NUMBER]: action.payload };
    }
    case ActionsTypes.SET_FORM: {
      const { fieldID, fieldValue } = action.payload;

      // It'll call the rules each time I use the state
      return {
        ...state,
        form: { ...state.form, fieldID, fieldValue },
        quote: [...state.quote],
      };
    }
    // Always edit the first order by now
    case ActionsTypes.ADD_ONE: {
      const { payload } = action;
      let newClientQuote = [...state.quote];

      if (newClientQuote[0].items?.length === 0) {
        const item: QuoteItem = {
          id: payload,
        };
        const clientQuote = {
          items: [item],
          detail: null,
        };
        newClientQuote = [clientQuote];
      } else {
        const newQuote = { ...newClientQuote[0] };
        const item: QuoteItem = {
          id: payload,
        };
        newQuote.items = [...newClientQuote[0].items, item];
        newClientQuote = [newQuote];
      }

      // It'll call the rules each time I use the state
      syncStateToHash(newClientQuote[0].items);
      return {
        ...state,
        quote: newClientQuote,
      };
    }
    case ActionsTypes.DELETE_ONE: {
      const { payload } = action; // assuming payload is the id (string | number)
      let newClientQuote = [...state.quote];

      if (newClientQuote.length === 0 || !newClientQuote[0].items) {
        // Nothing to remove
        return state;
      }

      const currentQuote = { ...newClientQuote[0] };
      const items = [...currentQuote.items];

      const indexToRemove = items.findIndex((item) => item.id === payload);

      if (indexToRemove === -1) {
        // No match found, nothing to remove
        return state;
      }

      // Remove only one match
      items.splice(indexToRemove, 1);

      currentQuote.items = items;
      newClientQuote = [currentQuote];

      syncStateToHash(newClientQuote[0].items);
      return {
        ...state,
        quote: newClientQuote,
      };
    }
    case ActionsTypes.DELETE_ALL_ITEMS: {
      const { payload } = action;
      let newClientQuote = [...state.quote];

      if (newClientQuote.length === 0 || !newClientQuote[0].items) {
        // Nothing to remove
        return state;
      }

      const currentQuote = { ...newClientQuote[0] };
      currentQuote.items = currentQuote.items.filter(
        (item) => item.id !== payload
      );
      newClientQuote = [currentQuote];

      // It'll call the rules each time I use the state
      syncStateToHash(newClientQuote[0].items); 
      return {
        ...state,
        quote: newClientQuote,
      };
    }
    case ActionsTypes.SET_RULE_1: {
      // TODO: Rules implementations should be in another file
      // This is a fake Business rule!
      const payload = { action };
      const myRule = (Math.floor(Math.random() * 3) + 1) * 10000;
      const IVA = 0.19;

      const myQuote: ClientQuote = {
        items: [],
        detail: {
          total: myRule,
          net: Math.floor(myRule * (1 + IVA)),
        },
      };
      return {
        ...state,
        quote: {
          ...state.quote,
          ...myQuote,
        },
      };
    }
    default: {
      return state;
    }
  }
};
