"use client";

import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chartData, chartConfig } from "@/data/mock";

export function SpendingChart() {
  const [chartType, setChartType] = React.useState("bar");

  const renderCustomPieLabel = (props: any) => {
    const { name, percent } = props;
    if (percent < 0.04) {
      return null;
    }
    return `${name} (${(percent * 100).toFixed(0)}%)`;
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>
            View your spending by category as a bar or pie chart.
          </CardDescription>
        </div>
        <Tabs defaultValue="bar" onValueChange={setChartType} className="w-auto">
          <TabsList>
            <TabsTrigger value="bar">Bar</TabsTrigger>
            <TabsTrigger value="pie">Pie</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData} accessibilityLayer>
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value}`}
                />
                 <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="amount" fill="hsl(var(--accent))" radius={8} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  labelLine={{
                    stroke: "hsl(var(--muted-foreground))",
                    strokeWidth: 1,
                  }}
                  label={renderCustomPieLabel}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-${entry.category}`}
                      fill={
                        chartConfig[entry.category as keyof typeof chartConfig]
                          ?.color
                      }
                      className="stroke-background hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent nameKey="category" indicator="dot" />} />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
