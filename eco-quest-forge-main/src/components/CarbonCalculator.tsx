import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  Car,
  Home,
  Utensils,
  TreePine,
  Lightbulb,
  Droplets,
  RotateCcw,
} from "lucide-react";

interface CarbonData {
  transport: number;
  electricity: number;
  water: number;
  food: number;
  waste: number;
}

// Add average footprint constant and motivational messages
const AVERAGE_FOOTPRINT = 5; // kg CO2 per day (example value)
const MOTIVATIONAL_MESSAGES = [
  "Great job! Keep going!",
  "You're making a real difference!",
  "Every step counts – stay eco!",
  "Awesome progress!",
  "Eco-champion in the making!",
];

const TASK_LIBRARY = [
  { task: "Switch off fans for 1 hour daily", reduction: 0.1 },
  { task: "Walk instead of car for 2 days", reduction: 0.4 },
  { task: "Use reusable bottles", reduction: 0.05 },
  { task: "Reduce single-use plastics", reduction: 0.08 },
  { task: "Switch to LED bulbs", reduction: 0.5 },
  { task: "Eat one vegetarian meal per day", reduction: 0.3 },
  { task: "Shorten shower by 2 minutes", reduction: 0.07 },
];

const CarbonCalculator = () => {
  const [carbonData, setCarbonData] = useState<CarbonData>({
    transport: 0,
    electricity: 0,
    water: 0,
    food: 0,
    waste: 0,
  });

  const [transportMode, setTransportMode] = useState("");
  const [dietType, setDietType] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [targetMode, setTargetMode] = useState<
    "none" | "set" | "active" | "completed"
  >("none");
  const [targetPercent, setTargetPercent] = useState(10);
  const [targetPeriod, setTargetPeriod] = useState<"weekly" | "monthly">(
    "monthly"
  );
  const [tasks, setTasks] = useState<
    { task: string; reduction: number; done: boolean }[]
  >([]);
  const [progress, setProgress] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [greenCoins, setGreenCoins] = useState(0);
  const [motivationIdx, setMotivationIdx] = useState(0);

  const calculateCarbon = () => {
    const transport = carbonData.transport * getTransportFactor(transportMode);
    const electricity = carbonData.electricity * 0.82; // kg CO2 per kWh
    const water = carbonData.water * 0.0004; // kg CO2 per liter
    const food = carbonData.food * getDietFactor(dietType);
    const waste = carbonData.waste * 0.5; // kg CO2 per kg waste

    return {
      transport,
      electricity,
      water,
      food,
      waste,
      total: transport + electricity + water + food + waste,
    };
  };

  const getTransportFactor = (mode: string) => {
    switch (mode) {
      case "car":
        return 0.21; // kg CO2 per km
      case "bus":
        return 0.08;
      case "train":
        return 0.04;
      case "bike":
        return 0;
      case "walk":
        return 0;
      default:
        return 0.15;
    }
  };

  const getDietFactor = (diet: string) => {
    switch (diet) {
      case "vegan":
        return 1.5; // kg CO2 per day
      case "vegetarian":
        return 2.5;
      case "mixed":
        return 4.0;
      case "meat-heavy":
        return 7.0;
      default:
        return 3.0;
    }
  };

  const results = calculated ? calculateCarbon() : null;
  const treesToOffset = results ? Math.ceil((results.total * 365) / 22) : 0;
  const isAboveAverage = results && results.total > AVERAGE_FOOTPRINT;
  const reductionTarget = results
    ? results.total *
      (targetPercent / 100) *
      (targetPeriod === "weekly" ? 7 : 30)
    : 0;
  const progressPercent = Math.min(100, Math.round(progress * 100));

  // Handle setting a goal
  const handleSetGoal = () => {
    // Pick tasks until their sum >= reductionTarget
    let sum = 0;
    const selected: { task: string; reduction: number; done: boolean }[] = [];
    for (const t of TASK_LIBRARY) {
      if (sum < reductionTarget) {
        selected.push({ ...t, done: false });
        sum += t.reduction * (targetPeriod === "weekly" ? 7 : 30);
      }
    }
    setTasks(selected);
    setTargetMode("active");
    setProgress(0);
    setShowCongrats(false);
    setBadgeEarned(false);
    setGreenCoins(0);
    setMotivationIdx(0);
  };

  // Handle marking a task as done
  const handleTaskDone = (idx: number) => {
    const updated = tasks.map((t, i) =>
      i === idx ? { ...t, done: !t.done } : t
    );
    setTasks(updated);
    // Calculate progress
    const doneSum = updated
      .filter((t) => t.done)
      .reduce(
        (acc, t) => acc + t.reduction * (targetPeriod === "weekly" ? 7 : 30),
        0
      );
    const prog = Math.min(1, doneSum / reductionTarget);
    setProgress(prog);
    // Motivational message
    if (prog < 1)
      setMotivationIdx((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
    // Rewards
    if (prog === 1 && !badgeEarned) {
      setShowCongrats(true);
      setBadgeEarned(true);
      setGreenCoins(10); // Example reward
    }
  };

  const resetCalculator = () => {
    setCarbonData({
      transport: 0,
      electricity: 0,
      water: 0,
      food: 0,
      waste: 0,
    });
    setTransportMode("");
    setDietType("");
    setCalculated(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-eco mb-2">
          Carbon Footprint Calculator
        </h2>
        <p className="text-muted-foreground">
          Discover your daily environmental impact and learn how to reduce it!
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <Card className="card-eco">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Daily Habits Quiz
            </h3>
            <p className="text-muted-foreground text-sm">
              Enter your daily activities to calculate your carbon footprint
            </p>
          </div>

          <div className="space-y-6">
            {/* Transport */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <Car className="h-4 w-4 text-primary" />
                Daily Transport
              </Label>
              <Select value={transportMode} onValueChange={setTransportMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Primary mode of transport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walk">Walking</SelectItem>
                  <SelectItem value="bike">Bicycle</SelectItem>
                  <SelectItem value="bus">Public Bus</SelectItem>
                  <SelectItem value="train">Train/Metro</SelectItem>
                  <SelectItem value="car">Private Car</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Distance traveled per day (km)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 10"
                  value={carbonData.transport || ""}
                  onChange={(e) =>
                    setCarbonData({
                      ...carbonData,
                      transport: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* Electricity */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <Lightbulb className="h-4 w-4 text-primary" />
                Home Electricity Use
              </Label>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Hours of electrical appliances used daily
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 6 hours (TV, lights, fan, etc.)"
                  value={carbonData.electricity || ""}
                  onChange={(e) =>
                    setCarbonData({
                      ...carbonData,
                      electricity: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* Water */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <Droplets className="h-4 w-4 text-primary" />
                Water Usage
              </Label>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Liters of water used daily
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 150 (bathing, drinking, washing)"
                  value={carbonData.water || ""}
                  onChange={(e) =>
                    setCarbonData({
                      ...carbonData,
                      water: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* Food */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <Utensils className="h-4 w-4 text-primary" />
                Diet Type
              </Label>
              <Select value={dietType} onValueChange={setDietType}>
                <SelectTrigger>
                  <SelectValue placeholder="Your typical diet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegan">
                    Vegan (no animal products)
                  </SelectItem>
                  <SelectItem value="vegetarian">
                    Vegetarian (no meat)
                  </SelectItem>
                  <SelectItem value="mixed">Mixed diet</SelectItem>
                  <SelectItem value="meat-heavy">Meat-heavy diet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Waste */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <Home className="h-4 w-4 text-primary" />
                Waste Generation
              </Label>
              <div>
                <Label className="text-sm text-muted-foreground">
                  Kg of waste generated daily
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 0.5"
                  value={carbonData.waste || ""}
                  onChange={(e) =>
                    setCarbonData({
                      ...carbonData,
                      waste: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                className="btn-eco flex-1"
                onClick={() => setCalculated(true)}
                disabled={!transportMode || !dietType}
              >
                Calculate My Footprint
              </Button>
              <Button variant="outline" onClick={resetCalculator}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        <Card className="card-eco">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <TreePine className="h-5 w-5 text-primary" />
              Your Carbon Footprint
            </h3>
            <p className="text-muted-foreground text-sm">
              Daily CO₂ emissions breakdown and offset recommendations
            </p>
          </div>

          {results ? (
            <div className="space-y-6">
              {/* Total Footprint */}
              <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-xl">
                <div className="text-3xl font-bold text-gradient-eco mb-2">
                  {results.total.toFixed(1)} kg
                </div>
                <p className="text-muted-foreground">CO₂ per day</p>
                <p className="text-sm text-muted-foreground mt-2">
                  That's {(results.total * 365).toFixed(0)} kg per year
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-4">
                <h4 className="font-semibold">Emission Sources</h4>

                {[
                  { name: "Transport", value: results.transport, icon: Car },
                  {
                    name: "Electricity",
                    value: results.electricity,
                    icon: Lightbulb,
                  },
                  { name: "Food", value: results.food, icon: Utensils },
                  { name: "Water", value: results.water, icon: Droplets },
                  { name: "Waste", value: results.waste, icon: Home },
                ].map((item) => {
                  const percentage = (item.value / results.total) * 100;
                  return (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          {item.name}
                        </div>
                        <span className="font-semibold">
                          {item.value.toFixed(1)} kg
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>

              {/* Offset Recommendation */}
              <div className="p-4 bg-gradient-to-r from-success/10 to-primary/10 rounded-xl">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TreePine className="h-4 w-4 text-success" />
                  To Offset Your Footprint
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Plant{" "}
                  <span className="font-bold text-success">
                    {treesToOffset} trees
                  </span>{" "}
                  per year or reduce your daily emissions by making eco-friendly
                  choices!
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span>Use public transport: Save 0.13 kg CO₂/km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span>Switch to LED bulbs: Save 0.5 kg CO₂/day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span>Reduce meat intake: Save 2.5 kg CO₂/day</span>
                  </div>
                </div>
              </div>

              {/* Set Target Feature */}
              {isAboveAverage && targetMode === "none" && (
                <div className="p-4 bg-gradient-to-r from-warning/10 to-primary/10 rounded-xl mt-4">
                  <h4 className="font-semibold mb-2">
                    Your footprint is above average
                  </h4>
                  <p className="mb-2">
                    Set a goal to reduce your footprint by:
                  </p>
                  <div className="flex gap-2 items-center mb-2">
                    <Input
                      type="number"
                      min={5}
                      max={50}
                      value={targetPercent}
                      onChange={(e) =>
                        setTargetPercent(
                          Math.max(
                            5,
                            Math.min(50, parseInt(e.target.value) || 10)
                          )
                        )
                      }
                      className="w-20"
                    />
                    <span>%</span>
                    <Select
                      value={targetPeriod}
                      onValueChange={(v) =>
                        setTargetPeriod(v as "weekly" | "monthly")
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="btn-eco mt-2" onClick={handleSetGoal}>
                    Set Goal & Get Tasks
                  </Button>
                </div>
              )}
              {/* Show tasks and progress if goal is active */}
              {targetMode === "active" && (
                <div className="p-4 bg-gradient-to-r from-primary/10 to-success/10 rounded-xl mt-4">
                  <h4 className="font-semibold mb-2">
                    Your {targetPeriod} CO₂ Reduction Goal
                  </h4>
                  <p className="mb-2">
                    Reduce by{" "}
                    <span className="font-bold text-primary">
                      {targetPercent}%
                    </span>{" "}
                    ({reductionTarget.toFixed(1)} kg CO₂)
                  </p>
                  <div className="mb-2">
                    <Progress value={progressPercent} className="h-3" />
                    <div className="text-xs mt-1">
                      You've achieved {progressPercent}% of your {targetPeriod}{" "}
                      goal — keep it up!
                    </div>
                  </div>
                  <ul className="mb-2 space-y-2">
                    {tasks.map((t, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={() => handleTaskDone(i)}
                        />
                        <span
                          className={
                            t.done ? "line-through text-muted-foreground" : ""
                          }
                        >
                          {t.task}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (
                          {(
                            t.reduction * (targetPeriod === "weekly" ? 7 : 30)
                          ).toFixed(2)}{" "}
                          kg)
                        </span>
                      </li>
                    ))}
                  </ul>
                  {progressPercent < 100 && (
                    <div className="text-success font-semibold mt-2">
                      {MOTIVATIONAL_MESSAGES[motivationIdx]}
                    </div>
                  )}
                  {progressPercent === 100 && badgeEarned && (
                    <div className="mt-2">
                      <div className="text-2xl font-bold text-success">
                        🎉 Goal Achieved!
                      </div>
                      <div className="text-primary font-semibold">
                        You've earned a badge and 10 GreenCoins!
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Show congrats modal/message if completed */}
              {showCongrats && (
                <div className="p-4 bg-gradient-to-r from-success/20 to-primary/10 rounded-xl mt-4 text-center">
                  <div className="text-2xl">🏅</div>
                  <div className="font-bold text-success">Congratulations!</div>
                  <div className="mb-2">
                    You completed your CO₂ reduction goal!
                  </div>
                  <div className="text-primary">
                    Badge +10 GreenCoins awarded
                  </div>
                  <Button
                    className="mt-2"
                    onClick={() => setTargetMode("completed")}
                  >
                    OK
                  </Button>
                </div>
              )}
              {/* Button to start over or set new goal */}
              {targetMode === "completed" && (
                <div className="text-center mt-4">
                  <Button
                    className="btn-eco"
                    onClick={() => setTargetMode("none")}
                  >
                    Set New Goal
                  </Button>
                </div>
              )}

              <Button className="btn-eco w-full">
                Start Reducing My Footprint
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calculator className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-muted-foreground mb-2">
                Calculate Your Impact
              </h4>
              <p className="text-sm text-muted-foreground">
                Fill in your daily habits to see your carbon footprint and learn
                how to reduce it.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CarbonCalculator;
