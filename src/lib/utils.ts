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

  if (diffDays <= 7) return "expiry-red";
  if (diffDays <= 30) return "expiry-yellow";
  if (diffDays <= 0) return "expiry-expired";

  return "";
};
