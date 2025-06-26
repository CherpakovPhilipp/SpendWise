import { Header } from "@/components/dashboard/header";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { BudgetGoals } from "@/components/dashboard/budget-goals";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
      <Header />
      <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-6 md:gap-8 lg:col-span-2">
          <OverviewCards />
          <SpendingChart />
        </div>
        <div className="grid auto-rows-max items-start gap-6 md:gap-8">
          <BudgetGoals />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
