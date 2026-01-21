"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
import { getAllThesisData } from "@/backend_api/thesisDocument";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/* ---------------------------------- TYPES --------------------------------- */

type DefenseStatus =
  | "defended"
  | "minor revision"
  | "major revision"
  | "re-defense";

type ChartItem = {
  status: DefenseStatus;
  count: number;
  fill: string;
};

/* ------------------------------- CHART CONFIG ------------------------------ */

const chartConfig = {
  defended: {
    label: "Defended",
    color: "var(--chart-1)",
  },
  "minor revision": {
    label: "Minor Revision",
    color: "var(--chart-2)",
  },
  "major revision": {
    label: "Major Revision",
    color: "var(--chart-3)",
  },
  "re-defense": {
    label: "Re-defense",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

/* -------------------------------- COMPONENT -------------------------------- */

export default function DefensesStatusCounts() {
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchAndCount() {
      try {
        const theses = await getAllThesisData();

        const counts: Record<DefenseStatus, number> = {
          defended: 0,
          "minor revision": 0,
          "major revision": 0,
          "re-defense": 0,
        };

        theses.forEach((thesis: any) => {
          const status = thesis.defenseStatus as DefenseStatus | undefined;

          if (status && status in counts) {
            counts[status]++;
          }
        });

        const data: ChartItem[] = (
          Object.entries(counts) as [DefenseStatus, number][]
        )
          .filter(([, count]) => count > 0)
          .map(([status, count]) => ({
            status,
            count,
            fill: chartConfig[status].color,
          }));

        setChartData(data);
        setTotal(data.reduce((sum, item) => sum + item.count, 0));
      } catch (error) {
        console.error("Failed to fetch defense status data", error);
      }
    }

    fetchAndCount();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Defense Status</CardTitle>
        <CardDescription>Thesis defense outcomes</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="count" hideLabel />}
              />
              <Pie data={chartData} dataKey="count" nameKey="status">
                <LabelList
                  dataKey="status"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: DefenseStatus) => chartConfig[value].label}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No defense records available
          </p>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          Total defenses: {total}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Distribution by defense status
        </div>
      </CardFooter>
    </Card>
  );
}
