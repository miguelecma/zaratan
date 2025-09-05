import { type FormEntry, type ClientQuote } from "@/app/types/clientQuote";

const getPriceState = (_a: any, _b: any) => {} //TODO

const STEP_NUMBER = "STEP_NUMBER";

export interface QuoteState {
  [STEP_NUMBER]: number;
  form: FormEntry; //TODO: define the type for quote, update form type
  quote: ClientQuote[];
}

//TODO: define the type for quote, update form type
export const INITIAL_STATE: QuoteState = {
  [STEP_NUMBER]: 0,
  form: {
    fieldID: '',
    fieldValue: '',
  },
  quote: [],
};

export enum ActionsTypes {
  SET_STEP_NUMBER = "SET_STEP_NUMBER",
  SET_FORM = "SET_FORM",
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

export type Action = SetStepNumber | SetForm | SetRule1;

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
};

export const reducer = (state: QuoteState, action: Action): QuoteState => {  
  switch (action.type) {
    case ActionsTypes.SET_STEP_NUMBER: {
      return { ...state, [STEP_NUMBER]: action.payload };
    }
    case ActionsTypes.SET_FORM: {
      const {fieldID, fieldValue} = action.payload;
      
      // It'll call the rules each time I use the state
      return { 
        ...state,
        form: { ...state.form, fieldID, fieldValue },
        quote: [...state.quote ]
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
          net: Math.floor(myRule * (1+IVA)),
        }
      }
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
