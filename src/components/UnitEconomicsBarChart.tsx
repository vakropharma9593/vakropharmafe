import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type {
  TooltipProps,
  LabelProps,
} from "recharts";

/* ================= TYPES ================= */

type UnitChartItem = {
  name: string;
  value: number;
  percentage?: number;
};

/* ================= COLORS ================= */

const COLORS = ["#173F36", "#2E5E52", "#C9A25E", "#E1C88A"];

/* ================= CUSTOM TOOLTIP ================= */

/* Extend TooltipProps safely */
type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: {
    payload: UnitChartItem;
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
        {data?.percentage && <p>{data.percentage}%</p>}
      </div>
    );
  }
  return null;
};

/* ================= CUSTOM LABEL ================= */

const CustomLabel = (props: LabelProps) => {
  const { x, y, width, value } = props;

  if (
    typeof x === "number" &&
    typeof y === "number" &&
    typeof width === "number" &&
    typeof value === "number"
  ) {
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#1F1F1F"
        textAnchor="middle"
        fontSize={12}
      >
        ₹{value}
      </text>
    );
  }

  return null;
};

/* ================= CHART COMPONENT ================= */

export function UnitEconomicsBarChart({
  data,
}: {
  data: UnitChartItem[];
}) {
  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey="value" label={<CustomLabel />}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}