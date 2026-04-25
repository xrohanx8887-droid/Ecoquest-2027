import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Zap,
  Droplets,
  Recycle,
  TreePine,
  CheckCircle,
  Clock,
  Star,
  Brain,
  Camera,
  Users,
  Trophy,
  Target,
  Upload,
  AlertCircle,
  Smile,
  Frown,
  Heart,
  Flame,
  Eye,
  Bike,
  Power,
  Smartphone,
  Trash2,
  Leaf,
  GraduationCap,
  Crown,
  Building,
  Shield,
  School,
  Wheat,
  MessageSquare,
  Award,
  AlertTriangle,
  Stethoscope,
  Microscope,
} from "lucide-react";
import LearningLesson from "./LearningLesson";
import { useGreenCoins } from "@/hooks/useGreenCoins";
import EcoStories from "@/components/EcoStories";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  completed: boolean;
  locked: boolean;
  hasQuiz?: boolean;
  hasMission?: boolean;
}

interface ScenarioQuiz {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    correct: boolean;
    explanation: string;
    points: number;
  }[];
  category: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  type: "daily" | "weekly";
  completed: boolean;
  proofUploaded: boolean;
  deadline: string;
  icon: any;
  impactMessage: string;
}

interface SustainPathRole {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
}

interface SustainPathOption {
  id: string;
  text: string;
  impact: string;
  isCorrect: boolean;
  points: number;
}

interface SustainPathScenario {
  id: string;
  roleId: string;
  title: string;
  description: string;
  options: SustainPathOption[];
  rightChoiceMessage: string;
  wrongChoiceMessage: string;
}

const LearningModules = () => {
  const { earnCoins } = useGreenCoins();
  const [activeTab, setActiveTab] = useState<
    "modules" | "quizzes" | "missions" | "battles" | "stories" | "sustainpath"
  >("modules");
  const [currentQuiz, setCurrentQuiz] = useState<ScenarioQuiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [battleMode, setBattleMode] = useState(false);
  const [opponent, setOpponent] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<{
    moduleId: string;
    moduleTitle: string;
  } | null>(null);

  // SustainPath state
  const [selectedRole, setSelectedRole] = useState<SustainPathRole | null>(
    null
  );
  const [currentScenario, setCurrentScenario] =
    useState<SustainPathScenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [scenarioCompleted, setScenarioCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [modules, setModules] = useState<Module[]>([
    {
      id: "climate-basics",
      title: "Climate Change Basics",
      description:
        "Understanding global warming, greenhouse gases, and their impact on our planet.",
      icon: Zap,
      progress: 100,
      points: 150,
      difficulty: "Easy",
      duration: "15 min",
      completed: true,
      locked: false,
      hasQuiz: true,
      hasMission: true,
    },
    {
      id: "water-conservation",
      title: "Water Conservation",
      description:
        "Learn practical ways to save water and protect our precious water resources.",
      icon: Droplets,
      progress: 60,
      points: 120,
      difficulty: "Easy",
      duration: "12 min",
      completed: false,
      locked: false,
      hasQuiz: true,
      hasMission: true,
    },
    {
      id: "waste-management",
      title: "Waste & Recycling",
      description:
        "Master the 3 Rs: Reduce, Reuse, Recycle. Build a sustainable future.",
      icon: Recycle,
      progress: 0,
      points: 180,
      difficulty: "Medium",
      duration: "20 min",
      completed: false,
      locked: false,
      hasQuiz: true,
      hasMission: true,
    },
    {
      id: "renewable-energy",
      title: "Renewable Energy",
      description:
        "Discover solar, wind, and other clean energy sources powering our future.",
      icon: TreePine,
      progress: 0,
      points: 200,
      difficulty: "Medium",
      duration: "25 min",
      completed: false,
      locked: false,
      hasQuiz: true,
      hasMission: true,
    },
    {
      id: "biodiversity",
      title: "Biodiversity & Ecosystems",
      description:
        "Explore the interconnected web of life and how to protect endangered species.",
      icon: TreePine,
      progress: 0,
      points: 250,
      difficulty: "Hard",
      duration: "30 min",
      completed: false,
      locked: true,
      hasQuiz: true,
      hasMission: true,
    },
    {
      id: "un-sdgs",
      title: "United Nations SDGs",
      description:
        "Learn about the 17 Sustainable Development Goals and how to contribute to global sustainability.",
      icon: Target,
      progress: 0,
      points: 300,
      difficulty: "Medium",
      duration: "35 min",
      completed: false,
      locked: false,
      hasQuiz: true,
      hasMission: true,
    },
    {
      id: "community-drives",
      title: "Community Action Drives",
      description:
        "Master the art of organizing plantation drives, river cleaning, and cleanup campaigns in your community.",
      icon: Users,
      progress: 0,
      points: 280,
      difficulty: "Medium",
      duration: "40 min",
      completed: false,
      locked: false,
      hasQuiz: true,
      hasMission: true,
    },
  ]);

  const [scenarioQuizzes] = useState<ScenarioQuiz[]>([
    {
      id: "plastic-bottle",
      question: "You see a plastic bottle on the ground. What should you do?",
      options: [
        {
          id: "recycle",
          text: "Pick it up and put it in the recycling bin",
          correct: true,
          explanation:
            "Recycling is the best option! Plastic bottles can be turned into new products, reducing waste and saving resources.",
          points: 25,
        },
        {
          id: "burn",
          text: "Burn it to get rid of it quickly",
          correct: false,
          explanation:
            "Burning plastic releases toxic chemicals into the air and contributes to air pollution. Never burn plastic!",
          points: 0,
        },
        {
          id: "ignore",
          text: "Ignore it - it's not my problem",
          correct: false,
          explanation:
            "Litter affects everyone and harms wildlife. Taking responsibility for our environment is everyone's duty.",
          points: 0,
        },
      ],
      category: "Waste Management",
    },
    {
      id: "friend-littering",
      question:
        "You see your friend throwing plastic in a park. What do you do?",
      options: [
        {
          id: "confront",
          text: "Politely explain why littering is harmful and suggest proper disposal",
          correct: true,
          explanation:
            "Educating others respectfully helps create positive change. Your friend will learn and might influence others too!",
          points: 30,
        },
        {
          id: "ignore-friend",
          text: "Ignore it - I don't want to upset my friend",
          correct: false,
          explanation:
            "While friendship is important, protecting the environment is crucial. A true friend will understand your concern.",
          points: 0,
        },
        {
          id: "report",
          text: "Report them to authorities immediately",
          correct: false,
          explanation:
            "Reporting should be a last resort. Try education first - most people litter out of ignorance, not malice.",
          points: 5,
        },
      ],
      category: "Social Responsibility",
    },
    {
      id: "water-tap",
      question:
        "You notice a tap is dripping in your school. What's your first action?",
      options: [
        {
          id: "report-maintenance",
          text: "Report it to the maintenance staff",
          correct: true,
          explanation:
            "A dripping tap can waste hundreds of liters of water daily. Reporting it quickly prevents water waste.",
          points: 20,
        },
        {
          id: "fix-yourself",
          text: "Try to fix it yourself",
          correct: false,
          explanation:
            "While well-intentioned, attempting repairs without proper knowledge might make it worse. Let professionals handle it.",
          points: 10,
        },
        {
          id: "ignore-tap",
          text: "Ignore it - it's just a small drip",
          correct: false,
          explanation:
            "Small drips add up to huge water waste over time. Every drop counts in water conservation!",
          points: 0,
        },
      ],
      category: "Water Conservation",
    },
    {
      id: "energy-choice",
      question: "Your family is buying new appliances. What do you recommend?",
      options: [
        {
          id: "energy-efficient",
          text: "Choose energy-efficient models with high ratings",
          correct: true,
          explanation:
            "Energy-efficient appliances save money and reduce environmental impact. Look for Energy Star ratings!",
          points: 25,
        },
        {
          id: "cheapest",
          text: "Buy the cheapest option to save money",
          correct: false,
          explanation:
            "Cheaper appliances often use more energy, costing more in the long run and harming the environment.",
          points: 0,
        },
        {
          id: "biggest",
          text: "Get the biggest and most powerful ones",
          correct: false,
          explanation:
            "Oversized appliances waste energy. Choose the right size for your needs to be efficient.",
          points: 0,
        },
      ],
      category: "Energy Conservation",
    },
  ]);

  const [missions] = useState<Mission[]>([
    // Daily Missions
    {
      id: "green-commute",
      title: "Green Commute Challenge 🚴‍♂️",
      description:
        "Use a bicycle, walk, or take public transport instead of a car for short trips today.",
      points: 30,
      type: "daily",
      completed: false,
      proofUploaded: false,
      deadline: "Today",
      icon: Bike,
      impactMessage: "You reduced X kg of CO₂ today!",
    },
    {
      id: "eco-switch-off",
      title: "Eco Switch-Off 💡",
      description:
        "Turn off all unused electronics/appliances for 2 hours today.",
      points: 25,
      type: "daily",
      completed: false,
      proofUploaded: false,
      deadline: "Today",
      icon: Power,
      impactMessage: "You prevented X kWh wastage today!",
    },
    {
      id: "digital-detox",
      title: "Digital Detox Hour 📵",
      description:
        "Stay offline for 1 hour to reduce energy from device usage.",
      points: 20,
      type: "daily",
      completed: true,
      proofUploaded: true,
      deadline: "Completed",
      icon: Smartphone,
      impactMessage: "You saved the energy equal to charging 5 phones!",
    },
    // Weekly Missions
    {
      id: "community-cleanup",
      title: "Community Clean-Up 🧹",
      description:
        "Join or organize a neighborhood clean-up, and upload a group photo.",
      points: 100,
      type: "weekly",
      completed: false,
      proofUploaded: false,
      deadline: "This Week",
      icon: Trash2,
      impactMessage: "Together, you removed X kg of waste from your area!",
    },
    {
      id: "tree-care-gardening",
      title: "Tree Care / Gardening Week 🌳",
      description:
        "Water, nurture, or plant new saplings in your garden or local area.",
      points: 80,
      type: "weekly",
      completed: false,
      proofUploaded: false,
      deadline: "This Week",
      icon: Leaf,
      impactMessage: "You helped improve local air quality for your community!",
    },
    {
      id: "zero-waste-week",
      title: "Zero-Waste Week 🚯",
      description:
        "Challenge yourself to generate no single-use plastic waste for a week.",
      points: 120,
      type: "weekly",
      completed: false,
      proofUploaded: false,
      deadline: "This Week",
      icon: Recycle,
      impactMessage: "You kept X kg of plastic out of landfills!",
    },
    {
      id: "eco-education-mission",
      title: "Eco-Education Mission 📖",
      description:
        "Teach one friend/family member about sustainable living and share a photo.",
      points: 60,
      type: "weekly",
      completed: false,
      proofUploaded: false,
      deadline: "This Week",
      icon: GraduationCap,
      impactMessage: "You inspired X more people to live greener!",
    },
  ]);

  // SustainPath data
  const [sustainPathRoles] = useState<SustainPathRole[]>([
    {
      id: "farmer",
      name: "Farmer",
      description:
        "Make decisions about sustainable farming and water conservation",
      icon: Wheat,
      color: "text-green-600",
    },
    {
      id: "mayor",
      name: "Mayor",
      description:
        "Lead your city through environmental challenges and policy decisions",
      icon: Building,
      color: "text-blue-600",
    },
    {
      id: "ips-officer",
      name: "IPS Officer",
      description: "Enforce environmental laws and fight against pollution",
      icon: Shield,
      color: "text-purple-600",
    },
    {
      id: "principal",
      name: "School Principal",
      description: "Guide your school community towards sustainable practices",
      icon: School,
      color: "text-orange-600",
    },
    {
      id: "doctor",
      name: "Doctor",
      description:
        "Address health impacts of environmental issues and promote public health",
      icon: Stethoscope,
      color: "text-red-600",
    },
    {
      id: "environmental-scientist",
      name: "Environmental Scientist",
      description:
        "Research and develop solutions for environmental challenges",
      icon: Microscope,
      color: "text-teal-600",
    },
  ]);

  const [sustainPathScenarios] = useState<SustainPathScenario[]>([
    {
      id: "farmer-water-conservation",
      roleId: "farmer",
      title: "Water Conservation Crisis",
      description:
        "It hasn't rained for weeks, and your crops are dying. You must decide how to save your farm.",
      options: [
        {
          id: "pump-groundwater",
          text: "Pump more groundwater",
          impact: "Quick relief, but depletes aquifers",
          isCorrect: false,
          points: 0,
        },
        {
          id: "drip-irrigation",
          text: "Use drip irrigation",
          impact: "Saves water long-term, requires investment",
          isCorrect: true,
          points: 50,
        },
        {
          id: "less-water-crops",
          text: "Grow less water-intensive crops",
          impact: "Sustainable, may reduce income initially",
          isCorrect: true,
          points: 40,
        },
        {
          id: "chemical-fertilizers",
          text: "Depend on chemical fertilizers",
          impact: "Short-term gain, harms soil and water",
          isCorrect: false,
          points: 0,
        },
      ],
      rightChoiceMessage:
        "Instead of chasing short-term profits, you protected the land and water. True farmers care for future generations.",
      wrongChoiceMessage:
        "This decision may give you more yield today, but it destroys soil health and water for tomorrow.",
    },
    {
      id: "mayor-water-management",
      roleId: "mayor",
      title: "City Water Management",
      description:
        "Your city is facing severe water shortage. Citizens are protesting.",
      options: [
        {
          id: "build-dam",
          text: "Build a new dam",
          impact: "Provides water, destroys forests, costly",
          isCorrect: false,
          points: 0,
        },
        {
          id: "water-rationing",
          text: "Enforce strict water rationing",
          impact: "Conserves water, unpopular decision",
          isCorrect: true,
          points: 45,
        },
        {
          id: "rainwater-harvesting",
          text: "Launch rainwater harvesting across the city",
          impact: "Slow but sustainable solution",
          isCorrect: true,
          points: 60,
        },
        {
          id: "allow-industry-water",
          text: "Allow industries to use more water",
          impact: "Economic growth, but people suffer",
          isCorrect: false,
          points: 0,
        },
      ],
      rightChoiceMessage:
        "You chose the path of sustainability. Leadership means making tough choices to protect the future, not just popularity today.",
      wrongChoiceMessage:
        "Your decision solved today's problem but created a bigger one for tomorrow. True leadership looks ahead.",
    },
    {
      id: "ips-pollution-control",
      roleId: "ips-officer",
      title: "Pollution Control",
      description:
        "Factories in your city are releasing untreated waste into rivers. People are angry.",
      options: [
        {
          id: "take-bribes",
          text: "Take bribes and ignore the issue",
          impact: "Personal gain, environmental destruction",
          isCorrect: false,
          points: 0,
        },
        {
          id: "enforce-laws",
          text: "Strictly enforce pollution laws",
          impact: "Unpopular with businesses, but protects environment",
          isCorrect: true,
          points: 55,
        },
        {
          id: "awareness-programs",
          text: "Run awareness programs only",
          impact: "Good publicity, no real change",
          isCorrect: false,
          points: 10,
        },
        {
          id: "shut-down-factories",
          text: "Shut down worst factories",
          impact: "Protects rivers, impacts employment",
          isCorrect: true,
          points: 50,
        },
      ],
      rightChoiceMessage:
        "You chose justice over corruption. True officers protect people and nature, even when it's difficult.",
      wrongChoiceMessage:
        "Looking away from the problem may give comfort today, but it poisons the river for generations.",
    },
    {
      id: "principal-waste-management",
      roleId: "principal",
      title: "Waste Management",
      description:
        "Your school canteen produces huge amounts of plastic waste every day.",
      options: [
        {
          id: "ban-single-use-plastics",
          text: "Ban single-use plastics",
          impact: "Eco-friendly, requires effort from students",
          isCorrect: true,
          points: 50,
        },
        {
          id: "biodegradable-plates",
          text: "Switch to biodegradable plates",
          impact: "Better for environment, more costly",
          isCorrect: true,
          points: 45,
        },
        {
          id: "bring-lunchbox",
          text: "Encourage 'Bring Your Own Lunchbox'",
          impact: "Low waste, needs habit change",
          isCorrect: true,
          points: 55,
        },
        {
          id: "ignore-problem",
          text: "Ignore the problem",
          impact: "Convenient, but pollutes environment",
          isCorrect: false,
          points: 0,
        },
      ],
      rightChoiceMessage:
        "You set the right example for young minds. A true leader changes habits, not just rules.",
      wrongChoiceMessage:
        "Convenience today leads to pollution tomorrow. True education means teaching responsibility.",
    },
    // Additional scenarios for existing roles
    // Farmer - 2nd scenario
    {
      id: "farmer-pesticide-dilemma",
      roleId: "farmer",
      title: "Pesticide Dilemma",
      description:
        "Your crops are being destroyed by pests. You must choose how to protect them while considering environmental impact.",
      options: [
        {
          id: "chemical-pesticides",
          text: "Use strong chemical pesticides",
          impact: "Immediate pest control, harms beneficial insects and soil",
          isCorrect: false,
          points: 0,
        },
        {
          id: "organic-pesticides",
          text: "Switch to organic pesticides",
          impact: "Safer for environment, may be less effective initially",
          isCorrect: true,
          points: 45,
        },
        {
          id: "companion-planting",
          text: "Use companion planting techniques",
          impact: "Natural pest control, requires learning new methods",
          isCorrect: true,
          points: 55,
        },
        {
          id: "genetically-modified",
          text: "Plant genetically modified pest-resistant crops",
          impact: "Effective pest control, but raises ethical concerns",
          isCorrect: false,
          points: 10,
        },
      ],
      rightChoiceMessage:
        "You chose sustainable farming methods that protect both your crops and the environment. True farmers work with nature, not against it.",
      wrongChoiceMessage:
        "Short-term solutions often create long-term problems. Sustainable farming requires patience and innovation.",
    },
    // Farmer - 3rd scenario
    {
      id: "farmer-energy-source",
      roleId: "farmer",
      title: "Farm Energy Source",
      description:
        "Your farm needs a new energy source for irrigation and equipment. Choose the most sustainable option.",
      options: [
        {
          id: "diesel-generator",
          text: "Install diesel generator",
          impact: "Reliable power, high carbon emissions and fuel costs",
          isCorrect: false,
          points: 0,
        },
        {
          id: "solar-panels",
          text: "Install solar panels",
          impact: "Clean energy, high initial cost but long-term savings",
          isCorrect: true,
          points: 60,
        },
        {
          id: "wind-turbine",
          text: "Install wind turbine",
          impact: "Renewable energy, depends on wind conditions",
          isCorrect: true,
          points: 50,
        },
        {
          id: "grid-connection",
          text: "Connect to main electricity grid",
          impact: "Convenient, but uses non-renewable energy sources",
          isCorrect: false,
          points: 15,
        },
      ],
      rightChoiceMessage:
        "You invested in renewable energy for your farm. This decision will benefit both your finances and the planet for decades to come.",
      wrongChoiceMessage:
        "Choosing fossil fuels may seem easier now, but renewable energy is the future of sustainable farming.",
    },
    // Mayor - 2nd scenario
    {
      id: "mayor-transportation",
      roleId: "mayor",
      title: "City Transportation Crisis",
      description:
        "Traffic congestion and air pollution are at an all-time high. Citizens demand action on transportation.",
      options: [
        {
          id: "build-more-roads",
          text: "Build more roads and highways",
          impact:
            "Reduces congestion temporarily, increases pollution long-term",
          isCorrect: false,
          points: 0,
        },
        {
          id: "public-transport",
          text: "Invest in public transportation",
          impact: "Reduces cars on road, requires significant investment",
          isCorrect: true,
          points: 55,
        },
        {
          id: "bike-lanes",
          text: "Create extensive bike lane network",
          impact: "Encourages cycling, requires road space reallocation",
          isCorrect: true,
          points: 50,
        },
        {
          id: "car-restrictions",
          text: "Implement car-free zones in city center",
          impact: "Reduces pollution, may face business opposition",
          isCorrect: true,
          points: 45,
        },
      ],
      rightChoiceMessage:
        "You chose sustainable transportation solutions that will improve air quality and reduce traffic for years to come.",
      wrongChoiceMessage:
        "Building more roads only encourages more driving. True leadership means changing the system, not accommodating it.",
    },
    // Mayor - 3rd scenario
    {
      id: "mayor-green-spaces",
      roleId: "mayor",
      title: "Urban Green Spaces",
      description:
        "Developers want to build on the last large green space in your city. Citizens are divided on the issue.",
      options: [
        {
          id: "allow-development",
          text: "Allow development for economic growth",
          impact: "Increases tax revenue, destroys natural habitat",
          isCorrect: false,
          points: 0,
        },
        {
          id: "create-park",
          text: "Convert to public park",
          impact: "Preserves green space, requires maintenance funding",
          isCorrect: true,
          points: 60,
        },
        {
          id: "mixed-use",
          text: "Create mixed-use development with green features",
          impact: "Balances development and environment, complex planning",
          isCorrect: true,
          points: 50,
        },
        {
          id: "community-garden",
          text: "Turn into community garden and urban farm",
          impact:
            "Provides food and green space, requires community management",
          isCorrect: true,
          points: 55,
        },
      ],
      rightChoiceMessage:
        "You protected the green space for future generations. Urban nature is essential for citizen well-being and environmental health.",
      wrongChoiceMessage:
        "Once green space is gone, it's nearly impossible to get back. True leaders protect what cannot be replaced.",
    },
    // IPS Officer - 2nd scenario
    {
      id: "ips-illegal-mining",
      roleId: "ips-officer",
      title: "Illegal Mining Operation",
      description:
        "You discover illegal mining operations destroying protected forest areas. Powerful people are involved.",
      options: [
        {
          id: "ignore-evidence",
          text: "Ignore the evidence to avoid trouble",
          impact:
            "Avoids conflict, allows environmental destruction to continue",
          isCorrect: false,
          points: 0,
        },
        {
          id: "arrest-miners",
          text: "Arrest the illegal miners immediately",
          impact: "Stops destruction, may face political pressure",
          isCorrect: true,
          points: 65,
        },
        {
          id: "gather-evidence",
          text: "Gather more evidence before acting",
          impact: "Stronger case, but allows more damage in meantime",
          isCorrect: true,
          points: 55,
        },
        {
          id: "report-superiors",
          text: "Report to higher authorities",
          impact: "Follows protocol, but may lead to cover-up",
          isCorrect: false,
          points: 20,
        },
      ],
      rightChoiceMessage:
        "You stood up for justice and the environment despite pressure. True officers protect the law and nature, even when it's difficult.",
      wrongChoiceMessage:
        "Looking away from environmental crimes allows destruction to continue. Your duty is to protect, not to be popular.",
    },
    // IPS Officer - 3rd scenario
    {
      id: "ips-wildlife-trafficking",
      roleId: "ips-officer",
      title: "Wildlife Trafficking Ring",
      description:
        "You've uncovered a wildlife trafficking operation. The suspects are offering bribes to make the case disappear.",
      options: [
        {
          id: "accept-bribe",
          text: "Accept the bribe and close the case",
          impact: "Personal gain, but allows wildlife exploitation to continue",
          isCorrect: false,
          points: 0,
        },
        {
          id: "arrest-traffickers",
          text: "Arrest the traffickers and rescue animals",
          impact: "Saves wildlife, may face threats from criminal network",
          isCorrect: true,
          points: 70,
        },
        {
          id: "coordinate-raid",
          text: "Coordinate with wildlife agencies for joint raid",
          impact: "More effective operation, requires time and coordination",
          isCorrect: true,
          points: 65,
        },
        {
          id: "undercover-operation",
          text: "Go undercover to gather more evidence",
          impact: "Gathers more evidence, but very dangerous",
          isCorrect: true,
          points: 60,
        },
      ],
      rightChoiceMessage:
        "You chose justice over corruption and saved innocent animals. Your integrity protects both wildlife and the rule of law.",
      wrongChoiceMessage:
        "Accepting bribes makes you part of the problem. True officers fight corruption, not participate in it.",
    },
    // Principal - 2nd scenario
    {
      id: "principal-energy-conservation",
      roleId: "principal",
      title: "School Energy Conservation",
      description:
        "Your school's electricity bills are extremely high. You need to implement energy-saving measures.",
      options: [
        {
          id: "do-nothing",
          text: "Continue with current energy usage",
          impact: "No change needed, but high costs and environmental impact",
          isCorrect: false,
          points: 0,
        },
        {
          id: "led-lights",
          text: "Replace all lights with LED bulbs",
          impact: "Significant energy savings, moderate upfront cost",
          isCorrect: true,
          points: 50,
        },
        {
          id: "solar-panels",
          text: "Install solar panels on school roof",
          impact: "Clean energy, high initial cost but long-term savings",
          isCorrect: true,
          points: 65,
        },
        {
          id: "energy-education",
          text: "Start energy conservation education program",
          impact: "Teaches students, requires behavior change from everyone",
          isCorrect: true,
          points: 55,
        },
      ],
      rightChoiceMessage:
        "You implemented sustainable energy solutions that will save money and teach students about environmental responsibility.",
      wrongChoiceMessage:
        "Ignoring energy waste costs both money and the environment. True education includes teaching sustainable practices.",
    },
    // Principal - 3rd scenario
    {
      id: "principal-food-waste",
      roleId: "principal",
      title: "School Food Waste Crisis",
      description:
        "Your school cafeteria throws away massive amounts of food daily while some students go hungry.",
      options: [
        {
          id: "ignore-problem",
          text: "Ignore the food waste issue",
          impact: "No action needed, but continues waste and hunger",
          isCorrect: false,
          points: 0,
        },
        {
          id: "food-donation",
          text: "Start food donation program",
          impact:
            "Reduces waste and helps hungry students, requires coordination",
          isCorrect: true,
          points: 60,
        },
        {
          id: "portion-control",
          text: "Implement better portion control",
          impact: "Reduces waste at source, requires staff training",
          isCorrect: true,
          points: 50,
        },
        {
          id: "composting",
          text: "Start composting program for food scraps",
          impact: "Reduces landfill waste, creates garden fertilizer",
          isCorrect: true,
          points: 55,
        },
      ],
      rightChoiceMessage:
        "You addressed both food waste and student hunger. This solution teaches students about resource management and compassion.",
      wrongChoiceMessage:
        "Food waste while students go hungry is unacceptable. True leadership means solving problems, not ignoring them.",
    },
    // Doctor - 1st scenario
    {
      id: "doctor-air-pollution",
      roleId: "doctor",
      title: "Air Pollution Health Crisis",
      description:
        "Your city has dangerous air pollution levels. Many patients are suffering from respiratory problems. You must act.",
      options: [
        {
          id: "treat-symptoms",
          text: "Just treat the respiratory symptoms",
          impact: "Helps patients short-term, doesn't address root cause",
          isCorrect: false,
          points: 10,
        },
        {
          id: "public-health-campaign",
          text: "Launch public health awareness campaign",
          impact: "Educates public about risks, requires time and resources",
          isCorrect: true,
          points: 55,
        },
        {
          id: "advocate-government",
          text: "Advocate for stricter air quality regulations",
          impact: "Addresses root cause, may face political opposition",
          isCorrect: true,
          points: 65,
        },
        {
          id: "research-study",
          text: "Conduct research study on pollution health effects",
          impact: "Provides evidence for action, takes time to complete",
          isCorrect: true,
          points: 60,
        },
      ],
      rightChoiceMessage:
        "You chose to address the root cause of health problems. True doctors prevent disease, not just treat symptoms.",
      wrongChoiceMessage:
        "Treating symptoms without addressing causes is like putting a band-aid on a broken bone. Prevention is the best medicine.",
    },
    // Doctor - 2nd scenario
    {
      id: "doctor-climate-health",
      roleId: "doctor",
      title: "Climate Change Health Impact",
      description:
        "Heat waves are becoming more frequent and severe. Your hospital is overwhelmed with heat-related illnesses.",
      options: [
        {
          id: "increase-ac-capacity",
          text: "Just increase air conditioning capacity",
          impact: "Immediate relief, but increases energy consumption",
          isCorrect: false,
          points: 15,
        },
        {
          id: "community-cooling",
          text: "Create community cooling centers",
          impact: "Helps vulnerable populations, requires coordination",
          isCorrect: true,
          points: 60,
        },
        {
          id: "heat-education",
          text: "Educate community about heat safety",
          impact: "Prevents heat illness, requires outreach effort",
          isCorrect: true,
          points: 55,
        },
        {
          id: "green-infrastructure",
          text: "Advocate for green infrastructure and tree planting",
          impact: "Long-term cooling solution, requires city planning",
          isCorrect: true,
          points: 70,
        },
      ],
      rightChoiceMessage:
        "You addressed both immediate needs and long-term solutions. True healthcare considers both individual and community health.",
      wrongChoiceMessage:
        "Only treating the symptoms of climate change won't solve the problem. Healthcare must include environmental action.",
    },
    // Environmental Scientist - 1st scenario
    {
      id: "scientist-coral-reef",
      roleId: "environmental-scientist",
      title: "Coral Reef Restoration",
      description:
        "Local coral reefs are dying due to ocean warming and pollution. You must decide how to help restore them.",
      options: [
        {
          id: "do-nothing",
          text: "Do nothing - let nature take its course",
          impact: "No action needed, but reefs continue to die",
          isCorrect: false,
          points: 0,
        },
        {
          id: "coral-planting",
          text: "Start coral reef restoration project",
          impact: "Directly helps reefs, requires funding and expertise",
          isCorrect: true,
          points: 65,
        },
        {
          id: "water-quality",
          text: "Focus on improving water quality first",
          impact: "Addresses root cause, takes time to see results",
          isCorrect: true,
          points: 60,
        },
        {
          id: "public-education",
          text: "Educate public about reef conservation",
          impact: "Builds support for protection, requires outreach",
          isCorrect: true,
          points: 55,
        },
      ],
      rightChoiceMessage:
        "You chose science-based solutions that address both immediate and long-term reef health. True scientists use knowledge to heal the planet.",
      wrongChoiceMessage:
        "Doing nothing while ecosystems die is not scientific. Research must lead to action for the environment.",
    },
    // Environmental Scientist - 2nd scenario
    {
      id: "scientist-climate-data",
      roleId: "environmental-scientist",
      title: "Climate Data Controversy",
      description:
        "Your climate research shows alarming temperature trends, but powerful interests want you to downplay the findings.",
      options: [
        {
          id: "downplay-findings",
          text: "Downplay the findings to avoid controversy",
          impact: "Avoids conflict, but delays urgent action needed",
          isCorrect: false,
          points: 0,
        },
        {
          id: "publish-truth",
          text: "Publish the complete, alarming findings",
          impact: "Tells truth about climate, may face backlash",
          isCorrect: true,
          points: 70,
        },
        {
          id: "seek-support",
          text: "Seek support from other scientists first",
          impact: "Builds consensus, but takes time",
          isCorrect: true,
          points: 60,
        },
        {
          id: "media-outreach",
          text: "Present findings to media and public",
          impact: "Raises awareness, but may face political pressure",
          isCorrect: true,
          points: 65,
        },
      ],
      rightChoiceMessage:
        "You chose scientific integrity over political pressure. Truth in science is essential for protecting our planet's future.",
      wrongChoiceMessage:
        "Compromising scientific truth for convenience endangers everyone. Scientists must speak truth to power, not hide from it.",
    },
  ]);

  const startLesson = (moduleId: string, moduleTitle: string) => {
    setCurrentLesson({ moduleId, moduleTitle });
  };

  const handleLessonComplete = (points: number) => {
    // Update module progress and completion status
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === currentLesson?.moduleId
          ? {
              ...module,
              progress: 100,
              completed: true,
              points: module.points + points,
            }
          : module
      )
    );

    // Earn GreenCoins for completing the lesson
    const coinsEarned = Math.floor(points / 5); // Convert points to coins
    earnCoins(coinsEarned, `Lesson: ${currentLesson?.moduleTitle}`);

    setCurrentLesson(null);
  };

  const handleBackToModules = () => {
    setCurrentLesson(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "badge-eco";
      case "Medium":
        return "badge-water";
      case "Hard":
        return "bg-gradient-to-r from-warning to-destructive text-warning-foreground px-3 py-1 rounded-full text-sm font-semibold";
      default:
        return "badge-eco";
    }
  };

  const startQuiz = (quiz: ScenarioQuiz) => {
    setCurrentQuiz(quiz);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const submitQuizAnswer = () => {
    if (selectedAnswer && currentQuiz) {
      setQuizCompleted(true);
      setShowExplanation(true);

      // Earn GreenCoins for completing the quiz
      const selectedOption = getSelectedOption();
      if (selectedOption && selectedOption.correct) {
        const coinsEarned = Math.floor(selectedOption.points / 5); // Convert points to coins
        earnCoins(coinsEarned, `Quiz: ${currentQuiz.category}`);
      }
    }
  };

  const getSelectedOption = () => {
    if (!selectedAnswer || !currentQuiz) return null;
    return currentQuiz.options.find((option) => option.id === selectedAnswer);
  };

  // SustainPath handlers
  const selectRole = (role: SustainPathRole) => {
    setSelectedRole(role);
    const roleScenarios = sustainPathScenarios.filter(
      (scenario) => scenario.roleId === role.id
    );
    if (roleScenarios.length > 0) {
      setCurrentScenario(roleScenarios[0]);
    }
    setSelectedOption(null);
    setScenarioCompleted(false);
    setShowResult(false);
  };

  const selectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const submitSustainPathChoice = () => {
    if (selectedOption && currentScenario) {
      setScenarioCompleted(true);
      setShowResult(true);

      const selectedOptionData = currentScenario.options.find(
        (option) => option.id === selectedOption
      );
      if (selectedOptionData && selectedOptionData.isCorrect) {
        const coinsEarned = Math.floor(selectedOptionData.points / 5);
        earnCoins(coinsEarned, `SustainPath: ${currentScenario.title}`);
      }
    }
  };

  const resetSustainPath = () => {
    setSelectedRole(null);
    setCurrentScenario(null);
    setSelectedOption(null);
    setScenarioCompleted(false);
    setShowResult(false);
  };

  const getSelectedSustainPathOption = () => {
    if (!selectedOption || !currentScenario) return null;
    return currentScenario.options.find(
      (option) => option.id === selectedOption
    );
  };

  // Generate quiz options based on module
  const generateModuleQuizOptions = (module: Module) => {
    const baseOptions = [
      {
        id: "correct-1",
        text: "This is a correct answer based on the module content",
        correct: true,
        explanation:
          "Great job! This demonstrates understanding of the key concepts from this module.",
        points: 25,
      },
      {
        id: "incorrect-1",
        text: "This is an incorrect answer",
        correct: false,
        explanation:
          "This is not the right answer. Review the module content to better understand the concepts.",
        points: 0,
      },
      {
        id: "incorrect-2",
        text: "This is another incorrect answer",
        correct: false,
        explanation:
          "This is also incorrect. Make sure to study the module materials carefully.",
        points: 0,
      },
      {
        id: "correct-2",
        text: "This is another correct answer",
        correct: true,
        explanation:
          "Excellent! You have a good grasp of the environmental concepts in this module.",
        points: 20,
      },
    ];

    // Customize options based on module type
    switch (module.id) {
      case "climate-basics":
        return [
          {
            id: "greenhouse-gases",
            text: "Greenhouse gases trap heat in the atmosphere",
            correct: true,
            explanation:
              "Correct! Greenhouse gases like CO2, methane, and water vapor trap heat, causing global warming.",
            points: 30,
          },
          {
            id: "ozone-layer",
            text: "The ozone layer causes global warming",
            correct: false,
            explanation:
              "Incorrect. The ozone layer protects us from UV rays. Global warming is caused by greenhouse gases.",
            points: 0,
          },
          {
            id: "natural-cycle",
            text: "Climate change is entirely natural",
            correct: false,
            explanation:
              "While climate naturally varies, human activities have significantly accelerated recent changes.",
            points: 0,
          },
          {
            id: "human-impact",
            text: "Human activities contribute to climate change",
            correct: true,
            explanation:
              "Correct! Human activities like burning fossil fuels have increased greenhouse gas concentrations.",
            points: 25,
          },
        ];
      case "water-conservation":
        return [
          {
            id: "fix-leaks",
            text: "Fixing leaks saves significant amounts of water",
            correct: true,
            explanation:
              "Correct! A single leaky faucet can waste hundreds of gallons per month.",
            points: 30,
          },
          {
            id: "long-showers",
            text: "Long showers don't waste much water",
            correct: false,
            explanation:
              "Incorrect. Long showers can use 2-5 gallons per minute, wasting significant water.",
            points: 0,
          },
          {
            id: "rainwater-harvesting",
            text: "Rainwater harvesting is an effective conservation method",
            correct: true,
            explanation:
              "Correct! Collecting rainwater reduces demand on municipal water supplies.",
            points: 25,
          },
          {
            id: "water-unlimited",
            text: "Water is an unlimited resource",
            correct: false,
            explanation:
              "Incorrect. Fresh water is a limited resource that needs to be conserved.",
            points: 0,
          },
        ];
      case "waste-management":
        return [
          {
            id: "reduce-first",
            text: "Reduce is the most important of the 3 Rs",
            correct: true,
            explanation:
              "Correct! Reducing consumption is the most effective way to minimize waste.",
            points: 30,
          },
          {
            id: "recycle-only",
            text: "Recycling alone solves waste problems",
            correct: false,
            explanation:
              "Incorrect. While recycling helps, reducing and reusing are more important.",
            points: 0,
          },
          {
            id: "composting",
            text: "Composting organic waste is beneficial",
            correct: true,
            explanation:
              "Correct! Composting reduces landfill waste and creates nutrient-rich soil.",
            points: 25,
          },
          {
            id: "single-use",
            text: "Single-use items are always necessary",
            correct: false,
            explanation:
              "Incorrect. Many single-use items can be replaced with reusable alternatives.",
            points: 0,
          },
        ];
      case "renewable-energy":
        return [
          {
            id: "solar-clean",
            text: "Solar energy is clean and renewable",
            correct: true,
            explanation:
              "Correct! Solar energy produces no emissions and is infinitely renewable.",
            points: 30,
          },
          {
            id: "fossil-renewable",
            text: "Fossil fuels are renewable energy sources",
            correct: false,
            explanation:
              "Incorrect. Fossil fuels are non-renewable and finite resources.",
            points: 0,
          },
          {
            id: "wind-energy",
            text: "Wind energy is a sustainable option",
            correct: true,
            explanation:
              "Correct! Wind energy is clean, renewable, and increasingly cost-effective.",
            points: 25,
          },
          {
            id: "nuclear-renewable",
            text: "Nuclear energy is a renewable resource",
            correct: false,
            explanation:
              "Incorrect. While nuclear is low-carbon, uranium is a finite resource.",
            points: 0,
          },
        ];
      case "biodiversity":
        return [
          {
            id: "ecosystem-important",
            text: "Biodiversity is crucial for ecosystem health",
            correct: true,
            explanation:
              "Correct! Biodiversity ensures ecosystem stability and resilience.",
            points: 30,
          },
          {
            id: "extinction-normal",
            text: "Species extinction is always natural",
            correct: false,
            explanation:
              "Incorrect. Current extinction rates are 100-1000 times higher than natural rates.",
            points: 0,
          },
          {
            id: "habitat-protection",
            text: "Protecting habitats helps preserve biodiversity",
            correct: true,
            explanation:
              "Correct! Habitat protection is essential for species survival.",
            points: 25,
          },
          {
            id: "one-species",
            text: "Losing one species doesn't matter",
            correct: false,
            explanation:
              "Incorrect. Each species plays a role in ecosystem balance.",
            points: 0,
          },
        ];
      case "un-sdgs":
        return [
          {
            id: "sdg-17-goals",
            text: "There are 17 Sustainable Development Goals",
            correct: true,
            explanation:
              "Correct! The UN SDGs consist of 17 interconnected goals to achieve a better and more sustainable future.",
            points: 30,
          },
          {
            id: "sdg-2030",
            text: "SDGs must be achieved by 2030",
            correct: true,
            explanation:
              "Correct! The 2030 Agenda for Sustainable Development sets 2030 as the target year.",
            points: 25,
          },
          {
            id: "sdg-only-environment",
            text: "SDGs focus only on environmental issues",
            correct: false,
            explanation:
              "Incorrect. SDGs address social, economic, and environmental dimensions of sustainable development.",
            points: 0,
          },
          {
            id: "sdg-climate-action",
            text: "Climate Action is SDG 13",
            correct: true,
            explanation:
              "Correct! SDG 13 focuses on taking urgent action to combat climate change and its impacts.",
            points: 25,
          },
        ];
      case "community-drives":
        return [
          {
            id: "planning-important",
            text: "Proper planning is essential for successful community drives",
            correct: true,
            explanation:
              "Correct! Good planning ensures safety, effectiveness, and community engagement.",
            points: 30,
          },
          {
            id: "permission-needed",
            text: "You need permission for public space activities",
            correct: true,
            explanation:
              "Correct! Always get proper permits and permissions from local authorities.",
            points: 25,
          },
          {
            id: "safety-first",
            text: "Safety equipment is optional for cleanup drives",
            correct: false,
            explanation:
              "Incorrect. Safety equipment like gloves, masks, and proper tools are essential.",
            points: 0,
          },
          {
            id: "community-engagement",
            text: "Community engagement increases drive success",
            correct: true,
            explanation:
              "Correct! Involving the community in planning and execution leads to better outcomes.",
            points: 25,
          },
        ];
      default:
        return baseOptions;
    }
  };

  const renderQuiz = () => {
    if (!currentQuiz) return null;

    const selectedOption = getSelectedOption();

    return (
      <Card className="card-eco">
        <div className="text-center mb-6">
          <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
          <h3 className="text-xl font-semibold text-gradient-eco mb-2">
            Scenario Quiz
          </h3>
          <Badge variant="secondary" className="mb-4">
            {currentQuiz.category}
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Question */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">
              🤔 {currentQuiz.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuiz.options.map((option) => (
              <div
                key={option.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedAnswer === option.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleAnswerSelect(option.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedAnswer === option.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  />
                  <span className="font-medium">{option.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          {!quizCompleted && (
            <Button
              className="w-full btn-eco"
              onClick={submitQuizAnswer}
              disabled={!selectedAnswer}
            >
              Submit Answer
            </Button>
          )}

          {/* Results */}
          {showExplanation && selectedOption && (
            <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                {selectedOption.correct ? (
                  <Smile className="h-5 w-5 text-success" />
                ) : (
                  <Frown className="h-5 w-5 text-destructive" />
                )}
                <h5 className="font-semibold">
                  {selectedOption.correct ? "Correct!" : "Incorrect"}
                </h5>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedOption.explanation}
              </p>
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-warning/10 text-warning"
                >
                  +{selectedOption.points} points
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentQuiz(null);
                    setShowExplanation(false);
                  }}
                >
                  Next Quiz
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderMissions = () => (
    <div className="space-y-6">
      {/* Daily Missions Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gradient-eco flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Daily Missions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {missions
            .filter((mission) => mission.type === "daily")
            .map((mission) => (
              <Card key={mission.id} className="card-eco">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                      <mission.icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      Daily
                    </Badge>
                  </div>
                  {mission.completed && (
                    <CheckCircle className="h-5 w-5 text-success" />
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2">{mission.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {mission.description}
                </p>

                {/* Impact Message */}
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary/5 to-primary-glow/10 border border-primary/20 mb-4">
                  <p className="text-xs font-medium text-primary">
                    {mission.impactMessage}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-sm font-semibold text-warning">
                    <Star className="h-4 w-4 fill-current" />
                    {mission.points} points
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {mission.deadline}
                  </div>
                </div>

                {!mission.completed ? (
                  <div className="space-y-3">
                    <Button className="w-full btn-eco" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Proof
                    </Button>
                    <div className="text-xs text-muted-foreground text-center">
                      Take a photo or video of your completed mission
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Badge
                      variant="secondary"
                      className="bg-success/10 text-success"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                )}
              </Card>
            ))}
        </div>
      </div>

      {/* Weekly Missions Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gradient-eco flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Weekly Missions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions
            .filter((mission) => mission.type === "weekly")
            .map((mission) => (
              <Card key={mission.id} className="card-eco">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-warning to-accent flex items-center justify-center">
                      <mission.icon className="h-5 w-5 text-warning-foreground" />
                    </div>
                    <Badge
                      variant="outline"
                      className="border-warning text-warning"
                    >
                      Weekly
                    </Badge>
                  </div>
                  {mission.completed && (
                    <CheckCircle className="h-5 w-5 text-success" />
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2">{mission.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {mission.description}
                </p>

                {/* Impact Message */}
                <div className="p-3 rounded-lg bg-gradient-to-r from-warning/5 to-accent/10 border border-warning/20 mb-4">
                  <p className="text-sm font-medium text-warning">
                    {mission.impactMessage}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-sm font-semibold text-warning">
                    <Star className="h-4 w-4 fill-current" />
                    {mission.points} points
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {mission.deadline}
                  </div>
                </div>

                {!mission.completed ? (
                  <div className="space-y-3">
                    <Button className="w-full btn-eco" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Proof
                    </Button>
                    <div className="text-xs text-muted-foreground text-center">
                      Take a photo or video of your completed mission
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Badge
                      variant="secondary"
                      className="bg-success/10 text-success"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                )}
              </Card>
            ))}
        </div>
      </div>
    </div>
  );

  const renderBattles = () => (
    <div className="space-y-6">
      {battleMode ? (
        <Card className="card-eco">
          <div className="text-center mb-6">
            <Trophy className="h-8 w-8 text-warning mx-auto mb-2" />
            <h3 className="text-xl font-semibold">Battle Mode</h3>
            <p className="text-muted-foreground">
              Challenge a friend to an eco quiz battle!
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="opponent">Opponent's Username</Label>
              <Input
                id="opponent"
                placeholder="Enter friend's username"
                value={opponent || ""}
                onChange={(e) => setOpponent(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                className="btn-eco"
                onClick={() => {
                  // Start battle logic
                  setBattleMode(false);
                }}
                disabled={!opponent}
              >
                <Users className="h-4 w-4 mr-2" />
                Start Battle
              </Button>
              <Button variant="outline" onClick={() => setBattleMode(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-eco text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Challenge Friends</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Send eco quiz challenges to your classmates and compete for the
              top spot!
            </p>
            <Button className="btn-eco" onClick={() => setBattleMode(true)}>
              Start Battle
            </Button>
          </Card>

          <Card className="card-eco text-center">
            <Trophy className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Battle Leaderboard</h3>
            <p className="text-sm text-muted-foreground mb-4">
              See who's the eco knowledge champion in your school!
            </p>
            <Button variant="outline">View Rankings</Button>
          </Card>
        </div>
      )}

      {/* Active Battles */}
      <Card className="card-eco">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Active Battles
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">You vs @eco_warrior</div>
                <div className="text-xs text-muted-foreground">
                  Environmental Science Quiz
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-warning/10 text-warning">
              In Progress
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSustainPath = () => (
    <div className="space-y-6">
      {!selectedRole ? (
        // Role Selection
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Crown className="h-12 w-12 text-primary mx-auto mb-4 animate-bounce-gentle" />
            <h3 className="text-xl font-semibold text-gradient-eco mb-2">
              Choose Your Leadership Role
            </h3>
            <p className="text-muted-foreground">
              Select a role to begin your sustainability leadership journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sustainPathRoles.map((role) => (
              <Card
                key={role.id}
                className="card-eco cursor-pointer hover:shadow-eco transition-all duration-200"
                onClick={() => selectRole(role)}
              >
                <div className="text-center p-6">
                  <div
                    className={`h-16 w-16 rounded-2xl bg-gradient-to-r from-primary/20 to-primary-glow/20 flex items-center justify-center mx-auto mb-4`}
                  >
                    <role.icon className={`h-8 w-8 ${role.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{role.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {role.description}
                  </p>
                  <Button
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                    size="sm"
                  >
                    Start as {role.name}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : !currentScenario ? (
        // No scenarios available
        <Card className="card-eco text-center">
          <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Scenarios Available</h3>
          <p className="text-muted-foreground mb-4">
            There are no scenarios available for the {selectedRole.name} role
            yet.
          </p>
          <Button
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
            onClick={resetSustainPath}
          >
            Choose Different Role
          </Button>
        </Card>
      ) : (
        // Scenario Display
        <Card className="card-eco">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-r from-primary/20 to-primary-glow/20 flex items-center justify-center`}
              >
                <selectedRole.icon
                  className={`h-6 w-6 ${selectedRole.color}`}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gradient-eco">
                  {selectedRole.name} Role
                </h3>
                <Badge variant="secondary" className="mt-1">
                  Leadership Challenge
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Scenario Description */}
            <div className="bg-muted/30 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                {currentScenario.title}
              </h4>
              <p className="text-muted-foreground">
                {currentScenario.description}
              </p>
            </div>

            {/* Options */}
            {!scenarioCompleted ? (
              <div className="space-y-3">
                <h5 className="font-semibold text-center mb-4">
                  What will you decide?
                </h5>
                {currentScenario.options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedOption === option.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => selectOption(option.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedOption === option.id
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`}
                      />
                      <div className="flex-1">
                        <span className="font-medium">{option.text}</span>
                        <div className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Impact:</span>{" "}
                          {option.impact}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Submit Button */}
                <Button
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                  onClick={submitSustainPathChoice}
                  disabled={!selectedOption}
                >
                  Make Your Decision
                </Button>
              </div>
            ) : (
              // Results
              showResult && (
                <div className="space-y-4">
                  {(() => {
                    const selectedOptionData = getSelectedSustainPathOption();
                    const isCorrect = selectedOptionData?.isCorrect || false;
                    return (
                      <div
                        className={`p-6 rounded-lg border-2 ${
                          isCorrect
                            ? "border-success bg-success/10"
                            : "border-destructive bg-destructive/10"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          {isCorrect ? (
                            <Award className="h-6 w-6 text-success" />
                          ) : (
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                          )}
                          <h5 className="text-lg font-semibold">
                            {isCorrect ? "Right Choice!" : "Wrong Choice"}
                          </h5>
                        </div>

                        <div className="space-y-4">
                          <p className="text-muted-foreground">
                            {isCorrect
                              ? currentScenario.rightChoiceMessage
                              : currentScenario.wrongChoiceMessage}
                          </p>

                          {selectedOptionData && (
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="secondary"
                                className={
                                  isCorrect
                                    ? "bg-success/10 text-success"
                                    : "bg-destructive/10 text-destructive"
                                }
                              >
                                {isCorrect
                                  ? `+${selectedOptionData.points} points`
                                  : "0 points"}
                              </Badge>
                              <div className="text-sm text-muted-foreground">
                                Your choice: {selectedOptionData.text}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex gap-3">
                    <Button
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                      onClick={() => {
                        const roleScenarios = sustainPathScenarios.filter(
                          (scenario) => scenario.roleId === selectedRole.id
                        );
                        const currentIndex = roleScenarios.findIndex(
                          (scenario) => scenario.id === currentScenario.id
                        );
                        const nextScenario = roleScenarios[currentIndex + 1];
                        if (nextScenario) {
                          setCurrentScenario(nextScenario);
                          setSelectedOption(null);
                          setScenarioCompleted(false);
                          setShowResult(false);
                        } else {
                          resetSustainPath();
                        }
                      }}
                    >
                      {sustainPathScenarios.filter(
                        (scenario) => scenario.roleId === selectedRole.id
                      ).length > 1
                        ? "Next Scenario"
                        : "Try Different Role"}
                    </Button>
                    <Button
                      className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                      onClick={resetSustainPath}
                    >
                      Choose Different Role
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </Card>
      )}
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="card-eco">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Your Learning Journey
          </h3>
          <div className="text-sm text-muted-foreground">2 of 5 completed</div>
        </div>
        <div className="progress-eco mb-2">
          <div className="progress-fill" style={{ width: "40%" }} />
        </div>
        <p className="text-sm text-muted-foreground">
          Keep going! You're making great progress.
        </p>
      </Card>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card
            key={module.id}
            className={`card-eco relative ${
              module.locked ? "opacity-60" : "cursor-pointer"
            }`}
          >
            {/* Completion Badge */}
            {module.completed && (
              <div className="absolute -top-2 -right-2 bg-success rounded-full p-1">
                <CheckCircle className="h-4 w-4 text-success-foreground" />
              </div>
            )}

            {/* Module Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-primary/20 to-primary-glow/20 flex items-center justify-center">
                <module.icon className="h-8 w-8 text-primary animate-bounce-gentle" />
              </div>
            </div>

            {/* Module Info */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {module.description}
              </p>

              <div className="flex items-center justify-center gap-2 mb-3">
                <span className={getDifficultyColor(module.difficulty)}>
                  {module.difficulty}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {module.duration}
                </div>
              </div>

              <div className="flex items-center justify-center gap-1 text-sm font-semibold text-warning">
                <Star className="h-4 w-4 fill-current" />
                {module.points} points
              </div>
            </div>

            {/* Progress */}
            {module.progress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{module.progress}%</span>
                </div>
                <div className="progress-eco">
                  <div
                    className="progress-fill"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              className={`w-full ${module.completed ? "btn-eco" : "btn-earth"}`}
              disabled={module.locked}
              size="sm"
              onClick={() =>
                !module.locked && startLesson(module.id, module.title)
              }
            >
              {module.locked
                ? "🔒 Locked"
                : module.completed
                ? "Review"
                : module.progress > 0
                ? "Continue"
                : "Start Learning"}
            </Button>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="card-eco text-center bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <div className="py-6">
          <TreePine className="h-12 w-12 text-primary mx-auto mb-4 animate-float" />
          <h3 className="text-xl font-bold text-gradient-eco mb-2">
            Complete More Lessons!
          </h3>
          <p className="text-muted-foreground mb-4">
            Earn more eco-points and unlock advanced modules by completing your
            current lessons.
          </p>
          <Button className="btn-eco">Continue Learning</Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Learning Modules Title and Navigation - only on Modules tab */}
      {!currentLesson && activeTab === "modules" && (
        <div className="space-y-6">
          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gradient-eco mb-2">
              Learning Modules
            </h1>
            <p className="text-muted-foreground">
              Master environmental concepts through interactive lessons and earn
              eco-points!
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <div className="flex gap-2 bg-card/50 p-2 rounded-2xl backdrop-blur-sm max-w-full overflow-x-auto whitespace-nowrap">
              <Button
                variant={activeTab === "modules" ? "default" : "ghost"}
                className={`flex items-center gap-2 rounded-xl transition-all duration-200 shrink-0 text-sm px-3 py-1 sm:px-4 sm:py-2 ${
                  activeTab === "modules"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                    : "hover:bg-teal-50 hover:text-teal-600 hover:shadow-sm"
                }`}
                onClick={() => setActiveTab("modules")}
              >
                <BookOpen className="h-4 w-4" />
                Modules
              </Button>
              <Button
                variant={activeTab === "quizzes" ? "default" : "ghost"}
                className={`flex items-center gap-2 rounded-xl transition-all duration-200 shrink-0 text-sm px-3 py-1 sm:px-4 sm:py-2 ${
                  activeTab === "quizzes"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                    : "hover:bg-teal-50 hover:text-teal-600 hover:shadow-sm"
                }`}
                onClick={() => setActiveTab("quizzes")}
              >
                <Brain className="h-4 w-4" />
                Quizzes
              </Button>
              <Button
                variant={activeTab === "missions" ? "default" : "ghost"}
                className={`flex items-center gap-2 rounded-xl transition-all duration-200 shrink-0 text-sm px-3 py-1 sm:px-4 sm:py-2 ${
                  activeTab === "missions"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                    : "hover:bg-teal-50 hover:text-teal-600 hover:shadow-sm"
                }`}
                onClick={() => setActiveTab("missions")}
              >
                <Target className="h-4 w-4" />
                Missions
              </Button>
              <Button
                variant={activeTab === "stories" ? "default" : "ghost"}
                className={`flex items-center gap-2 rounded-xl transition-all duration-200 shrink-0 text-sm px-3 py-1 sm:px-4 sm:py-2 ${
                  activeTab === "stories"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                    : "hover:bg-teal-50 hover:text-teal-600 hover:shadow-sm"
                }`}
                onClick={() => setActiveTab("stories")}
              >
                <Users className="h-4 w-4" />
                Stories
              </Button>
              <Button
                variant={activeTab === "sustainpath" ? "default" : "ghost"}
                className={`flex items-center gap-2 rounded-xl transition-all duration-200 shrink-0 text-sm px-3 py-1 sm:px-4 sm:py-2 ${
                  activeTab === "sustainpath"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                    : "hover:bg-teal-50 hover:text-teal-600 hover:shadow-sm"
                }`}
                onClick={() => setActiveTab("sustainpath")}
              >
                <Crown className="h-4 w-4" />
                SustainPath
              </Button>
              <Button
                variant={activeTab === "battles" ? "default" : "ghost"}
                className={`flex items-center gap-2 rounded-xl transition-all duration-200 shrink-0 text-sm px-3 py-1 sm:px-4 sm:py-2 ${
                  activeTab === "battles"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                    : "hover:bg-teal-50 hover:text-teal-600 hover:shadow-sm"
                }`}
                onClick={() => setActiveTab("battles")}
              >
                <Trophy className="h-4 w-4" />
                Battles
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {currentLesson ? (
        <LearningLesson
          moduleId={currentLesson.moduleId}
          moduleTitle={currentLesson.moduleTitle}
          onBack={handleBackToModules}
          onComplete={handleLessonComplete}
        />
      ) : (
        <>{activeTab === "modules" && renderModules()}</>
      )}
      {/* Back to Learning Modules for non-modules tabs */}
      {!currentLesson && activeTab !== "modules" && (
        <div>
          <Button
            variant="outline"
            size="sm"
            className="mb-2"
            onClick={() => setActiveTab("modules")}
          >
            ← Back to Learning Modules
          </Button>
        </div>
      )}
      {!currentLesson && activeTab === "quizzes" && (
        <div className="space-y-6">
          {currentQuiz ? (
            renderQuiz()
          ) : (
            <div className="space-y-8">
              {/* Scenario-Based Quizzes Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gradient-eco mb-2">
                    Scenario-Based Quizzes
                  </h3>
                  <p className="text-muted-foreground">
                    Test your decision-making skills with real-life
                    environmental scenarios!
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {scenarioQuizzes.map((quiz) => (
                    <Card
                      key={quiz.id}
                      className="card-eco cursor-pointer hover:shadow-eco transition-all duration-200"
                      onClick={() => startQuiz(quiz)}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary/20 to-primary-glow/20 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{quiz.category}</h3>
                          <Badge variant="secondary" className="text-xs">
                            Scenario Quiz
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {quiz.question}
                      </p>
                      <Button className="w-full btn-eco" size="sm">
                        Start Quiz
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Knowledge Quizzes Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gradient-eco mb-2">
                    Knowledge Quizzes
                  </h3>
                  <p className="text-muted-foreground">
                    Test your environmental knowledge based on learning modules!
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {modules.map((module) => (
                    <Card
                      key={`quiz-${module.id}`}
                      className="card-eco cursor-pointer hover:shadow-eco transition-all duration-200"
                      onClick={() => {
                        // Create a quiz based on the module
                        const moduleQuiz: ScenarioQuiz = {
                          id: `module-quiz-${module.id}`,
                          question: `Test your knowledge about ${module.title.toLowerCase()}`,
                          options: generateModuleQuizOptions(module),
                          category: module.title,
                        };
                        startQuiz(moduleQuiz);
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary/20 to-primary-glow/20 flex items-center justify-center">
                          <module.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{module.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            Knowledge Quiz
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {module.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-sm font-semibold text-warning">
                          <Star className="h-4 w-4 fill-current" />
                          {module.points} points
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {module.duration}
                        </div>
                      </div>
                      <Button className="w-full btn-eco" size="sm">
                        Start Quiz
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {!currentLesson && activeTab === "missions" && renderMissions()}
      {!currentLesson && activeTab === "stories" && <EcoStories />}
      {!currentLesson && activeTab === "sustainpath" && renderSustainPath()}
      {!currentLesson && activeTab === "battles" && renderBattles()}
    </div>
  );
};

export default LearningModules;
