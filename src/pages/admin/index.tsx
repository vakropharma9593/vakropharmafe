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

    // ===== Customers =====
    const topCustomers = useMemo(() => data?.customers?.topCustomers || [], [data]);
    const repeatCustomers = useMemo(() => data?.customers?.repeatCustomers || [], [data]);

    // ===== Alerts =====
    const reorderAlerts = data?.alerts?.reorder;
    const inventoryAlerts = data?.alerts?.inventory;

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
        <Kpi label="Revenue / Customer" value={data.customers.revenuePerCustomer} />
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

      {/* ===== REORDER ALERTS ===== */}
    <div className={styles.cardLarge}>
        <h2 className={styles.subHeading}>Reorder Alerts</h2>

        <div className={styles.gridThree}>
            {[
            { title: "1 Month Old", data: reorderAlerts?.oneMonth },
            { title: "6 Months Old", data: reorderAlerts?.sixMonth },
            { title: "1 Year Old", data: reorderAlerts?.oneYear },
            ].map((section, idx) => (
            <div key={idx} className={styles.alertBox}>
                <h3 className={styles.alertTitle}>{section.title}</h3>

                {section.data?.length ? (
                section.data.map((item, i) => (
                    <div key={i} className={styles.alertItem}>
                    <div>
                        <strong>{item.customerName}</strong>
                        <p className={styles.muted}>{item.phone}</p>
                    </div>
                    <p className={styles.mutedSmall}>
                        {item.products.join(", ")}
                    </p>
                    </div>
                ))
                ) : (
                <p className={styles.muted}>No data</p>
                )}
            </div>
            ))}
        </div>
    </div>

    {/* ===== CUSTOMER INSIGHTS ===== */}
    <div className={styles.gridTwo}>
        <div className={styles.cardLarge}>
            <h2 className={styles.subHeading}>Top Customers</h2>

            {topCustomers.map((c, i) => (
            <div key={i} className={styles.listItem}>
                <span>{c.name}</span>
                <span className={styles.gold}>₹{c.totalRevenue.toLocaleString()}</span>
            </div>
            ))}
        </div>

        <div className={styles.cardLarge}>
            <h2 className={styles.subHeading}>Repeat Customers</h2>

            {repeatCustomers.map((c, i) => (
            <div key={i} className={styles.listItem}>
                <span>{c.name}</span>
                <span className={styles.muted}>{c.orderCount} orders</span>
            </div>
            ))}
        </div>
    </div>

    {/* ===== ALERTS ===== */}
    <div className={styles.gridTwo}>
        {/* LOW STOCK */}
        <div className={styles.cardLarge}>
            <h2 className={styles.subHeading}>Low Stock</h2>

            {inventoryAlerts?.lowStock?.length ? (
                inventoryAlerts.lowStock.map((item, i) => (
                    <div key={i} className={styles.listItem}>
                    <span>{item.itemName}</span>
                    <span className={styles.gold}>{item.remainingCount}</span>
                    </div>
                ))
                ) : (
                <p className={styles.muted}>All good</p>
            )}
        </div>

        {/* EXPIRY */}
        <div className={styles.cardLarge}>
            <h2 className={styles.subHeading}>Expiry (30 days)</h2>

            {inventoryAlerts?.expiry?.length ? (
                inventoryAlerts.expiry.map((item, i) => (
                    <div key={i} className={styles.listItem}>
                    <span>{item.itemName}</span>
                    <span className={styles.gold}>
                        {item?.expiryDate ? new Date(item?.expiryDate).toLocaleDateString() : ""}
                    </span>
                    </div>
                ))
                ) : (
                <p className={styles.muted}>No risk</p>
            )}
        </div>
    </div>

    {/* LOSS PRODUCTS */}
    <div className={styles.cardLarge}>
        <h2 className={styles.subHeading}>Loss Making Products</h2>

        {inventoryAlerts?.lossMakingProducts?.length ? (
            inventoryAlerts.lossMakingProducts.map((item, i) => (
            <div key={i} className={styles.listItem}>
                <span>{item.productName}</span>
                <span className={styles.gold}>₹{item.profit}</span>
            </div>
            ))
        ) : (
            <p className={styles.muted}>No losses 🎉</p>
        )}
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