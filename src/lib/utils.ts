import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ActionMap<M extends { [index: string]: unknown }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export interface ReactChild {
  children: React.ReactNode | React.ReactElement;
}

export const dateToShow = (date: string) => {
  if (!date) return "";
  const dateMain = date?.split("T")[0];
  const [YYYY, MM, DD] = dateMain.split("-");
  return `${DD}-${MM}-${YYYY}`;
}

export const getExpiryClass = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays <= 7) return "red";
  if (diffDays <= 30) return "yellow";
  if (diffDays <= 0) return "expired";

  return "basic";
};

export const formatStatus = (status: string) => {
  if (status && status !== "") {
    return status.replace(/_/g, " ");
  } else return "";
}
  

export type Product = {
  productId: string;
  productName: string;
  totalPrice: number;
  batch: string;
  batchId: string;
  quantity: number;
  freeQuantity?: number;
  discountPercentage: number;
  accountTotalPrice?: number;
  totalGstPayable?: number;
  totalCostPrice?: number;
  totalProfit?: number;
  totalAmountReceived?: number;
};

export const isLastRowEmpty = (products: Product[]) => {
  const lastProduct = products[products?.length - 1];
    if (lastProduct.productName && lastProduct?.batch && lastProduct?.quantity) {
      return false;
    } else {
      return true;
    }
}

export enum PurposeType {
  PRODUCT = "Product",
  SALARY = "Salary",
  MARKETING = "Marketing",
  RENT_ELECTRICITY = "Rent & Electricity",
  OTHER = "Other"
}

export enum PaymentType {
  CASH = "Cash",
  UPI = "UPI",
  BANK_TRANSFER = "Bank Transfer",
  CHEQUE = "Cheque"
}

export const booleanToYesNo = (value: boolean) => {
  if (value) return "Yes";
  else return "No";
}

export type ProductType = {
  _id?: string;
  name: string;
  mrp: number;
  costPrice: number;
  gstPercentage: number;
  gstPercentageOnCostPrice: number;
  isActive: boolean;
  slug?: string;
  updatedAt?: string;
}

export enum PaymentModeType {
    CASH = "Cash",
    UPI = "UPI",
    BANK_TRANSFER = "Bank Transfer",
    CHEQUE = "Cheque",
}

export enum OrderStatusType  {
  PREPARING = "Preparing",
  DISPATCHED = "Dispatched",
  DELIVERED = "Delivered",
}

export enum PaymentStatusType  {
  PAYMENT_PENDING = "Payment Pending",
  PAYMENT_DONE = "Payment Done",
}

export enum CustomerType {
  INDIVIDUAL = "Individual",
  WHOLE_SALE = "Whole_Sale",
  RETAIL = "Retail",
  DOCTOR = "Doctor",
}

export enum OrderType { 
  CREDIT_ORDER = "Credit Order",
  DIRECT_CUSTOMER = "Direct Customer",
  SAMPLE = "Sample"
}

export enum ExpenseCategoryType {
  COGS = "COGS",
  FIXED_OPEX = "Fixed Opex",
  MARKETING = "Marketing",
  VARIABLE = "Variable",
}

export type Review = {
  _id?: string;
  reviewerName: string;
  productId?: {
    _id: string;
    slug: string;
    name: string;
  };
  skinType?: string;
  skinConcern?: string;
  rating: number;
  review: string;
  phone?: string;
  email?: string;
  isVerifiedUser?: boolean;
};