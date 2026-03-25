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
  productId: string;
  productName: string;
  totalPrice: number;
  batch: string;
  batchId: string;
  quantity: number;
  discountPercentage: number;
};

export const isLastRowEmpty = (products: Product[]) => {
  const lastProduct = products[products?.length - 1];
    if (lastProduct.productName && lastProduct?.batch && lastProduct?.discountPercentage && lastProduct?.totalPrice && lastProduct?.quantity) {
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

type ProductInsight = {
  quantity: number;
  revenue: number;
  profit: number;
};

type MonthlyData = {
  revenue: number;
  expense: number;
  profit: number;
};

type AlertOrder = {
  customerName: string;
  phone: string;
  products: string[];
  lastOrderDate: Date;
};

type CustomerInsight = {
  name: string;
  phone: string;
  totalRevenue: number;
  orderCount: number;
};

type InventoryAlert = {
  itemName: string;
  batch: string;
  remainingCount: number;
  expiryDate?: string;
};

type LossAlert = {
  productName: string;
  profit: number;
};

export type InsightsData = {
  financial: {
    totalRevenue: number;
    totalNetRevenue: number;
    totalGST: number;
    totalExpense: number;
    totalProfit: number;
    totalProductProfit: number;
    totalProfitWithInventoryCost: number;
  };
  inventory: {
    inventoryValue: number;
  };
  products: Record<string, ProductInsight>;
  unitEconomics:Record<
      string,
      {
        sellingPrice: number;
        costPrice: number;
        profitPerUnit: number;
        margin: number;
      }>;
  trends: {
    monthly: Record<string, MonthlyData>;
  };
  business: {
    burnRate: number;
  };
  creditInventory: {
    totalCount: number;
    remainingCount: number;
  };
  expenseBreakdown: {
    fixed: number;
    variable: number;
    marketing: number;
  },
  alerts: {
    reorder: {
        oneMonth: AlertOrder[];
        sixMonth: AlertOrder[];
        oneYear: AlertOrder[];
    };
    inventory: {
        lowStock: InventoryAlert[];
        expiry: InventoryAlert[];
        lossMakingProducts: LossAlert[];
    };
  };
  customers: {
      topCustomers: CustomerInsight[];
      repeatCustomers: CustomerInsight[];
      revenuePerCustomer: number;
  };
};

export type KpiProps = {
  label: string;
  value: number;
  variant?: "green" | "gold";
};

export type ProductType = {
  _id?: string;
  name: string;
  mrp: number;
  costPrice: number;
  gstPercentage: number;
}

export enum PaymentModeType {
    CASH = "Cash",
    UPI = "UPI",
    BANK_TRANSFER = "Bank Transfer",
    CHEQUE = "Cheque",
}