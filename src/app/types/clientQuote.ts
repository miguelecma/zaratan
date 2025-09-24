export enum QuoteFormFields {
  name = "name",
  email = "email",
  tel = "tel",
};

export type FieldValueType = string | boolean | number;

// {fieldID: name of the user, fieldValue: id of the order}
export type FormEntry = {
  fieldID: string;
  fieldValue: FieldValueType
};

export type QuoteItem = Record<string, FieldValueType>

export type ClientQuote = {
  items: QuoteItem[];
  detail: QuoteItem | null;
};
