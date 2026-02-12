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

type DefenseThesisFinalStatus =
  | "defended"
  | "minor revision"
  | "major revision"
  | "redefense";

type Thesis = {
  thesisFinalStatus?: DefenseThesisFinalStatus;
};

type ChartItem = {
  thesisFinalStatus: DefenseThesisFinalStatus;
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
  redefense: {
    label: "Re-defense",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

/* -------------------------------- COMPONENT -------------------------------- */

export default function DefenseThesisFinalStatusCounts() {
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    async function fetchAndCount() {
      try {
        const theses: Thesis[] = await getAllThesisData();

        const counts: Record<DefenseThesisFinalStatus, number> = {
          defended: 0,
          "minor revision": 0,
          "major revision": 0,
          redefense: 0,
        };

        theses.forEach((thesis) => {
          const status = thesis.thesisFinalStatus; // ✅ FIXED HERE

          if (status && counts[status] !== undefined) {
            counts[status]++;
          }
        });

        const data: ChartItem[] = (
          Object.entries(counts) as [DefenseThesisFinalStatus, number][]
        ).map(([thesisFinalStatus, count]) => ({
          thesisFinalStatus,
          count,
          fill: chartConfig[thesisFinalStatus].color,
        }));

        setChartData(data);
        setTotal(theses.length);
      } catch (error) {
        console.error("Failed to fetch thesis final status data", error);
      }
    }

    fetchAndCount();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Defense Final Status</CardTitle>
        <CardDescription>Thesis defense outcomes</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {total > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="count" hideLabel />}
              />
              <Pie data={chartData} dataKey="count" nameKey="thesisFinalStatus">
                <LabelList
                  dataKey="thesisFinalStatus"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: DefenseThesisFinalStatus) =>
                    chartConfig[value].label
                  }
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
          Distribution by thesis final status
        </div>
      </CardFooter>
    </Card>
  );
}
