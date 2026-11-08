import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { AreaChart as AreaChartIcon, BarChart3 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { usePaymentsTrend } from "../hooks/usePaymentsTrend";

const chartConfig = {
  total: {
    label: "Encaissements",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const formatCompact = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)} k`;
  return String(value);
};

type ChartView = "area" | "bar";

export const PaymentsTrendChart = () => {
  const { data, isLoading } = usePaymentsTrend();
  const [view, setView] = useState<ChartView>("area");

  const points = data?.data ?? [];

  return (
    <div className="rounded-xl border bg-card p-4 h-full flex flex-col">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Encaissements — 6 derniers mois</p>
          <p className="text-xs text-muted-foreground">
            Somme des paiements validés par mois
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border bg-background/50 p-1">
          <Button
            variant={view === "area" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView("area")}
            title="Vue aire"
          >
            <AreaChartIcon className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={view === "bar" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView("bar")}
            title="Vue barres"
          >
            <BarChart3 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 min-h-[220px] w-full animate-pulse rounded-md bg-muted" />
      ) : (
        <ChartContainer
          config={chartConfig}
          className="w-full flex-1 min-h-[220px] !aspect-auto"
        >
          {view === "area" ? (
            <AreaChart data={points} margin={{ left: 4, right: 4, top: 4 }}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                tickFormatter={formatCompact}
                tickLine={false}
                axisLine={false}
                width={40}
                fontSize={11}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      `${Number(value).toLocaleString("fr-FR")} Ar`
                    }
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--color-total)"
                strokeWidth={2}
                fill="url(#fillTotal)"
              />
            </AreaChart>
          ) : (
            <BarChart data={points} margin={{ left: 4, right: 4, top: 4 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                tickFormatter={formatCompact}
                tickLine={false}
                axisLine={false}
                width={40}
                fontSize={11}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      `${Number(value).toLocaleString("fr-FR")} Ar`
                    }
                  />
                }
              />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ChartContainer>
      )}
    </div>
  );
};
