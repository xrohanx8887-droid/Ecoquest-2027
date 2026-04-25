import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  Droplets,
  Wind,
  TreePine,
  Flame,
  Recycle,
  Calendar,
  MapPin,
  Trophy,
  Star,
  Target,
  CheckCircle,
  Clock,
  Users,
  Zap,
  Heart,
  Leaf,
  Globe,
  Megaphone,
  Sparkles,
} from "lucide-react";
import {
  buildOrganizeDrivePayload,
  type LinkedDriveInfo,
  type OrganizeDrivePayload,
} from "@/lib/alertToDrive";

interface EcoAlert {
  id: string;
  type:
    | "air"
    | "water"
    | "festival"
    | "disaster"
    | "wildlife"
    | "plastic"
    | "heat"
    | "pollution";
  title: string;
  message: string;
  location: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  actions: EcoAction[];
  quiz: QuizQuestion;
  rewards: {
    points: number;
    badge?: string;
    streak?: number;
  };
  isCompleted: boolean;
  participants: number;
  category: "local" | "national" | "global";
  impactMessage: string;
  collectiveImpact: {
    targetUsers: number;
    impact: string;
    description: string;
  };
}

interface EcoAction {
  id: string;
  title: string;
  description: string;
  impact: string;
  isSelected: boolean;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface EcoAlertsProps {
  onOrganizeCommunityDrive?: (payload: OrganizeDrivePayload) => void;
  linkedDriveByAlert?: Record<string, LinkedDriveInfo>;
}

const EcoAlerts = ({
  onOrganizeCommunityDrive,
  linkedDriveByAlert = {},
}: EcoAlertsProps) => {
  const [alerts, setAlerts] = useState<EcoAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<EcoAlert | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [activeQuizAlert, setActiveQuizAlert] = useState<EcoAlert | null>(null);
  const [filter, setFilter] = useState<"all" | "local" | "national" | "global">(
    "all"
  );
  const [showNewAlert, setShowNewAlert] = useState(false);

  // Sample alerts data
  useEffect(() => {
    const sampleAlerts: EcoAlert[] = [
      {
        id: "1",
        type: "air",
        title: "Delhi AQI hits 420 – Hazardous Smog Levels!",
        message:
          "The air quality in Delhi has reached dangerous levels. Take immediate action to protect yourself and help reduce pollution.",
        location: "Delhi, India",
        severity: "critical",
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: "a1",
            title: "Carpool to School",
            description: "Share rides with friends to reduce vehicle emissions",
            impact: "Reduces CO₂ by 2.5kg per trip",
            isSelected: false,
          },
          {
            id: "a2",
            title: "Plant Indoor Air Purifiers",
            description: "Add plants like Aloe Vera or Snake Plant at home",
            impact: "Removes 87% of air toxins",
            isSelected: false,
          },
          {
            id: "a3",
            title: "Avoid Crackers & Fireworks",
            description: "Choose eco-friendly celebrations",
            impact: "Reduces PM2.5 by 40%",
            isSelected: false,
          },
        ],
        quiz: {
          question: "Which indoor plant absorbs maximum CO₂?",
          options: ["Snake Plant", "Aloe Vera", "Spider Plant", "Rubber Plant"],
          correctAnswer: 2,
          explanation:
            "Spider Plant is known to absorb the most CO₂ and other toxins from indoor air.",
        },
        rewards: {
          points: 50,
          badge: "Air Guardian",
          streak: 1,
        },
        isCompleted: false,
        participants: 1247,
        category: "local",
        impactMessage:
          "You chose the sustainable path. By reducing vehicle emissions and improving air quality, you are protecting both people and the planet.",
        collectiveImpact: {
          targetUsers: 5000,
          impact: "AQI could decrease by 10%",
          description:
            "If 5000 users will take action today, Delhi's AQI could decrease by 10% in just 3 days ",
        },
      },
      {
        id: "2",
        type: "festival",
        title: "Ganesh Visarjan Alert - Choose Eco-Friendly Idols!",
        message:
          "Mumbai's Ganesh Visarjan festival is approaching. Make the right choice for our water bodies.",
        location: "Mumbai, India",
        severity: "medium",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        actions: [
          {
            id: "b1",
            title: "Clay Idol (Eco-Friendly)",
            description:
              "Choose idols made from natural clay that dissolve safely",
            impact: "Zero water pollution",
            isSelected: false,
          },
          {
            id: "b2",
            title: "POP Idol (Harmful)",
            description: "Plaster of Paris idols cause severe water pollution",
            impact: "Causes 40% water contamination",
            isSelected: false,
          },
        ],
        quiz: {
          question:
            "What harm does POP (Plaster of Paris) cause to water bodies?",
          options: [
            "No harm",
            "Reduces oxygen",
            "Kills fish",
            "All of the above",
          ],
          correctAnswer: 3,
          explanation:
            "POP idols cause severe water pollution, reduce oxygen levels, and kill aquatic life.",
        },
        rewards: {
          points: 75,
          badge: "Festival Protector",
          streak: 2,
        },
        isCompleted: false,
        participants: 892,
        category: "local",
        impactMessage:
          "You chose the eco-friendly path. By selecting clay idols over POP, you are protecting our water bodies and marine life.",
        collectiveImpact: {
          targetUsers: 3000,
          impact: "Water pollution reduced by 15%",
          description:
            "If 3000 users will choose clay idols, Mumbai's water pollution could reduce by 15%",
        },
      },
      {
        id: "3",
        type: "water",
        title: "Yamuna River Pollution Crisis!",
        message:
          "The Yamuna River is facing severe pollution. Join the virtual cleanup mission and learn about water conservation.",
        location: "Delhi, India",
        severity: "high",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        actions: [
          {
            id: "c1",
            title: "AR River Cleanup",
            description: "Use AR technology to virtually clean the river",
            impact: "Educates 1000+ students",
            isSelected: false,
          },
          {
            id: "c2",
            title: "Water Conservation Pledge",
            description: "Commit to saving water in daily activities",
            impact: "Saves 50L water per day",
            isSelected: false,
          },
        ],
        quiz: {
          question: "Which waste harms rivers the most?",
          options: ["Plastic bottles", "Chemical waste", "Food waste", "Paper"],
          correctAnswer: 1,
          explanation:
            "Chemical waste is the most harmful as it directly contaminates water and kills aquatic life.",
        },
        rewards: {
          points: 100,
          badge: "River Guardian",
          streak: 3,
        },
        isCompleted: false,
        participants: 2156,
        category: "national",
        impactMessage:
          "You chose the sustainable path. By conserving water and joining the cleanup mission, you are protecting our precious water resources.",
        collectiveImpact: {
          targetUsers: 10000,
          impact: "River health improved by 20%",
          description:
            "If 10000 users will take action, Yamuna River health could improve by 20%",
        },
      },
      {
        id: "4",
        type: "disaster",
        title: "Kerala Flood Alert - Tree Planting Mission!",
        message:
          "Recent floods in Kerala highlight the importance of trees in preventing soil erosion and floods.",
        location: "Kerala, India",
        severity: "high",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        actions: [
          {
            id: "d1",
            title: "Tree Planting Pledge",
            description: "Plant native trees in your community",
            impact: "Prevents soil erosion by 80%",
            isSelected: false,
          },
          {
            id: "d2",
            title: "Rainwater Harvesting",
            description: "Learn and implement rainwater collection",
            impact: "Saves 10,000L annually",
            isSelected: false,
          },
        ],
        quiz: {
          question: "Which tree prevents soil erosion most effectively?",
          options: ["Mango", "Bamboo", "Eucalyptus", "Pine"],
          correctAnswer: 1,
          explanation:
            "Bamboo has extensive root systems that hold soil together and prevent erosion effectively.",
        },
        rewards: {
          points: 150,
          badge: "Flood Fighter",
          streak: 4,
        },
        isCompleted: false,
        participants: 3421,
        category: "national",
        impactMessage:
          "You chose the sustainable path. By planting trees and implementing rainwater harvesting, you are building climate resilience.",
        collectiveImpact: {
          targetUsers: 8000,
          impact: "Flood risk reduced by 25%",
          description:
            "If 8000 users plant trees, Kerala's flood risk could reduce by 25%",
        },
      },
      {
        id: "5",
        type: "air",
        title: "Punjab AQI crosses 400 – Hazardous Smog from Stubble Burning!",
        message:
          "Air pollution is rising due to stubble burning. It not only harms people but also reduces soil health. Your small eco-actions can make a big difference.",
        location: "Punjab, India",
        severity: "critical",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        actions: [
          {
            id: "e1",
            title: "Carpool or Cycle to School",
            description: "Reduce vehicle emissions to lower smog levels",
            impact: "Reduces CO₂ by 3kg per trip",
            isSelected: false,
          },
          {
            id: "e2",
            title: "Plant Air-Purifying Plants",
            description: "Add indoor & outdoor plants that absorb CO₂ & toxins",
            impact: "Improves air quality by 40%",
            isSelected: false,
          },
          {
            id: "e3",
            title: "Spread Awareness About Happy Seeder",
            description:
              "Educate family about sustainable alternatives to stubble burning",
            impact: "Long-term solution for farmers",
            isSelected: false,
          },
          {
            id: "e4",
            title: "Reduce Cracker Use in Diwali",
            description: "Avoid adding more smoke during AQI crisis",
            impact: "Prevents PM2.5 increase by 50%",
            isSelected: false,
          },
        ],
        quiz: {
          question:
            "What is the best sustainable alternative to stubble burning?",
          options: [
            "Burning fields faster 🔥",
            "Using Happy Seeder machine 🌾",
            "Dumping stubble in rivers 🌊",
            "Spraying chemicals 🧪",
          ],
          correctAnswer: 1,
          explanation:
            "Happy Seeder machine allows farmers to sow new crops without burning stubble, making it the most sustainable solution.",
        },
        rewards: {
          points: 100,
          badge: "Clean Air Champion",
          streak: 5,
        },
        isCompleted: false,
        participants: 4567,
        category: "national",
        impactMessage:
          "You chose the sustainable path. By reducing pollution and spreading awareness, you are protecting both people and the planet.",
        collectiveImpact: {
          targetUsers: 7000,
          impact: "AQI could decrease by 12%",
          description:
            "If 7000 users will take action today, Punjab's AQI could decrease by 12%",
        },
      },
    ];
    setAlerts(sampleAlerts);
  }, []);

  const getAlertIcon = (type: EcoAlert["type"]) => {
    const iconMap = {
      air: Wind,
      water: Droplets,
      festival: Calendar,
      disaster: AlertTriangle,
      wildlife: TreePine,
      plastic: Recycle,
      heat: Flame,
      pollution: Zap,
    };
    return iconMap[type];
  };

  const getAlertColor = (
    type: EcoAlert["type"],
    severity: EcoAlert["severity"]
  ) => {
    const colorMap = {
      air:
        severity === "critical"
          ? "bg-red-100 border-red-300 text-red-800"
          : "bg-orange-100 border-orange-300 text-orange-800",
      water: "bg-blue-100 border-blue-300 text-blue-800",
      festival: "bg-purple-100 border-purple-300 text-purple-800",
      disaster: "bg-red-100 border-red-300 text-red-800",
      wildlife: "bg-green-100 border-green-300 text-green-800",
      plastic: "bg-yellow-100 border-yellow-300 text-yellow-800",
      heat: "bg-orange-100 border-orange-300 text-orange-800",
      pollution: "bg-gray-100 border-gray-300 text-gray-800",
    };
    return colorMap[type];
  };

  const getSeverityIcon = (severity: EcoAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-green-600" />;
    }
  };

  const filteredAlerts = alerts.filter(
    (alert) => filter === "all" || alert.category === filter
  );

  const handleActionSelect = (alertId: string, actionId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              actions: alert.actions.map((action) =>
                action.id === actionId
                  ? { ...action, isSelected: !action.isSelected }
                  : action
              ),
            }
          : alert
      )
    );

    // Keep the currently open modal's actions in sync for instant feedback
    setSelectedAlert((prev) => {
      if (!prev || prev.id !== alertId) return prev;
      return {
        ...prev,
        actions: prev.actions.map((a) =>
          a.id === actionId ? { ...a, isSelected: !a.isSelected } : a
        ),
      };
    });
  };

  const handleQuizSubmit = () => {
    if (activeQuizAlert && quizAnswer !== null) {
      const isCorrect = quizAnswer === activeQuizAlert.quiz.correctAnswer;
      if (isCorrect) {
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.id === activeQuizAlert.id
              ? { ...alert, isCompleted: true }
              : alert
          )
        );
        // Show success message with impact
        alert(activeQuizAlert.impactMessage);
      } else {
        // Show correct answer explanation
        alert(`Incorrect! ${activeQuizAlert.quiz.explanation}`);
      }
      setShowQuiz(false);
      setQuizAnswer(null);
      setActiveQuizAlert(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-eco mb-2">
          Eco-Alerts
        </h2>
        <p className="text-muted-foreground">
          Stay informed about environmental issues and take action to make a
          difference
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="flex gap-2 bg-card/50 p-2 rounded-2xl backdrop-blur-sm max-w-full overflow-x-auto whitespace-nowrap">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            className={`flex items-center gap-2 rounded-xl transition-all duration-200 shrink-0 text-sm px-3 py-1 sm:px-4 sm:py-2 ${
              filter === "all"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                : "hover:bg-red-50 hover:text-red-600 hover:shadow-sm text-red-700"
            }`}
            onClick={() => setFilter("all")}
          >
            <Globe className="h-4 w-4" />
            All Alerts
          </Button>
          <Button
            variant={filter === "local" ? "default" : "ghost"}
            className={`flex items-center gap-2 rounded-xl transition-all duration-200 shrink-0 text-sm px-3 py-1 sm:px-4 sm:py-2 ${
              filter === "local"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                : "hover:bg-red-50 hover:text-red-600 hover:shadow-sm text-red-700"
            }`}
            onClick={() => setFilter("local")}
          >
            <MapPin className="h-4 w-4" />
            Local
          </Button>
          <Button
            variant={filter === "national" ? "default" : "ghost"}
            className={`flex items-center gap-2 rounded-xl transition-all duration-200 shrink-0 text-sm px-3 py-1 sm:px-4 sm:py-2 ${
              filter === "national"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                : "hover:bg-red-50 hover:text-red-600 hover:shadow-sm text-red-700"
            }`}
            onClick={() => setFilter("national")}
          >
            <Heart className="h-4 w-4" />
            National
          </Button>
          <Button
            variant={filter === "global" ? "default" : "ghost"}
            className={`flex items-center gap-2 rounded-xl transition-all duration-200 shrink-0 text-sm px-3 py-1 sm:px-4 sm:py-2 ${
              filter === "global"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                : "hover:bg-red-50 hover:text-red-600 hover:shadow-sm text-red-700"
            }`}
            onClick={() => setFilter("global")}
          >
            <Globe className="h-4 w-4" />
            Global
          </Button>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlerts.map((alert) => {
          const Icon = getAlertIcon(alert.type);
          const alertColor = getAlertColor(alert.type, alert.severity);
          const completedActions = alert.actions.filter(
            (action) => action.isSelected
          ).length;
          const totalActions = alert.actions.length;

          return (
            <Card
              key={alert.id}
              className={`card-eco border-l-4 border-l-red-500 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                alert.isCompleted ? "opacity-75" : ""
              }`}
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="p-4 space-y-3">
                {/* Alert Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${alertColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${alertColor}`}
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {alert.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getSeverityIcon(alert.severity)}
                    {alert.isCompleted && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>

                {/* Alert Content */}
                <div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {alert.message}
                  </p>
                </div>

                {linkedDriveByAlert[alert.id] && (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="font-semibold text-emerald-800 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      Student-led drive live
                    </div>
                    <p className="text-emerald-900/80 mt-0.5 line-clamp-2">
                      {linkedDriveByAlert[alert.id].driveTitle}
                    </p>
                  </div>
                )}

                {/* Collective Impact */}
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary/5 to-primary-glow/10 border border-primary/20">
                  <div className="text-xs font-medium text-primary mb-1">
                    🌍 Collective Impact
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {alert.collectiveImpact.description}
                  </div>
                </div>

                {/* Progress & Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Actions Taken</span>
                    <span className="font-semibold">
                      {completedActions}/{totalActions}
                    </span>
                  </div>
                  <Progress
                    value={(completedActions / totalActions) * 100}
                    className="h-2"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{alert.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3" />
                      <span>{alert.rewards.points} pts</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full btn-eco text-xs"
                  size="sm"
                  disabled={alert.isCompleted}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAlert(alert);
                  }}
                >
                  {alert.isCompleted ? "Completed" : "Take Action"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Alert Detail Modal */}
      <Dialog
        open={!!selectedAlert}
        onOpenChange={() => setSelectedAlert(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAlert && (
                <>
                  {React.createElement(getAlertIcon(selectedAlert.type), {
                    className: "h-5 w-5",
                  })}
                  {selectedAlert.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-6">
              {/* Alert Info */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {selectedAlert.message}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{selectedAlert.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(selectedAlert.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>
                      {selectedAlert.participants.toLocaleString()} participants
                    </span>
                  </div>
                </div>
              </div>

              {/* Three paths callout */}
              <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3 text-sm">
                <p className="font-medium text-foreground mb-1">
                  Pick your path
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>
                    <span className="text-foreground font-medium">
                      Individual:
                    </span>{" "}
                    select actions below, then take the quiz for points.
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Learn:</span>{" "}
                    quiz rewards your knowledge.
                  </li>
                  <li>
                    <span className="text-foreground font-medium">Lead:</span>{" "}
                    start a community drive—pre-filled from this alert.
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Individual actions
                </h4>
                <div className="space-y-2">
                  {selectedAlert.actions.map((action) => (
                    <div
                      key={action.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        action.isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() =>
                        handleActionSelect(selectedAlert.id, action.id)
                      }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">
                            {action.title}
                          </h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            {action.description}
                          </p>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {action.impact}
                            </Badge>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            action.isSelected
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`}
                        >
                          {action.isSelected && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rewards */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary-glow/10 border border-primary/20">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  Rewards
                </h4>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-warning" />
                    <span>{selectedAlert.rewards.points} EcoPoints</span>
                  </div>
                  {selectedAlert.rewards.badge && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {selectedAlert.rewards.badge}
                    </Badge>
                  )}
                  {selectedAlert.rewards.streak && (
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span>{selectedAlert.rewards.streak} day streak</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Organize community drive — direct path to collective action */}
              <div className="rounded-xl border-2 border-fun-purple/30 bg-gradient-to-r from-fun-purple/10 to-fun-blue/10 p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Megaphone className="h-5 w-5 text-fun-purple shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">
                      Organize a community drive
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mobilize classmates with a real-world event. We’ll open
                      Community Drives with a form pre-filled from this alert.
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-fun-purple to-fun-blue text-white hover:opacity-95 shadow-md"
                  disabled={!onOrganizeCommunityDrive || selectedAlert.isCompleted}
                  onClick={() => {
                    if (!selectedAlert || !onOrganizeCommunityDrive) return;
                    const payload = buildOrganizeDrivePayload(selectedAlert);
                    setSelectedAlert(null);
                    onOrganizeCommunityDrive(payload);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Organize community drive
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedAlert(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  className="btn-eco flex-1"
                  onClick={() => {
                    if (!selectedAlert) return;
                    setActiveQuizAlert(selectedAlert);
                    setShowQuiz(true);
                    setSelectedAlert(null);
                  }}
                  disabled={selectedAlert.actions.every(
                    (action) => !action.isSelected
                  )}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Take quiz & earn rewards
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quiz Modal */}
      <Dialog
        open={showQuiz}
        onOpenChange={(o) => {
          if (!o) {
            setActiveQuizAlert(null);
            setQuizAnswer(null);
          }
          setShowQuiz(o);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Eco Quiz</DialogTitle>
          </DialogHeader>

          {activeQuizAlert && (
            <div className="space-y-4">
              <p className="text-sm font-medium">
                {activeQuizAlert.quiz.question}
              </p>

              <div className="space-y-2">
                {activeQuizAlert.quiz.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      quizAnswer === index
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setQuizAnswer(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          quizAnswer === index
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {quizAnswer === index && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-sm">{option}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowQuiz(false)}
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button
                  className="btn-eco flex-1"
                  onClick={handleQuizSubmit}
                  disabled={quizAnswer === null}
                >
                  Submit Answer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EcoAlerts;
