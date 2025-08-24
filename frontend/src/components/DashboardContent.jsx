import React from "react";
import CalorieIntakeCard from "./CalorieIntakeCard";
import WeeklyOverviewCard from "./WeeklyOverviewCard";
import TodayActivityCard from "./TodayActivityCard";
import HealthTrackersCard from "./HealthTrackersCard";

const DashboardContent = ({ userData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CalorieIntakeCard userData={userData} />
      <WeeklyOverviewCard userData={userData} />
      <TodayActivityCard userData={userData} />
      <HealthTrackersCard userData={userData} />
    </div>
  );
};

export default DashboardContent;
