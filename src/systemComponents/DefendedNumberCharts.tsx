import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getAllFinalThesisDocuments } from "@/backend_api/thesisDocument";

/* ---------------- TYPES ---------------- */

interface ThesisDocument {
  type: "proposal" | "final";
  schedule?: {
    date: string; // YYYY-MM-DD
  };
}

/* ---------------- CHART CONFIG ---------------- */

const chartConfig = {
  proposal: {
    label: "Proposal",
    color: "var(--chart-1)",
  },
  final: {
    label: "Final",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

/* ---------------- COMPONENT ---------------- */

export default function DefendedNumberCharts() {
  const [timeRange, setTimeRange] = useState("90d");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: ThesisDocument[] = await getAllFinalThesisDocuments();

        /**
         * STEP 1: GROUP BY DATE
         * { "2026-01-16": { proposal: 1, final: 0 } }
         */
        const groupedByDate: Record<
          string,
          { proposal: number; final: number }
        > = {};

        data.forEach((item) => {
          if (!item.schedule?.date) return;

          const date = item.schedule.date;

          if (!groupedByDate[date]) {
            groupedByDate[date] = { proposal: 0, final: 0 };
          }

          if (item.type === "proposal") {
            groupedByDate[date].proposal += 1;
          }

          if (item.type === "final") {
            groupedByDate[date].final += 1;
          }
        });

        /**
         * STEP 2: CONVERT TO ARRAY FOR CHART
         */
        const formatted = Object.keys(groupedByDate)
          .sort()
          .map((date) => ({
            date,
            proposal: groupedByDate[date].proposal,
            final: groupedByDate[date].final,
          }));

        setChartData(formatted);
      } catch (error) {
        console.error("Error fetching thesis documents:", error);
      }
    };

    fetchData();
  }, []);

  /* ---------------- TIME RANGE FILTER ---------------- */

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date(); // today

    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return date >= startDate;
  });

  /* ---------------- RENDER ---------------- */

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Thesis Defenses Overview</CardTitle>
          <CardDescription>Proposal vs Final defenses</CardDescription>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillProposal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-proposal)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-proposal)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillFinal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-final)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-final)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="proposal"
              type="natural"
              fill="url(#fillProposal)"
              stroke="var(--color-proposal)"
              stackId="a"
            />

            <Area
              dataKey="final"
              type="natural"
              fill="url(#fillFinal)"
              stroke="var(--color-final)"
              stackId="a"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
