
"use client";

import * as React from "react";
import { observer } from "mobx-react-lite";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { format, subMonths } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/AppProvider";
import { chartConfig } from "@/data/mock";

function SpendingChart() {
  const store = useApp();
  const [chartType, setChartType] = React.useState("bar");

  const last12Months = React.useMemo(() => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      months.push(subMonths(today, i));
    }
    return months;
  }, []);
  
  const [month, setMonth] = React.useState(format(last12Months[0], "yyyy-MM-dd"));

  const chartData = store.getSpendingForMonth(month);

  const renderCustomPieLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name } = props;
    if (percent < 0.04) {
      return null;
    }
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={"hsl(var(--muted-foreground))"} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={"hsl(var(--muted-foreground))"} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={"hsl(var(--muted-foreground))"} fontSize={12}>
          {`${name} (${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex-col items-start gap-4 space-y-0 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>
            View your spending by category for a selected month.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                    {last12Months.map(m => (
                        <SelectItem key={m.toISOString()} value={format(m, "yyyy-MM-dd")}>
                            {format(m, "MMMM yyyy")}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Tabs defaultValue="bar" onValueChange={setChartType} className="w-auto">
                <TabsList>
                    <TabsTrigger value="bar">Bar</TabsTrigger>
                    <TabsTrigger value="pie">Pie</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
            No spending data for this month.
          </div>
        ) : (
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
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={8} />
                </BarChart>
              ) : (
                <PieChart margin={{ top: 30, right: 50, bottom: 30, left: 50 }}>
                  <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    labelLine={false}
                    label={renderCustomPieLabel}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.category}`}
                        fill={`hsl(var(--chart-${(index % 5) + 1}))`}
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
        )}
      </CardContent>
    </Card>
  );
}
export default observer(SpendingChart);
