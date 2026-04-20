"use client";

import styles from "../../styles/admin.module.css";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UnitEconomicsBarChart } from "@/components/UnitEconomicsBarChart";
import { ExpensePieChart } from "@/components/ExpensePieChart";
import Loader from "@/components/Loader";
import MonthlyDataLineChart from "@/components/MonthlyDataLineChart";
import AdminLayout from "@/components/AdminLayout";

type ProductData = {
  name: string;
  inventory: {
    totalInventoryValue: number;
    totalRemaining: number;
    totalSoldUnits: number;
    totalUnits: number;
    batches: {
      batch: string;
      totalCount: number;
      remainingCount: number;
      inventoryValue: number;
      expiryDate: string;
      isLowStock: boolean;
      isExpiringSoon: boolean;
    }[];
  };
  expense: {
    cogs: number;
    marketing: number;
    fixedOpex: number;
    variable: number;
  };
  sales: {
    unitCount: number;
    totalSale: number;
    netSale: number;
    cm1: number;
    cm2: number;
    cm3: number;
    finalProfit: number;
    gstPaidInCP: number;
    gstCollected: number;
  };
};

type RevenueType = {
  totalRevenue: number;
  netRevenue: number;
  cm1: number;
  cm2: number;
  cm3: number;
  finalProfit: number;
}

type ExpenseType = {
  totalExpensesAmount: number;
  totalExpenses: {
    cogs: number;
    fixedOpex: number;
    marketing: number;
    variable: number;
  };
}

type UnitEcoEach = {
  value: number;
  percentage: number;
}

type UnitEconomicsType = {
  totalRevenue: number;
  netRevenue: number;
  cm1: UnitEcoEach;
  cm2: UnitEcoEach;
  cm3: UnitEcoEach;
  finalProfit: UnitEcoEach;
}

type MonthlyData = {
  totalRevenue: number;
  netRevenue: number;
  cogs: number;
  variable: number;
  marketing: number;
  fixedOpex: number;
  cm1: number;
  cm2: number;
  cm3: number;
  finalProfit: number;
  gstCollected: number;
  gstPaidInCP: number;
  orders: number;
  revenueGrowthPercentage: number;
  profitGrowthPercentage: number;
}

type InsightResponse = {
  monthlyData: Record<string, MonthlyData>;
  productWiseData: Record<string, ProductData>;
  revenues: RevenueType;
  expenses: ExpenseType;
  inventory: {
    totalInventoryValue: number;
  };
  totalOrders: number;
  paidOrders: number;
  unitEconomics: UnitEconomicsType;
  cac: number;
  unitsPerOrder: number;
  gstPaidInCPForOrders: number;
  gstToBePaidForOrders: number;
};

const InsightPage = () => {
  const [data, setData] = useState<InsightResponse | null>(null);
  const [loader, setLoader] = useState(false);

  /* INSIGHT API */
  useEffect(() => {
    const getInsights = async () => {
      try {
        setLoader(true);
        const res = await fetch("/api/insight");
        const json = await res.json();
        if (json.success) setData(json.data);
        else {
          toast.error("Failed to fetch insights");
        }
      } catch {
        toast.error("Failed to fetch insights");
        setLoader(false);
      } finally {
        setLoader(false);
      }
    };

    getInsights();
  }, []);

    const unitChartData = useMemo(() => {
      if (!data) return [];

      return [
        {
          name: "Net Revenue",
          value: data.unitEconomics.netRevenue,
          percentage: Number(((data.unitEconomics.netRevenue/data.unitEconomics.totalRevenue)*100).toFixed(2)),
        },
        {
          name: "CM1",
          value: data.unitEconomics.cm1.value,
          percentage: data.unitEconomics.cm1.percentage,
        },
        {
          name: "CM2",
          value: data.unitEconomics.cm2.value,
          percentage: data.unitEconomics.cm2.percentage,
        },
        {
          name: "CM3",
          value: data.unitEconomics.cm3.value,
          percentage: data.unitEconomics.cm3.percentage,
        },
        {
          name: "Profit",
          value: data.unitEconomics.finalProfit.value,
          percentage: data.unitEconomics.finalProfit.percentage,
        },
      ];
    }, [data]);

    const overAllChartData = useMemo(() => {
      if (!data) return [];

      return [
        {
          name: "Total Revenue",
          value: data.revenues.totalRevenue,
        },
        {
          name: "Net Revenue",
          value: data.revenues.netRevenue,
        },
        {
          name: "CM1",
          value: data.revenues.cm1,
        },
        {
          name: "CM2",
          value: data.revenues.cm2,
        },
        {
          name: "CM3",
          value: data.revenues.cm3,
        },
        {
          name: "Profit",
          value: data.revenues.finalProfit,
        },
      ];
    }, [data]);

   const chartData = useMemo(() => {
    if (!data) return [];
    return Object.values(data.productWiseData).map((p) => ({
      name: p.name,
      profit: p.sales.finalProfit,
    }));
  }, [data]);

  const expenseChartData = useMemo(() => {
    if (!data) return [];
    return [
      { name: "COGS", value: data.expenses.totalExpenses.cogs },
      { name: "Fixed", value: data.expenses.totalExpenses.fixedOpex },
      { name: "Marketing", value: data.expenses.totalExpenses.marketing },
      { name: "Variable", value: data.expenses.totalExpenses.variable },
    ];
  },[data]);

  const {
    products,
    topProduct,
    highestCostProduct,
    lowestMarginProduct,
    healthScore,
    isProfitable,
    totalProfit,
    lowStockProducts,
    expiringProducts,
  } = useMemo(() => {
    if (!data) {
      return {
        products: [],
        topProduct: null,
        highestCostProduct: null,
        lowestMarginProduct: null,
        healthScore: 0,
        isProfitable: false,
        totalProfit: 0,
        lowStockProducts: [],
        expiringProducts: [],
      };
    }

    const products = Object.values(data?.productWiseData) || [];

    const topProduct = products?.length > 0 && products?.reduce((a, b) =>
      a.sales.finalProfit > b.sales.finalProfit ? a : b
    );

    const highestCostProduct = products?.length > 0 && products?.reduce((a, b) =>
      a.expense.cogs > b.expense.cogs ? a : b
    );

    const lowestMarginProduct = products?.length > 0 && products?.reduce((a, b) =>
      a.sales.cm3 < b.sales.cm3 ? a : b
    );

    const totalProfit = products?.length > 0 && products?.reduce(
      (sum, p) => sum + p.sales.finalProfit,
      0
    );

    const lowStockProducts = products?.filter((p) =>
      p.inventory?.batches.some((b) => b.isLowStock)
    ) || [];

    const expiringProducts = products?.filter((p) =>
      p.inventory?.batches.some((b) => b.isExpiringSoon)
    ) || [];

    const healthScore = Math.round(
      (data?.unitEconomics?.finalProfit?.percentage +
        data?.unitEconomics?.cm3?.percentage) /
        2
    ) || 0;

    const isProfitable =
      data?.cac < data?.unitEconomics?.finalProfit?.value;

    return {
      products,
      topProduct,
      highestCostProduct,
      lowestMarginProduct,
      healthScore,
      isProfitable,
      totalProfit,
      lowStockProducts,
      expiringProducts,
    };
  }, [data]);

  if (!data || loader) return (
    <AdminLayout>
      <div>
        <Loader />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Business Insights</h1>

        {/* INSIGHTS */}
        <div className={styles.insightBox}>
          {topProduct && <p>💰 Best Product: <strong>{topProduct?.name}</strong></p>}
          {highestCostProduct && <p>⚠️ Highest Cost: <strong>{highestCostProduct?.name}</strong></p>}
          {lowestMarginProduct && <p>📉 Lowest Margin: <strong>{lowestMarginProduct?.name}</strong></p>}
          <p>{isProfitable ? "🟢 Profitable Ads" : "🔴 Losing on Ads"}</p>
        </div>

        {/* TOP METRICS */}
        <div className={styles.grid}>
          <Card title="Revenue" value={data.revenues.totalRevenue} isAmount />
          <Card title="Profit" value={data.revenues.finalProfit} isAmount highlight />
          <Card title="Total Expenses" value={data.expenses.totalExpensesAmount} isAmount highlight />
          <Card title="Inventory Value" value={data.inventory.totalInventoryValue} isAmount highlight />
          <Card title="GST Paid In CP(Order)" value={data.gstPaidInCPForOrders} isAmount />
          <Card title="GST Collected (Order)" value={data.gstToBePaidForOrders} isAmount />
          <Card title="Health Score" value={healthScore} />
          <Card title="Orders (Paid/Total)" value={data.paidOrders + "/" + data.totalOrders} />
          <Card title="CAC" value={data.cac} isAmount />
        </div>

        {/* Monthly data start */}
        {/* ================= MONTHLY WISE COMPARISON ================= */}
        <MonthlyDataLineChart monthlyData={data.monthlyData} />
        {/* Monthly data end */}

        {/* Overall ECONOMICS */}
        <div className={styles.unitBox}>
          <h2>Current Economics</h2>
          <UnitEconomicsBarChart data={overAllChartData} />
        </div>

        {/* UNIT ECONOMICS */}
        <div className={styles.unitBox}>
          <h2>Unit Economics</h2>
          <UnitEconomicsBarChart data={unitChartData} />
        </div>

        {/* CHART */}
        <div className={styles.chartBox}>
          <h2>Profit by Product</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ALERTS */}
        <div className={styles.riskBox}>
          <h2>Inventory Alerts</h2>
          {lowStockProducts.map((p) => (
            <p key={p.name}>⚠️ Low Stock: {p.name}</p>
          ))}
          {expiringProducts.map((p) => (
            <p key={p.name}>⏳ Expiring: {p.name}</p>
          ))}
        </div>

        <div>
          <h2>Expenses Chart</h2>
          <ExpensePieChart data={expenseChartData} />
        </div>

        {/* PRODUCTS */}
        <h2 className={styles.sectionTitle}>All Products</h2>
        <div className={styles.productGrid}>
          {products.map((product) => {
            const contribution = totalProfit && (
              (product.sales.finalProfit / totalProfit) *
              100
            ).toFixed(1);

            return (
              <div key={product.name} className={styles.productCard}>
                <h3>{product.name}</h3>

                <p>Sold: {product.sales.unitCount}</p>
                <p>Left: {product.inventory?.totalRemaining}</p>

                <div className={styles.divider} />

                <p>Revenue: ₹{product.sales.totalSale}</p>
                <p className={styles.profit}>
                  Profit: ₹{product.sales.finalProfit}
                </p>
                <p className={styles.profit}>
                  GST Paid In CP: ₹{product.sales.gstPaidInCP}
                </p>
                <p className={styles.profit}>
                  GST Collected: ₹{product.sales.gstCollected}
                </p>
                <p className={styles.muted}>
                  Contribution: {contribution}%
                </p>

                <div className={styles.divider} />

                <p className={styles.muted}>
                  COGS: ₹{product.expense.cogs}
                </p>

                <div className={styles.divider} />

                {/* ===== BATCHES ===== */}
                <div className={styles.batchSection}>
                  <p className={styles.batchTitle}>Batches</p>

                  {product?.inventory?.batches.map((batch) => (
                    <div key={batch.batch} className={styles.batchCard}>
                      <div className={styles.batchHeader}>
                        <span className={styles.batchName}>
                          {batch.batch}
                        </span>

                        <div className={styles.badges}>
                          {batch.isLowStock && (
                            <span className={styles.low}>Low Stock</span>
                          )}
                          {batch.isExpiringSoon && (
                            <span className={styles.expiry}>
                              Expiring Soon
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.batchInfo}>
                        <p>
                          Stock: {batch.remainingCount} / {batch.totalCount}
                        </p>
                        <p>
                          Value: ₹{batch.inventoryValue}
                        </p>
                        <p>
                          Expiry:{" "}
                          {new Date(batch.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}

export default InsightPage;

/* CARD */
function Card({
  title,
  value,
  highlight,
  isAmount,
}: {
  title: string;
  value: number | string;
  highlight?: boolean;
  isAmount?: boolean;
}) {
  return (
    <div className={`${styles.card} ${highlight ? styles.highlight : ""}`}>
      <p>{title}</p>
      <h3>{isAmount ? `₹ ${value}` : value}</h3>
    </div>
  );
}