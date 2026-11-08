import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
// import { useOrderStats } from "@/features/orders/hooks/useOrderStats";
// import { ORDER_STATUS_LABELS } from "@/features/orders/orders.constants";
// import type { OrderStatus } from "@/features/orders/types/orders.types";
import { useOrderStats } from "@/features/orders/hooks/useOrders";
import {
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/features/orders/schema/orders.schema";

const STATUS_ORDER: OrderStatus[] = [
  "waiting_for_file",
  "in_progress",
  "file_completed",
  "printing_in_progress",
  "cutting_in_progress",
  "ready_for_delivery",
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  waiting_for_file: "#e57373",
  in_progress: "var(--chart-2)",
  file_completed: "var(--chart-2)",
  printing_in_progress: "var(--chart-3)",
  cutting_in_progress: "var(--chart-3)",
  ready_for_delivery: "var(--chart-4)",
  delivered: "var(--muted-foreground)",
  cancelled: "var(--muted)",
};

const chartConfig = {
  total: {
    label: "Commandes",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export const ProductionByStatusChart = () => {
  const { data, isLoading } = useOrderStats();

  const rows = STATUS_ORDER.map((status) => ({
    status,
    label: ORDER_STATUS_LABELS[status] ?? status,
    total: data?.byStatus?.[status] ?? 0,
  }));

  return (
    <div className="rounded-xl border bg-card p-4 h-full flex flex-col w-full">
      <div className="mb-3">
        <p className="text-sm font-medium">Production par statut</p>
        <p className="text-xs text-muted-foreground">
          Répartition actuelle des commandes actives
        </p>
      </div>
      {isLoading ? (
        <div className="flex-1 min-h-[220px] w-full animate-pulse rounded-md bg-muted" />
      ) : (
        <ChartContainer
          config={chartConfig}
          className="w-full flex-1 min-h-[220px] !aspect-auto"
        >
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ left: 4, right: 24, top: 4, bottom: 4 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={150}
              fontSize={11}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${Number(value)} commandes`}
                />
              }
            />
            <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={22}>
              {rows.map((row) => (
                <Cell
                  key={row.status}
                  fill={STATUS_COLORS[row.status] ?? "var(--primary)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};
