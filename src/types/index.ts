export type SplitType = "equal" | "unequal" | "percentage";

export interface PaymentEntry {
  userId: string;
  amount: number;
}

export interface SplitDetails {
  [userId: string]: number; // amount for unequal, percentage (0-100) for percentage
}

export interface IUser {
  _id: string;
  phone: string;
  name?: string;
  createdAt: Date;
}

export interface IGroup {
  _id: string;
  name: string;
  createdBy: string;
  memberIds: string[];
  createdAt: Date;
}

export interface IExpense {
  _id: string;
  group: string;
  title: string;
  amount: number;
  currency: string;
  splitType: SplitType;
  splitDetails: SplitDetails;
  payments: PaymentEntry[];
  receiptKey?: string;
  createdBy: string;
  createdAt: Date;
}
