"use client";

import AdminNavbar from "@/components/AdminNavbar";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { Context } from "@/store/context";
import ACTIONS from "@/store/actions";
import styles from "../../styles/admin.module.css";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import Loader from "@/components/Loader";

const COLORS = ["#173F36", "#2E5E52", "#C9A25E", "#E1C88A"];

type MonthlyTrend = {
  revenue: number;
  orders: number;
};

type InsightData = {
  financial: {
    totalRevenue: number;
    totalNetRevenue: number;
    totalGST: number;
    totalExpense: number;
    grossProfit: number;
    netProfit: number;
    realProfitAfterGST: number;
    realMargin: number;
  };
  trends: {
    monthly: Record<string, MonthlyTrend>;
  };
  expenseBreakdown: {
    fixed: number;
    variable: number;
    marketing: number;
  };
  credit: {
    totalCredit: number;
    outstandingCredit: number;
  };
  inventory: {
    inventoryValue: number;
  };
  business: {
    burnRate: number;
  };
  customers: {
    topCustomers: [string, number][];
  };
  alerts: {
    inventory: {
      lowStock: unknown[];
      expiry: unknown[];
    };
  };
};

const Admin = () => {
  const { dispatch } = useContext(Context);
  const [data, setData] = useState<InsightData | null>(null);
  const [loader, setLoader] = useState(false);

  /** =========================
   * FETCH INSIGHTS
   ========================== */
  useEffect(() => {
    const getInsights = async () => {
      setLoader(true);
      try {
        const res = await fetch("/api/insight");
        const json = await res.json();
        setData(json);
      } catch {
        toast.error("Failed to fetch insights");
      } finally {
        setLoader(false);
      }
    };
    getInsights();
  }, []);

  /** =========================
   * KEEP EXISTING CALLS
   ========================== */
  useEffect(() => {
    const getInventory = async () => {
      try {
        const res = await fetch("/api/inventory");
        const data = await res.json();

        if (data.success) {
          dispatch({
            type: ACTIONS.SET_INVENTORY,
            payload: data.data || [],
          });
        }
      } catch (error) {
        toast(`Inventory error: ${error}`, { type: "error", transition: Bounce });
      }
    };

    const getProducts = async () => {
      try {
        const res = await fetch("api/product");
        const data = await res.json();

        if (data.success) {
          dispatch({
            type: ACTIONS.SET_PRODUCTS,
            payload: data.data || [],
          });
        }
      } catch {
        toast.error("Failed to fetch products");
      }
    };

    getInventory();
    getProducts();
  }, []);

  /** =========================
   * MONTHLY DATA
   ========================== */
  const monthly = useMemo(() => {
    if (!data?.trends?.monthly) return [];

    return Object.keys(data.trends.monthly)
      .sort()
      .map((key) => ({
        month: key,
        revenue: data.trends.monthly[key].revenue,
        orders: data.trends.monthly[key].orders,
      }));
  }, [data]);

  /** =========================
   * EXPENSE PIE
   ========================== */
  const expenseData = useMemo(() => {
    if (!data?.expenseBreakdown) return [];
    return [
      { name: "Fixed", value: data.expenseBreakdown.fixed },
      { name: "Variable", value: data.expenseBreakdown.variable },
      { name: "Marketing", value: data.expenseBreakdown.marketing },
    ];
  }, [data]);

  if (!data) return <div className={styles.loader}>Loading...</div>;

  const f = data.financial;

  return (
    <div className={styles.container}>
      <AdminNavbar />
      <h1 className={styles.heading}>Investor Dashboard</h1>

      {/* ================= KPI ================= */}
      <div className={styles.grid}>
        <Kpi label="Revenue" value={f.totalRevenue} />
        <Kpi label="Net Revenue" value={f.totalNetRevenue} />
        <Kpi label="GST" value={f.totalGST} />
        <Kpi label="Expense" value={f.totalExpense} />

        <Kpi label="Gross Profit" value={f.grossProfit} variant="green" />
        <Kpi label="Net Profit" value={f.netProfit} variant="green" />
        <Kpi label="Real Profit" value={f.realProfitAfterGST} variant="green" />
        <Kpi label="Margin %" value={f.realMargin} variant="gold" />
      </div>

      {/* ================= TREND ================= */}
      <div className={styles.cardLarge}>
        <h2 className={styles.subHeading}>Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#2E5E52" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= ORDERS ================= */}
      <div className={styles.cardLarge}>
        <h2 className={styles.subHeading}>Orders Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#C9A25E" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= EXPENSE ================= */}
      <div className={styles.cardLarge}>
        <h2 className={styles.subHeading}>Expense Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={expenseData} dataKey="value" outerRadius={100} label>
              {expenseData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ================= CREDIT ================= */}
      <div className={styles.grid}>
        <Kpi label="Total Credit" value={data.credit.totalCredit} />
        <Kpi label="Outstanding" value={data.credit.outstandingCredit} variant="gold" />
      </div>

      {/* ================= INVENTORY ================= */}
      <div className={styles.grid}>
        <Kpi label="Inventory Value" value={data.inventory.inventoryValue} />
        <Kpi label="Burn Rate" value={data.business.burnRate} />
      </div>

      {/* ================= CUSTOMER ================= */}
      <div className={styles.cardLarge}>
        <h2 className={styles.subHeading}>Top Customers</h2>
        {data.customers.topCustomers.map((c: [string, number], i: number) => (
          <div key={i} className={styles.listItem}>
            <span>{c[0]}</span>
            <span>₹{c[1]}</span>
          </div>
        ))}
      </div>

      {/* ================= ALERTS ================= */}
      <div className={styles.cardLarge}>
        <h2 className={styles.subHeading}>Alerts</h2>

        <div className={styles.alertBox}>
          <p className={styles.alertTitle}>Low Stock</p>
          {data.alerts.inventory.lowStock.length === 0 && (
            <p className={styles.mutedSmall}>No issues</p>
          )}
        </div>

        <div className={styles.alertBox}>
          <p className={styles.alertTitle}>Expiring Soon</p>
          {data.alerts.inventory.expiry.length === 0 && (
            <p className={styles.mutedSmall}>No issues</p>
          )}
        </div>
      </div>

      {loader && <Loader />}
    </div>
  );
};

type KpiProps = {
  label: string;
  value: number | string;
  variant?: "green" | "gold";
};

function Kpi({ label, value, variant }: KpiProps) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <h2
        className={
          variant === "green"
            ? styles.valueGreen
            : variant === "gold"
            ? styles.valueGold
            : styles.value
        }
      >
        ₹{typeof value === "number" ? value.toFixed(1) : value}
      </h2>
    </div>
  );
}

export default Admin;