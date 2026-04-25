import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Plus,
  CheckCircle,
  Clock,
  Droplets,
  TreePine,
  Recycle,
  Zap,
  Camera,
  Users,
  Wind,
  Home,
  Heart,
  Globe,
} from "lucide-react";

interface EcoAction {
  id: string;
  title: string;
  description: string;
  points: number;
  category: "water" | "energy" | "waste" | "transport" | "food";
  icon: any;
  completed: boolean;
  date?: string;
  streak?: number;
}

interface JournalEntry {
  id: string;
  date: string;
  actions: EcoAction[];
  notes?: string;
  totalPoints: number;
}

const EcoJournal = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newNote, setNewNote] = useState("");

  const ecoActions: EcoAction[] = [
    {
      id: "water-1",
      title: "Turn off tap while brushing",
      description: "Save water by turning off the tap while brushing teeth",
      points: 10,
      category: "water",
      icon: Droplets,
      completed: true,
      streak: 5,
    },
    {
      id: "transport-1",
      title: "Walk/bike to school",
      description: "Use eco-friendly transportation",
      points: 25,
      category: "transport",
      icon: TreePine,
      completed: true,
      streak: 3,
    },
    {
      id: "waste-1",
      title: "Separate recyclables",
      description: "Properly segregate waste for recycling",
      points: 15,
      category: "waste",
      icon: Recycle,
      completed: false,
    },
    {
      id: "energy-1",
      title: "Unplug unused devices",
      description: "Save energy by unplugging chargers and electronics",
      points: 20,
      category: "energy",
      icon: Zap,
      completed: true,
    },
    {
      id: "water-2",
      title: "Take shorter showers",
      description: "Reduce shower time to conserve water",
      points: 15,
      category: "water",
      icon: Droplets,
      completed: false,
    },
    {
      id: "food-1",
      title: "Use reusable water bottle",
      description: "Avoid single-use plastic bottles",
      points: 10,
      category: "food",
      icon: Droplets,
      completed: true,
      streak: 8,
    },
  ];

  const journalEntries: JournalEntry[] = [
    {
      id: "1",
      date: "2024-01-29",
      actions: ecoActions.filter((a) => a.completed),
      notes:
        "Great day! Remembered to turn off all lights before leaving home.",
      totalPoints: 80,
    },
    {
      id: "2",
      date: "2024-01-28",
      actions: ecoActions.slice(0, 3),
      notes: "Planted a small herb garden with family.",
      totalPoints: 50,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "water":
        return "bg-gradient-to-r from-accent to-primary-glow text-accent-foreground";
      case "energy":
        return "bg-gradient-to-r from-warning to-primary text-warning-foreground";
      case "waste":
        return "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground";
      case "transport":
        return "bg-gradient-to-r from-primary-glow to-accent text-primary-foreground";
      case "food":
        return "bg-gradient-to-r from-success to-primary-glow text-success-foreground";
      default:
        return "badge-eco";
    }
  };

  const completedActions = ecoActions.filter((a) => a.completed);
  const todayPoints = completedActions.reduce(
    (sum, action) => sum + action.points,
    0
  );

  // Calculate combined impact from all environmental actions
  const calculateCombinedImpact = () => {
    // Sample data - in real app, this would come from user's actual progress
    const treesPlanted = 12;
    const waterSaved = 150; // liters
    const wasteRecycled = 45; // kg
    const energyConserved = 80; // kWh

    // Calculate impacts
    const oxygenPeople = Math.round(treesPlanted * 2); // 1 tree = oxygen for 2 people
    const waterDays = Math.round(waterSaved / 15); // 15 liters per person per day
    const homesPowered = Math.round(energyConserved / 2); // 2 kWh powers 1 home
    const co2Prevented = Math.round(wasteRecycled * 2); // 1kg recycled prevents 2kg CO2
    const totalImpact = oxygenPeople + waterDays + homesPowered + co2Prevented;

    return {
      oxygenPeople,
      waterDays,
      homesPowered,
      co2Prevented,
      totalImpact,
    };
  };

  const impactData = calculateCombinedImpact();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-eco mb-2">
          Eco Journal
        </h2>
        <p className="text-muted-foreground">
          Track your daily eco-friendly habits and build a sustainable
          lifestyle!
        </p>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-eco text-center">
          <Calendar className="h-8 w-8 text-primary mx-auto mb-2 animate-bounce-gentle" />
          <h3 className="text-lg font-bold text-gradient-eco">
            {new Date().toLocaleDateString()}
          </h3>
          <p className="text-sm text-muted-foreground">Today</p>
        </Card>

        <Card className="card-eco text-center">
          <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
          <h3 className="text-lg font-bold">
            {completedActions.length} / {ecoActions.length}
          </h3>
          <p className="text-sm text-muted-foreground">Actions Completed</p>
        </Card>

        <Card className="card-eco text-center">
          <TreePine className="h-8 w-8 text-primary mx-auto mb-2 animate-float" />
          <h3 className="text-lg font-bold text-gradient-water">
            {todayPoints}
          </h3>
          <p className="text-sm text-muted-foreground">Points Earned</p>
        </Card>
      </div>

      {/* Your Impact in Society */}
      <Card className="card-eco bg-gradient-to-br from-primary/5 to-primary-glow/10 border-primary/20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gradient-eco">
                Your Impact in Society
              </h3>
              <p className="text-sm text-muted-foreground">
                See how your eco-actions create real-world positive change
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="flex items-center justify-center mb-2">
                <Wind className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-700">
                {impactData.oxygenPeople}
              </div>
              <div className="text-sm text-green-600 font-medium">
                People with Oxygen
              </div>
              <div className="text-xs text-green-500 mt-1">
                From {12} trees planted 
              </div>
            </div>

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center justify-center mb-2">
                <Droplets className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {impactData.waterDays}
              </div>
              <div className="text-sm text-blue-600 font-medium">
                Days of Clean Water
              </div>
              <div className="text-xs text-blue-500 mt-1">
                From {150}L saved 
              </div>
            </div>

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
              <div className="flex items-center justify-center mb-2">
                <Home className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-700">
                {impactData.homesPowered}
              </div>
              <div className="text-sm text-yellow-600 font-medium">
                Homes Powered
              </div>
              <div className="text-xs text-yellow-500 mt-1">
                From {80}kWh saved 
              </div>
            </div>

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {impactData.co2Prevented}kg
              </div>
              <div className="text-sm text-purple-600 font-medium">
                CO₂ Prevented
              </div>
              <div className="text-xs text-purple-500 mt-1">
                From {45}kg recycled 
              </div>
            </div>
          </div>

          <div className="text-center p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary-glow/20 border border-primary/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-gradient-eco">
                Combined Impact
              </span>
            </div>
            <div className="text-3xl font-bold text-gradient-eco mb-2">
              {impactData.totalImpact} Lives Touched
            </div>
            <p className="text-sm text-muted-foreground">
              Your environmental actions are making a real difference in
              people's lives and the planet! Every small action contributes to a
              bigger, greener future. 🌱✨
            </p>
          </div>
        </div>
      </Card>

      {/* Today's Actions */}
      <Card className="card-eco">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Today's Eco Actions
          </h3>
          <Button size="sm" className="btn-eco">
            <Plus className="h-4 w-4 mr-2" />
            Add Custom
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ecoActions.map((action) => (
            <div
              key={action.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${
                action.completed
                  ? "border-success/20 bg-gradient-to-r from-success/5 to-primary-glow/5"
                  : "border-muted hover:border-primary/20"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl ${getCategoryColor(
                      action.category
                    )} p-0.5`}
                  >
                    <div className="h-full w-full rounded-lg bg-background flex items-center justify-center">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">
                      {action.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>

                {action.completed ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted" />
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {action.category}
                  </Badge>
                  <span className="text-primary font-semibold">
                    +{action.points} pts
                  </span>
                </div>

                {action.streak && action.completed && (
                  <div className="flex items-center gap-1 text-warning">
                    🔥 {action.streak} day streak
                  </div>
                )}
              </div>

              {!action.completed && (
                <Button size="sm" className="w-full mt-3 btn-eco">
                  Mark Complete
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Notes Section */}
      <Card className="card-eco">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Today's Reflection
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Add a note about your eco journey:
            </label>
            <Input
              placeholder="What did you learn about the environment today? Any challenges or wins?"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="mb-3"
            />
            <div className="flex gap-2">
              <Button size="sm" className="btn-eco">
                Save Note
              </Button>
              <Button size="sm" variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Journal History */}
      <Card className="card-eco">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Previous Entries
        </h3>

        <div className="space-y-4">
          {journalEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-xl bg-muted/30 hover:bg-primary/5 hover:border-primary/20 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold">
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-sm text-gradient-eco font-semibold">
                  +{entry.totalPoints} points
                </div>
              </div>

              {entry.notes && (
                <p className="text-sm text-muted-foreground mb-3 italic">
                  "{entry.notes}"
                </p>
              )}

              <div className="flex flex-wrap gap-1">
                {entry.actions.slice(0, 3).map((action) => (
                  <Badge
                    key={action.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {action.title}
                  </Badge>
                ))}
                {entry.actions.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{entry.actions.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default EcoJournal;
