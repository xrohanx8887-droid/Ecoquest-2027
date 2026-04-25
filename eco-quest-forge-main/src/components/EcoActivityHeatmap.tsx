import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar, Flame, Leaf, Target } from "lucide-react";

interface DayData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  activities: string[];
}

const EcoActivityHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState<DayData[]>([]);
  const [totalActivities, setTotalActivities] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  // Generate 6 months of sample data
  useEffect(() => {
    const generateHeatmapData = () => {
      const data: DayData[] = [];
      const today = new Date();
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const activities = [
        "Planted a tree",
        "Recycled waste",
        "Used public transport",
        "Saved water",
        "Used renewable energy",
        "Composted organic waste",
        "Bought local produce",
        "Reduced plastic usage",
        "Carpooled to school",
        "Turned off lights",
      ];

      let totalCount = 0;
      let currentStreakCount = 0;
      let longestStreakCount = 0;
      let tempStreak = 0;

      for (
        let d = new Date(sixMonthsAgo);
        d <= today;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0];

        // Generate realistic activity data (more active on weekdays, some gaps)
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const isRecent =
          (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) < 30;

        let count = 0;
        if (Math.random() > 0.15) {
          // 85% chance of activity
          if (isWeekend) {
            count = Math.floor(Math.random() * 3) + 1; // 1-3 activities on weekends
          } else {
            count = Math.floor(Math.random() * 4) + 1; // 1-4 activities on weekdays
          }

          // More activity in recent days
          if (isRecent && Math.random() > 0.3) {
            count += Math.floor(Math.random() * 2);
          }
        }

        const level =
          count === 0
            ? 0
            : (Math.min(4, Math.ceil(count / 2)) as 0 | 1 | 2 | 3 | 4);

        const dayActivities =
          count > 0
            ? activities.sort(() => 0.5 - Math.random()).slice(0, count)
            : [];

        data.push({
          date: dateStr,
          count,
          level,
          activities: dayActivities,
        });

        totalCount += count;

        // Calculate streaks
        if (count > 0) {
          tempStreak++;
          if (d.toDateString() === today.toDateString()) {
            currentStreakCount = tempStreak;
          }
        } else {
          longestStreakCount = Math.max(longestStreakCount, tempStreak);
          tempStreak = 0;
        }
      }

      setHeatmapData(data);
      setTotalActivities(totalCount);
      setCurrentStreak(currentStreakCount);
      setLongestStreak(longestStreakCount);
    };

    generateHeatmapData();
  }, []);

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-muted/20", // No activity
      "bg-green-200", // Low activity
      "bg-green-300", // Medium activity
      "bg-green-400", // High activity
      "bg-green-500", // Very high activity
    ];
    return colors[level] || colors[0];
  };

  const getMonthLabels = () => {
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      months.push(date.toLocaleDateString("en-US", { month: "short" }));
    }
    return months;
  };

  const getWeekdayLabels = () => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  };

  const getDayOfWeek = (dateStr: string) => {
    return new Date(dateStr).getDay();
  };

  const getWeeksData = () => {
    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];

    heatmapData.forEach((day, index) => {
      const dayOfWeek = getDayOfWeek(day.date);

      // Start new week on Sunday or first day
      if (dayOfWeek === 0 || index === 0) {
        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        currentWeek = [];
      }

      currentWeek.push(day);
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const weeks = getWeeksData();
  const monthLabels = getMonthLabels();
  const weekdayLabels = getWeekdayLabels();

  return (
    <Card className="card-eco">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center flex-shrink-0">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gradient-eco">
                Eco Activity Heatmap
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your environmental impact over the last 6 months
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary text-xs sm:text-sm w-full sm:w-auto text-center"
          >
            {totalActivities} activities
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted/30">
            <div className="text-lg sm:text-2xl font-bold text-gradient-eco">
              {totalActivities}
            </div>
            <div className="text-xs text-muted-foreground">
              Total Activities
            </div>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted/30">
            <div className="text-lg sm:text-2xl font-bold text-gradient-water flex items-center justify-center gap-1">
              <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
              {currentStreak}
            </div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted/30">
            <div className="text-lg sm:text-2xl font-bold text-gradient-accent">
              {longestStreak}
            </div>
            <div className="text-xs text-muted-foreground">Longest Streak</div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-sm font-medium">
              Last 6 months of eco activities
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-2 w-2 sm:h-3 sm:w-3 rounded-sm ${getLevelColor(
                      level
                    )}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 min-w-max pb-2">
              {/* Weekday labels */}
              <div className="flex flex-col gap-1 mr-2 flex-shrink-0">
                {weekdayLabels.map((day, index) => (
                  <div
                    key={day}
                    className="h-2 w-2 sm:h-3 sm:w-3 flex items-center justify-center text-xs text-muted-foreground"
                    style={{ height: "10px" }}
                  >
                    <span className="text-[10px] sm:text-xs">
                      {index % 2 === 1 ? day : ""}
                    </span>
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <TooltipProvider key={`${weekIndex}-${dayIndex}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`h-2 w-2 sm:h-3 sm:w-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all ${getLevelColor(
                                day.level
                              )}`}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-center">
                              <div className="font-semibold">
                                {day.count}{" "}
                                {day.count === 1 ? "activity" : "activities"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(day.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                              {day.activities.length > 0 && (
                                <div className="mt-2 text-xs">
                                  {day.activities
                                    .slice(0, 3)
                                    .map((activity, idx) => (
                                      <div key={idx}>• {activity}</div>
                                    ))}
                                  {day.activities.length > 3 && (
                                    <div>
                                      • +{day.activities.length - 3} more
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Month labels */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 ml-8 min-w-max pb-1">
              {monthLabels.map((month, index) => (
                <div
                  key={month}
                  className="text-xs text-muted-foreground flex-shrink-0"
                  style={{
                    width: `${(weeks.length / 6) * (index + 1) * 12}px`,
                  }}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Motivational message */}
        <div className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary/5 to-primary-glow/10 border border-primary/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="font-semibold text-gradient-eco text-sm sm:text-base">
              Keep up the great work!
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground px-2 sm:px-0">
            {currentStreak > 0
              ? `You're on a ${currentStreak}-day streak! Every action counts towards a greener future.`
              : "Start your eco-journey today! Small actions lead to big changes."}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EcoActivityHeatmap;
