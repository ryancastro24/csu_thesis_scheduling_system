import DefendedNumberCharts from "@/systemComponents/DefendedNumberCharts";
import DefendedPerDepartment from "@/systemComponents/DefendedPerDepartment";
import ThesisCategoryCounts from "@/systemComponents/ThesisCategoryCounts";
import DefensesStatusCounts from "@/systemComponents/DefensesStatusCounts";
const LandingPage = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full">
        <DefendedNumberCharts />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <DefendedPerDepartment />
        <ThesisCategoryCounts />
        <DefensesStatusCounts />
      </div>
    </div>
  );
};

export default LandingPage;
