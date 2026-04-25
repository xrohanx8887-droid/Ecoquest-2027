import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Crown, ArrowLeft, School } from "lucide-react";
import Leaderboard from "./Leaderboard";
import EcoChampWeek from "./EcoChampWeek";
import SchoolRecognition from "./SchoolRecognition";

const CompeteSection = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "leaderboard" | "champions" | "school" | null
  >(null);

  const subTabs = [
    { id: "leaderboard" as const, label: "Leaderboard", icon: Trophy },
    { id: "champions" as const, label: "Champions", icon: Crown },
    { id: "school" as const, label: "School", icon: School },
  ];

  const handleBackToHub = () => {
    setActiveSubTab(null);
  };

  return (
    <div className="space-y-6">
      {/* Show Competition Hub header and tabs only when no tab is selected */}
      {!activeSubTab && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gradient-eco mb-2">
              Competition Hub
            </h2>
            <p className="text-muted-foreground">
              Compete with peers and celebrate eco champions
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="flex justify-center">
            <div className="flex gap-2 bg-card/50 p-2 rounded-2xl backdrop-blur-sm">
              {subTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant="ghost"
                  className="flex items-center gap-2 rounded-xl transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:shadow-sm"
                  onClick={() => setActiveSubTab(tab.id)}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Content with back button when a tab is selected */}
      {activeSubTab && (
        <div className="space-y-4">
          {/* Back button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHub}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Competition Hub
            </Button>
          </div>

          {/* Tab content */}
          <div>
            {activeSubTab === "leaderboard" && <Leaderboard />}
            {activeSubTab === "champions" && <EcoChampWeek />}
            {activeSubTab === "school" && <SchoolRecognition />}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompeteSection;
