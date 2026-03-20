"use client";

import AdminNavbar from "@/components/AdminNavbar";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { Context } from "@/store/context";
import ACTIONS from "@/store/actions";
import styles from "../../styles/admin.module.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { InsightsData, KpiProps } from "@/lib/utils";
import Loader from "@/components/Loader";

const COLORS = ["#173F36", "#2E5E52", "#C9A25E", "#E1C88A"];

const Admin = () => {
  const { dispatch } = useContext(Context);
  const [data, setData] = useState<InsightsData | null>(null);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    const getInsights = async () => {
      setLoader(true);
      try {
        const res = await fetch("/api/insight");
        const json = await res.json();
        if (json.success) setData(json.data);
        else toast.error(json.message);
      } catch (err) {
        toast.error("Failed to fetch insights");
      } finally {
        setLoader(false);
      }
    };
    getInsights();
  }, []);

    useEffect(() => {
        const getInventory = async () => {
            try {
                const res = await fetch("/api/inventory");

                const data = await res.json();
                if(data.success) {
                    dispatch({ type: ACTIONS.SET_INVENTORY, payload: data.data || [] })
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast(`Failed to get inventory details. Please try again. ${error}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: "error",
                    theme: "light",
                    transition: Bounce,
                });
            }
        };
        getInventory();
    }, []);

  // ===== Monthly Data =====
  const monthly = useMemo(() => {
    if (!data) return [];
    return Object.keys(data.trends.monthly)
      .sort()
      .map((key) => ({
        month: key,
        profit: data.trends.monthly[key].profit,
        revenue: data.trends.monthly[key].revenue,
      }));
  }, [data]);

  // ===== Product Data =====
  const productData = useMemo(() => {
    if (!data) return [];
    return Object.keys(data.products).map((key) => ({
      name: key,
      quantity: data.products[key].quantity,
      profit: data.products[key].profit,
    }));
  }, [data]);

  // ===== Expense Breakdown =====
  const expenseData = useMemo(() => {
    if (!data?.expenseBreakdown) return [];
    return [
      { name: "Fixed", value: data.expenseBreakdown.fixed },
      { name: "Variable", value: data.expenseBreakdown.variable },
      { name: "Marketing", value: data.expenseBreakdown.marketing },
    ];
  }, [data]);

  if (!data) return <div className={styles.loader}>Loading...</div>;

  return (
    <div className={styles.container}>
      <AdminNavbar />

      <h1 className={styles.heading}>Business Dashboard</h1>

      {/* ===== KPI ===== */}
      <div className={styles.grid}>
        <Kpi label="Total Revenue" value={data.financial.totalRevenue} />
        <Kpi label="Net Revenue" value={data.financial.totalNetRevenue} />
        <Kpi label="Total Profit" value={data.financial.totalProfit} variant="green" />
        <Kpi label="Profit (After Inventory)" value={data.financial.totalProfitWithInventoryCost} variant="gold" />
        <Kpi label="GST Paid" value={data.financial.totalGST} />
        <Kpi label="Burn Rate" value={data.business.burnRate} variant="gold" />
      </div>

      {/* ===== Monthly Trend ===== */}
      <div className={styles.cardLarge}>
        <h2 className={styles.subHeading}>Revenue vs Profit Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#2E5E52" />
            <Line type="monotone" dataKey="profit" stroke="#C9A25E" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Product Insights ===== */}
      <div className={styles.gridTwo}>
        <div className={styles.cardLarge}>
          <h2 className={styles.subHeading}>Product Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#173F36" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.cardLarge}>
          <h2 className={styles.subHeading}>Profit Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={productData} dataKey="profit" nameKey="name" outerRadius={100} label>
                {productData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== Expense Breakdown ===== */}
      <div className={styles.cardLarge}>
        <h2 className={styles.subHeading}>Expense Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={expenseData} dataKey="value" nameKey="name" outerRadius={100} label>
              {expenseData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Inventory + Credit ===== */}
      <div className={styles.gridThree}>
        <div className={styles.card}>
          <p className={styles.label}>Inventory Value</p>
          <h2 className={styles.value}>₹{data.inventory.inventoryValue.toLocaleString()}</h2>
        </div>

        <div className={styles.card}>
          <p className={styles.label}>Credit Given</p>
          <h2 className={styles.valueGold}>
            {data.creditInventory.remainingCount} / {data.creditInventory.totalCount}
          </h2>
        </div>
      </div>

      {loader && <Loader />}
    </div>
  );
};

// ===== KPI Component =====
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
        ₹{Number(value || 0).toLocaleString()}
      </h2>
    </div>
  );
}

export default Admin;