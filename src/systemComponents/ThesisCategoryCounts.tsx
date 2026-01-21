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

export const description = "Thesis category distribution";

const chartConfig = {
  count: {
    label: "Count",
  },
  proposal: {
    label: "Proposal",
    color: "var(--chart-1)",
  },
  final: {
    label: "Final Defense",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type ChartItem = {
  type: "proposal" | "final";
  count: number;
  fill: string;
};

export default function ThesisCategoryCounts() {
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchAndCount() {
      try {
        const theses = await getAllThesisData();

        let proposalCount = 0;
        let finalCount = 0;

        for (const thesis of theses) {
          if (thesis.type === "proposal") proposalCount++;
          if (thesis.type === "final") finalCount++;
        }

        const data: ChartItem[] = [];

        if (proposalCount > 0) {
          data.push({
            type: "proposal",
            count: proposalCount,
            fill: chartConfig.proposal.color,
          });
        }

        if (finalCount > 0) {
          data.push({
            type: "final",
            count: finalCount,
            fill: chartConfig.final.color,
          });
        }

        setChartData(data);
        setTotal(proposalCount + finalCount);
      } catch (error) {
        console.error("Failed to fetch thesis data", error);
      }
    }

    fetchAndCount();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Thesis Categories</CardTitle>
        <CardDescription>Proposal vs Final Defense</CardDescription>
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

              <Pie data={chartData} dataKey="count" nameKey="type">
                <LabelList
                  dataKey="type"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: "proposal" | "final") =>
                    chartConfig[value].label
                  }
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No thesis data available
          </p>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          Total theses: {total}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Live distribution of thesis types
        </div>
      </CardFooter>
    </Card>
  );
}
