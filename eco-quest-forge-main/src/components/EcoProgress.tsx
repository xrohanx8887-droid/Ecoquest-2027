import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  TreePine,
  Droplets,
  Recycle,
  Zap,
  Target,
  Wind,
  Car,
  Home,
  Smartphone,
  Coffee,
  Waves,
  BookOpen,
  Heart,
  Users,
  Globe,
  Mountain,
  CheckCircle,
  Lightbulb,
  Battery,
  Pickaxe,
  Trophy,
} from "lucide-react";

interface ProgressCategory {
  id: string;
  name: string;
  icon: any;
  current: number;
  target: number;
  unit: string;
  color: string;
  description: string;
}

interface ImpactMessage {
  text: string;
  icon: any;
}

const EcoProgress = () => {
  const categories: ProgressCategory[] = [
    {
      id: "trees",
      name: "Trees Planted",
      icon: TreePine,
      current: 12,
      target: 25,
      unit: "trees",
      color: "from-primary to-primary-glow",
      description: "Contributing to reforestation efforts",
    },
    {
      id: "water",
      name: "Water Saved",
      icon: Droplets,
      current: 150,
      target: 300,
      unit: "liters",
      color: "from-accent to-primary-glow",
      description: "Daily water conservation habits",
    },
    {
      id: "waste",
      name: "Waste Recycled",
      icon: Recycle,
      current: 45,
      target: 100,
      unit: "kg",
      color: "from-cyan-400 to-cyan-600",
      description: "Proper waste segregation & recycling",
    },
    {
      id: "energy",
      name: "Energy Conserved",
      icon: Zap,
      current: 80,
      target: 200,
      unit: "kWh",
      color: "from-sky-400 to-sky-600",
      description: "Reducing electricity consumption",
    },
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  // Impact calculation functions
  const getTreeImpact = (trees: number): ImpactMessage[] => {
    const oxygenPeople = Math.round(trees * 2); // 1 tree provides oxygen for 2 people
    const co2Km = Math.round(trees * 83); // 1 tree absorbs CO2 equivalent to 83km driving
    const erosionArea = trees >= 1 ? "football field" : "small garden";

    return [
      {
        text: `${trees} trees planted = enough oxygen for ${oxygenPeople} people every year`,
        icon: Users,
      },
      {
        text: `You've absorbed the CO₂ of driving ${co2Km} km`,
        icon: Car,
      },
      {
        text: `You're helping prevent soil erosion over an area the size of a ${erosionArea}`,
        icon: Mountain,
      },
    ];
  };

  const getWaterImpact = (liters: number): ImpactMessage[] => {
    const drinkingDays = Math.round(liters / 15); // 15 liters per person per day
    const bathtubs = Math.round(liters / 50); // 50 liters per bathtub
    const teaCups = Math.round(liters / 0.5); // 0.5 liters per cup of tea

    return [
      {
        text: `${liters} liters saved = clean drinking water for 1 person for ${drinkingDays} days`,
        icon: CheckCircle,
      },
      {
        text: `You've saved enough water to fill ${bathtubs} bathtubs`,
        icon: Waves,
      },
      {
        text: `This is equal to ${teaCups} cups of tea`,
        icon: Coffee,
      },
    ];
  };

  const getWasteImpact = (kg: number): ImpactMessage[] => {
    const co2Prevented = Math.round(kg * 2); // 1kg recycled prevents 2kg CO2
    const schoolBenches = Math.round(kg / 5); // 5kg plastic = 1 school bench
    const pandaWeight = kg >= 100 ? "panda" : "small dog";

    return [
      {
        text: `${kg} kg recycled = prevented ${co2Prevented} kg of CO₂ emissions`,
        icon: Globe,
      },
      {
        text: `Enough to create ${schoolBenches} new school benches from recycled plastic`,
        icon: BookOpen,
      },
      {
        text: `Equal to the weight of a ${pandaWeight} being kept out of landfills`,
        icon: Heart,
      },
    ];
  };

  const getEnergyImpact = (kwh: number): ImpactMessage[] => {
    const homesPowered = Math.round(kwh / 2); // 2 kWh powers 1 home for a day
    const smartphones = Math.round(kwh * 81); // 1 kWh charges ~81 smartphones
    const coalBurned = Math.round(kwh * 0.44); // 1 kWh = 0.44kg coal

    return [
      {
        text: `${kwh} kWh saved = powering ${homesPowered} homes for a day`,
        icon: Lightbulb,
      },
      {
        text: `Equal to charging ${smartphones} smartphones`,
        icon: Battery,
      },
      {
        text: `You've prevented the burning of ${coalBurned} kg of coal`,
        icon: Pickaxe,
      },
    ];
  };

  const getImpactMessages = (category: ProgressCategory): ImpactMessage[] => {
    switch (category.id) {
      case "trees":
        return getTreeImpact(category.current);
      case "water":
        return getWaterImpact(category.current);
      case "waste":
        return getWasteImpact(category.current);
      case "energy":
        return getEnergyImpact(category.current);
      default:
        return [];
    }
  };

  return (
    <Card className="card-eco">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Environmental Impact Progress
        </h3>
        <p className="text-muted-foreground">
          Track your real-world environmental contributions and see your impact
          grow!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const percentage = getProgressPercentage(
            category.current,
            category.target
          );
          const impactMessages = getImpactMessages(category);

          return (
            <div key={category.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl bg-gradient-to-r ${category.color} p-0.5`}
                  >
                    <div className="h-full w-full rounded-lg bg-background flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{category.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gradient-eco">
                    {category.current}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    of {category.target} {category.unit}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="progress-eco">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${category.color} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(percentage)}% completed</span>
                  <span>
                    {category.target - category.current} {category.unit} to go
                  </span>
                </div>
              </div>

              {/* Real-world Impact Messages */}
              <div className="space-y-2">
                {impactMessages.map((impact, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-1 text-xs">
                      <impact.icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {impact.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Milestone indicator */}
              {percentage >= 50 && percentage < 100 && (
                <div className="text-xs text-success font-medium flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Halfway there! Keep going!
                </div>
              )}
              {percentage >= 100 && (
                <div className="text-xs text-success font-medium flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  Goal achieved! Amazing work!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Progress Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-gradient-eco mb-1">
            {Math.round(
              categories.reduce(
                (acc, cat) =>
                  acc + getProgressPercentage(cat.current, cat.target),
                0
              ) / categories.length
            )}
            %
          </div>
          <p className="text-sm text-muted-foreground">
            Overall Environmental Impact
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EcoProgress;
