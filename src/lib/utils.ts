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

export const formatStatus = (status: string) =>
  status.replace(/_/g, " ");

export type Product = {
  productName: string;
  sellingPrice: number;
  batch: string;
  quantity: number;
  discountPercentage: number;
};

export const isLastRowEmpty = (products: Product[]) => {
  const lastProduct = products[products?.length - 1];
    if (lastProduct.productName && lastProduct?.batch && lastProduct?.discountPercentage && lastProduct?.sellingPrice && lastProduct?.quantity) {
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
