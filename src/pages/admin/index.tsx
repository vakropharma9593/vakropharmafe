"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import styles from "../../styles/admin.module.css";
import { InsightsResponse, ProductType } from "@/lib/utils";
import { Context } from "@/store/context";
import { toast, Bounce } from "react-toastify";
import ACTIONS from "@/store/actions";
import Loader from "@/components/Loader";
import AdminNavbar from "@/components/AdminNavbar";
import { InventoryItem } from "@/store/reducers/adminReducer";

const InsightsPage = () => {
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loader, setLoader] = useState(false);
  const { dispatch, state } = useContext(Context);
  const stateInventory = state.adminData.inventory;
  const stateProducts = state.adminData.products;

  useEffect(() => {
    const getInsights = async () => {
      setLoader(true);
      try {
        const res = await fetch("/api/insight");
        const data = await res.json();
        if(data.success) {
          setData(data.data);
        } else {
          toast.error("Error during getting insights", data.message);
        }
      } catch (error) {
        toast(`Insight error: ${error}`, { type: "error", transition: Bounce });
      } finally {
        setLoader(false);
      }
    }

    getInsights();
  }, []);

  useEffect(() => {
    const getInventory = async () => {
      try {
        setLoader(true);
        const res = await fetch("/api/inventory");
        const data = await res.json();

        if (data.success) {
          dispatch({
            type: ACTIONS.SET_INVENTORY,
            payload: data.data || [],
          });
        } else {

        }
      } catch (error) {
        toast(`Inventory error: ${error}`, { type: "error", transition: Bounce });
      } finally {
        setLoader(false);
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
      }  finally {
        setLoader(false);
      }
    };

    getInventory();
    getProducts();
  }, []);

  const metrics = useMemo(() => {
    if (!data) return null;

    const products = Object.values(data?.inventory?.productWiseInventory || {});

    const totalProducts = products.length;

    let remainingUnits = 0;
    let lowStock = 0;

    products.forEach((p) => {
      remainingUnits += p.totalRemaining;
      if (p.totalRemaining < 20) lowStock++; // threshold
    });

    return {
      totalProducts,
      remainingUnits,
      lowStock,
      expiryCount: data?.alerts?.inventory?.expiryAlerts?.length,
    };
  }, [data]);

  const expenseMetrics = useMemo(() => {
    if (!data?.expenses) return null;

    const total = data?.expenses.totalExpensesAmount;
    const breakdown = data?.expenses.totalExpenses;

    return {
      total,
      cogs: breakdown.cogs,
      marketing: breakdown.marketing,
      fixedOpex: breakdown.fixedOpex,
      variable: breakdown.variable,
    };
  }, [data]);

  const inventoryMetric = useMemo(() => {
    if (!stateInventory) return null;
    const totalUnitCount = stateInventory.reduce((final: number, current: InventoryItem) => {
      final += current.totalCount;
      return final;
    },0)
    return {
      totalUnits: totalUnitCount,
    };
  },[stateInventory])

  if (loader) return <Loader />;

  return (
    <div className={styles.container}>
      <AdminNavbar />
      <h1 className={styles.heading}>Business Insights</h1>

      {/* KPI SECTION */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span>Total Inventory Value</span>
          <strong>₹{data?.inventory?.totalInventoryValue}</strong>
        </div>

        <div className={styles.kpiCard}>
          <span>Total Products</span>
          <strong>{metrics?.totalProducts}</strong>
        </div>

        <div className={styles.kpiCard}>
          <span>Unit Metric</span>
          <strong>{metrics?.remainingUnits}/{inventoryMetric?.totalUnits}</strong>
        </div>

        <div className={styles.kpiCard}>
          <span>Total Expenses</span>
          <strong>₹{expenseMetrics?.total}</strong>
        </div>

        <div className={styles.kpiCard}>
          <span>COGS</span>
          <strong>₹{expenseMetrics?.cogs}</strong>
        </div>

        <div className={styles.kpiCard}>
          <span>Marketing</span>
          <strong>₹{expenseMetrics?.marketing}</strong>
        </div>

        <div className={styles.kpiCardAlert}>
          <span>Expiry Alerts</span>
          <strong>{metrics?.expiryCount}</strong>
        </div>


      </div>

      <div className={styles.expenseSection}>
        <h2>💸 Expense Breakdown</h2>

        <div className={styles.expenseGrid}>
          <div className={styles.expenseCard}>
            <span>COGS:</span>
            <strong> ₹{expenseMetrics?.cogs}</strong>
          </div>

          <div className={styles.expenseCard}>
            <span>Marketing:</span>
            <strong> ₹{expenseMetrics?.marketing}</strong>
          </div>

          <div className={styles.expenseCard}>
            <span>Fixed Opex:</span>
            <strong> ₹{expenseMetrics?.fixedOpex}</strong>
          </div>

          <div className={styles.expenseCard}>
            <span>Variable:</span>
            <strong> ₹{expenseMetrics?.variable}</strong>
          </div>
        </div>
      </div>

      {/* PRODUCT INVENTORY */}
      <h2>Product wise</h2>
      <div className={styles.grid}>
        {Object.entries(data?.inventory?.productWiseInventory || {})?.map(
          ([productId, details]) => {
            const productName = stateProducts.find((item: ProductType) => item?._id === productId)?.name;
            const productExpense = Object.values(
              data?.expenses?.productWiseExpenses || {}
            ).find((p) => p.name === productName);
            return (
              <div key={productId} className={styles.productCard}>
              <h3>{productName}</h3>
              <p>Total Remaining: {details.totalRemaining}</p>
              <p>Value: ₹{details.totalInventoryValue}</p>
              <div className={styles.expenseBox}>
                <p>COGS: ₹{productExpense?.cogs || 0}</p>
              </div>

              <div className={styles.progressBar}>
                <div
                  style={{
                    width: `${Math.min(
                      (details.totalRemaining / 100) * 100,
                      100
                    )}%`,
                  }}
                  className={styles.progress}
                />
              </div>

              <div className={styles.batchList}>
                {details.batches.map((batch) => (
                  <div key={batch.batch} className={styles.batchItem}>
                    <span>Batch: {batch.batch}</span>
                    <span>Units: {batch.remainingCount}/{batch.totalCount}</span>
                    <span>
                      Exp: {new Date(batch.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            )
          }
        )}
        
      </div>

      {/* EXPIRY ALERTS */}
      <div className={styles.alertSection}>
        <h2>⚠ Expiry Alerts (30 Days)</h2>

        {data?.alerts?.inventory?.expiryAlerts?.length === 0 ? (
          <p>No alerts 🎉</p>
        ) : (
          <div className={styles.alertList}>
            {data?.alerts?.inventory?.expiryAlerts?.map((alert, i) => (
              <div key={i} className={styles.alertItem}>
                <strong>{alert.productName}</strong>
                <span>Batch: {alert.batch}</span>
                <span>Remaining: {alert.remainingCount}</span>
                <span>
                  Expiry: {new Date(alert.expiryDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InsightsPage;
