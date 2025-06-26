import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { budgetGoals } from "@/data/mock";

export function BudgetGoals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Goals</CardTitle>
        <CardDescription>
          Track your spending against your set goals.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {budgetGoals.map((goal) => {
          const progress = (goal.spent / goal.goal) * 100;
          return (
            <div key={goal.category} className="grid gap-2">
              <div className="flex items-baseline justify-between">
                <span className="font-medium">{goal.category}</span>
                <span className="text-sm text-muted-foreground">
                  ${goal.spent.toFixed(2)} / ${goal.goal.toFixed(2)}
                </span>
              </div>
              <Progress value={progress} aria-label={`${goal.category} budget progress`} />
            </div>
          );
        })}
        <Button variant="outline" className="mt-2 w-full">Set New Goal with AI</Button>
      </CardContent>
    </Card>
  );
}
