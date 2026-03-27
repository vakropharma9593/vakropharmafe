import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";

/* ================= TYPES ================= */

type ExpenseData = {
  name: string;
  value: number;
};

/* ================= COLORS (THEME BASED) ================= */

const COLORS = [
  "#173F36", // COGS
  "#2E5E52", // Fixed
  "#C9A25E", // Marketing
  "#E1C88A", // Variable
];

/* ================= CUSTOM TOOLTIP ================= */

type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: {
    payload: ExpenseData;
  }[];
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;

    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #EFEAE2",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <p><strong>{data.name}</strong></p>
        <p>₹ {data.value}</p>
      </div>
    );
  }
  return null;
};

/* ================= COMPONENT ================= */

export function ExpensePieChart({
  data,
}: {
  data: ExpenseData[];
}) {
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label={({ name, percent }) =>
              `${name} ${percent && (percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}