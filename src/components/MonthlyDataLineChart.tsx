"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "../styles/monthlyDataLineChart.module.css";

type MonthlyDataType = {
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
};

type Props = {
  monthlyData: Record<string, MonthlyDataType>;
};

type TooltipItem = {
  dataKey?: string | number;
  value?: number;
};

type TooltipSafe = {
  active?: boolean;
  payload?: {
    dataKey?: string;
    value?: number;
  }[];
  label?: string;
};

const CustomTooltip = (props: TooltipSafe) => {
  const { active, payload, label } = props;

  if (!active || !payload || !payload.length) return null;

  return (
    <div className={styles.tooltipBox}>
      <p className={styles.tooltipTitle}>{label}</p>

      {payload.map((item) => (
        <div key={String(item.dataKey)} className={styles.tooltipRow}>
          <span>{String(item.dataKey)}</span>
          <strong>₹ {item.value ?? 0}</strong>
        </div>
      ))}
    </div>
  );
};

const MonthlyDataLineChart = ({ monthlyData }: Props) => {
  /** ================= STATE ================= */
  const [activeLines, setActiveLines] = useState<Record<string, boolean>>({
    totalRevenue: true,
    netRevenue: true,
    cogs: false,
    variable: false,
    marketing: false,
    fixedOpex: false,
    cm1: true,
    cm2: false,
    cm3: false,
    finalProfit: true,
    orders: false,
  });

  const toggleLine = (key: string) => {
    setActiveLines((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /** ================= DATA ================= */
  const chartData = useMemo(() => {
    return Object.entries(monthlyData).map(([month, val]) => ({
      month,
      ...val,
    }));
  }, [monthlyData]);

  /** ================= UI ================= */
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Monthly Wise Comparison</h2>

      {/* ===== Growth Cards ===== */}
      <div className={styles.growthBox}>
        {chartData.map((m) => (
          <div key={m.month} className={styles.growthCard}>
            <p className={styles.month}>{m.month}</p>

            <p>
              Revenue:{" "}
              <span
                className={
                  m.revenueGrowthPercentage >= 0
                    ? styles.green
                    : styles.red
                }
              >
                {m.revenueGrowthPercentage}%
              </span>
            </p>

            <p>
              Profit:{" "}
              <span
                className={
                  m.profitGrowthPercentage >= 0
                    ? styles.green
                    : styles.red
                }
              >
                {m.profitGrowthPercentage}%
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* ===== TOGGLES ===== */}
      <div className={styles.toggleContainer}>
        {Object.keys(activeLines).map((key) => (
          <button
            key={key}
            onClick={() => toggleLine(key)}
            className={`${styles.toggleBtn} ${
              activeLines[key] ? styles.activeToggle : ""
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* ===== CHART ===== */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />

          {activeLines.totalRevenue && (
            <Line type="monotone" dataKey="totalRevenue" stroke="#1f77b4" />
          )}
          {activeLines.netRevenue && (
            <Line type="monotone" dataKey="netRevenue" stroke="#ff7f0e" />
          )}
          {activeLines.cogs && (
            <Line type="monotone" dataKey="cogs" stroke="#2ca02c" />
          )}
          {activeLines.variable && (
            <Line type="monotone" dataKey="variable" stroke="#d62728" />
          )}
          {activeLines.marketing && (
            <Line type="monotone" dataKey="marketing" stroke="#9467bd" />
          )}
          {activeLines.fixedOpex && (
            <Line type="monotone" dataKey="fixedOpex" stroke="#8c564b" />
          )}
          {activeLines.cm1 && (
            <Line type="monotone" dataKey="cm1" stroke="#e377c2" />
          )}
          {activeLines.cm2 && (
            <Line type="monotone" dataKey="cm2" stroke="#7f7f7f" />
          )}
          {activeLines.cm3 && (
            <Line type="monotone" dataKey="cm3" stroke="#bcbd22" />
          )}
          {activeLines.finalProfit && (
            <Line type="monotone" dataKey="finalProfit" stroke="#17becf" />
          )}
          {activeLines.orders && (
            <Line type="monotone" dataKey="orders" stroke="#000000" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyDataLineChart;