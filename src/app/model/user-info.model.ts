// user-info.model.ts

export type RowData = {
  id: string; // Optional ID for Firestore document
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  state: string;
  district: string;
};

export interface State {
  code: string;
  name: string;
}

export interface District {
  code: string;
  name: string;
  stateCode: string;
}
