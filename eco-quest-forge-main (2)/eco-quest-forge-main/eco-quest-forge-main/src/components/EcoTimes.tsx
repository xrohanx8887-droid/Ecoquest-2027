import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useGreenCoins } from "@/hooks/useGreenCoins";
import { useAuth } from "@/contexts/AuthContext";
import {
  Newspaper,
  Globe,
  Flag,
  Leaf,
  Flame,
  CloudSun,
  Waves,
  Mountain,
  Wind,
  CircleHelp,
  Award,
  ChevronLeft,
  BookOpen,
} from "lucide-react";

type Category = "world" | "national";

interface EcoNewsItem {
  id: string;
  category: Category;
  headline: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
  image?: string;
  reflection?: string;
  preventionTips?: string[];
  stats?: {
    lossCrores?: number; // in INR crores
    affected?: number; // people affected
    deaths?: number; // deaths
  };
  blog?: string; // short news-style article for the detail page
  date?: string;
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const DEMO_NEWS: EcoNewsItem[] = [
  {
    id: "floods",
    category: "national",
    headline: "Floods in Kerala (2023)",
    summary:
      "Kerala faced devastating floods, worsened by deforestation in the Western Ghats.",
    icon: Waves,
    image: "/keralaflood2.png",
    reflection:
      "What could have prevented this? Stronger forest cover and sustainable land use could have reduced the flooding impact.",
    preventionTips: [
      "Protect and restore forests in sensitive hill regions",
      "Use contour bunds and rainwater harvesting",
      "Stop construction on natural drainage paths",
    ],
    stats: {
      lossCrores: 31000,
      affected: 1500000,
      deaths: 483,
    },
    blog: "In August 2023, unusually intense monsoon spells triggered flash floods across parts of Kerala. Experts say rampant construction on floodplains and loss of tree cover in the Western Ghats reduced nature’s ability to soak up rain. Broken drainage channels and blocked wetlands pushed water into towns and villages, damaging homes, roads, and farmland.",
    quiz: {
      question:
        "Which natural feature acts as a sponge, reducing flood impact?",
      options: [
        "Forests 🌳",
        "Highways 🛣",
        "Glass buildings 🏢",
        "Plastic sheets 🛍",
      ],
      correctIndex: 0,
      explanation: "Forests absorb rainwater, slow runoff and reduce flooding.",
    },
  },
  {
    id: "landslides",
    category: "national",
    headline: "Himachal Landslides",
    summary:
      "Recent landslides destroyed homes; unplanned road cutting weakened slopes.",
    icon: Mountain,
    image: "/HPlandslide.png",
    reflection:
      "What could have prevented this? Slope terracing and careful planning reduce landslide risks.",
    preventionTips: [
      "Use slope terracing and bioengineering",
      "Avoid removing hillside vegetation",
      "Stabilize cut slopes with retaining structures",
    ],
    stats: {
      lossCrores: 10000,
      affected: 15000,
      deaths: 48,
    },
    blog: "Unplanned road cuts and hill construction in parts of Himachal Pradesh loosened soil layers. During heavy rain, weak slopes gave way, causing landslides that destroyed homes and blocked roads. Safer engineering designs and protecting hillside vegetation can make mountain communities more resilient.",
    quiz: {
      question:
        "Which sustainable construction practice reduces landslide risks?",
      options: [
        "Slope terracing 🌱",
        "Removing vegetation 🌿",
        "Building tunnels 🚇",
        "Spraying chemicals 🧪",
      ],
      correctIndex: 0,
      explanation:
        "Terracing and bioengineering stabilize slopes while keeping ecosystems healthy.",
    },
  },
  {
    id: "air",
    category: "national",
    headline: "Delhi Air Pollution",
    summary:
      "Delhi recorded hazardous AQI due to crop burning and vehicle emissions.",
    icon: Wind,
    image: "/delhi.png",
    reflection:
      "What could have prevented this? Cleaner transport and reduced crop burning can improve air quality.",
    preventionTips: [
      "Use public transport and cycles",
      "Promote Happy Seeder instead of burning stubble",
      "Strict industrial emission control",
    ],
    stats: {
      lossCrores: 100,
      affected: 1800000,
      deaths: 89,
    },
    blog: "Each winter, Delhi’s air worsens as farm stubble burning combines with traffic emissions and cool, still air. Tiny PM2.5 particles enter lungs and blood, raising health risks. Solutions include cleaner buses, cycling infrastructure, and helping farmers manage residues without burning.",
    quiz: {
      question:
        "Which practice can directly help reduce Delhi’s air pollution?",
      options: [
        "Using bicycles/public transport 🚲",
        "Burning more crops 🔥",
        "Building more factories 🏭",
        "Buying extra cars 🚗",
      ],
      correctIndex: 0,
      explanation:
        "Active transport and public transit reduce vehicle emissions immediately.",
    },
  },
  {
    id: "heatwaves",
    category: "national",
    headline: "Heatwaves in North India",
    summary:
      "Extreme temperatures and fewer trees made cities hotter due to heat islands.",
    icon: CloudSun,
    image: "/heatwave.png",
    reflection:
      "What could have prevented this? Planting shade trees and increasing green cover cools cities.",
    preventionTips: [
      "Plant dense, native shade trees",
      "Cool roofs and reflective pavements",
      "Create urban parks and water bodies",
    ],
    stats: {
      lossCrores: 100,
      affected: 10000000,
      deaths: 2000,
    },
    blog: "Heatwaves are growing longer and hotter. In dense cities, dark roads and rooftops trap heat, making neighborhoods several degrees warmer than nearby green areas. Expanding tree cover and reflective, cooler materials can lower temperatures and protect people and wildlife.",
    quiz: {
      question:
        "Planting which type of trees helps reduce heat island effect in cities?",
      options: [
        "Dense shade trees 🌳",
        "Shrubs only 🌱",
        "Cactus 🌵",
        "None of the above ❌",
      ],
      correctIndex: 0,
      explanation:
        "Broad-canopy shade trees lower surface temps and make streets walkable.",
    },
  },
  {
    id: "amazon",
    category: "world",
    headline: "Amazon Wildfires (2022)",
    summary:
      "Massive wildfires destroyed forests, harming biodiversity and climate.",
    icon: Leaf,
    image: "/Amazonfire.png",
    reflection:
      "What could have prevented this? Protecting forests and stopping illegal logging reduces fire risk.",
    preventionTips: [
      "Strong protection for primary forests",
      "End slash-and-burn; use sustainable farming",
      "Support indigenous guardians and monitoring",
    ],
    stats: {
      lossCrores: 10000,
      affected: 10000,
      deaths: 200,
    },
    blog: "Massive wildfires, worsened by deforestation and drought, released huge amounts of carbon and destroyed habitats. Protecting primary forests and backing community-led monitoring are key to prevention.",
    quiz: {
      question: "Why is the Amazon called the 'lungs of the Earth'?",
      options: [
        "It produces a large amount of the world's oxygen 🌱",
        "It absorbs industrial smoke 🏭",
        "It has many rivers 🏞",
        "It provides timber 🪵",
      ],
      correctIndex: 0,
      explanation:
        "Vast forests cycle carbon and generate oxygen, supporting global climate.",
    },
  },
  {
    id: "plastic",
    category: "world",
    headline: "Whale & Plastic Bags",
    summary:
      "A whale died with 80+ plastic bags in its stomach. Choose better bags!",
    icon: Leaf,
    image: "/whale.png",
    reflection:
      "What could have prevented this? Switching to reusable bags and cutting plastic waste.",
    preventionTips: [
      "Carry cotton/jute reusable bags",
      "Avoid single-use plastics",
      "Support cleanup and proper waste sorting",
    ],
    blog: "When plastic bags reach the ocean, animals mistake them for food. In one tragic case, a whale in Thailand was found with dozens of bags in its stomach. Choosing durable, reusable bags and improving waste collection keeps plastics out of rivers and seas.",
    quiz: {
      question:
        "What’s the best sustainable alternative to single-use plastic bags?",
      options: [
        "Cotton/Jute bags 👜",
        "Paper bags 📄",
        "Biodegradable plastic 🌿",
        "All of the above",
      ],
      correctIndex: 3,
      explanation:
        "All are better than single-use plastic; reusables like jute last longest.",
    },
  },
  {
    id: "un-stocktake",
    category: "world",
    headline: "UN Climate Action: Global Stocktake",
    summary:
      "Countries reviewed progress on Paris goals and urged deeper cuts this decade.",
    icon: Globe,
    image: "/UN.png",
    date: "2023",
    author: { name: "UNFCCC Desk", role: "Climate News" },
    blog: "At the UN climate process, the first Global Stocktake assessed how far the world is from the 1.5°C target. Findings show emissions must fall rapidly before 2030. The process pushes countries to strengthen their next NDCs and scale finance for clean energy and adaptation.",
    quiz: {
      question: "What is the core purpose of the Global Stocktake?",
      options: [
        "Check progress and ramp up climate ambition",
        "Price carbon for all countries",
        "Ban fossil fuels immediately",
        "Create a new treaty",
      ],
      correctIndex: 0,
      explanation:
        "The Stocktake measures progress and informs stronger national pledges (NDCs).",
    },
  },
  {
    id: "paris-withdrawal",
    category: "world",
    headline: "US Withdrawal from Paris Agreement (2017)",
    summary:
      "The US under President Trump announced withdrawal, later rejoined in 2021.",
    icon: Globe,
    image: "/trump.png",
    date: "2017",
    author: { name: "Global Policy Desk", role: "Climate Policy" },
    blog: "In 2017, the US signaled intent to leave the Paris Agreement, citing economic concerns. The move slowed cooperation but also spurred states and companies to act independently. In 2021, the US rejoined, reaffirming commitment to cut emissions and fund climate action.",
    quiz: {
      question: "What is a key goal of the Paris Agreement?",
      options: [
        "Limit warming well below 2°C",
        "Eliminate all cars by 2025",
        "Close all coal plants in one year",
        "Set one global carbon price",
      ],
      correctIndex: 0,
      explanation:
        "Paris sets a temperature goal of well below 2°C, aiming for 1.5°C.",
    },
  },
];

const CATEGORY_TABS: {
  id: Category;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "world", label: "Worldwide", icon: Globe },
  { id: "national", label: "National", icon: Flag },
];

const EcoTimes = () => {
  const { toast } = useToast();
  const { earnCoins } = useGreenCoins();
  const { user } = useAuth();

  const [activeCategory, setActiveCategory] = useState<Category>("world");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const storageKey = useMemo(
    () => `ecotimes_completed_${user?.id ?? "guest"}`,
    [user?.id]
  );
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCompletedIds(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedIds));
    } catch {}
  }, [completedIds, storageKey]);

  const filtered = DEMO_NEWS.filter((n) => n.category === activeCategory);

  const markCompleted = (id: string) => {
    if (!completedIds.includes(id)) {
      setCompletedIds((prev) => [...prev, id]);
    }
  };

  const handleAnswer = (item: EcoNewsItem, index: number) => {
    const isCorrect = index === item.quiz.correctIndex;
    if (isCorrect) {
      earnCoins(20, `EcoTimes quiz: ${item.headline}`);
      toast({
        title: "Great job! ✅",
        description:
          "You earned +20 GreenCoins. You're learning how real-world problems can be prevented.",
      });
    } else {
      toast({
        title: "Nice try!",
        description: item.quiz.explanation,
        variant: "default",
      });
    }
    markCompleted(item.id);
  };

  const completedCount = completedIds.length;

  return (
    <div className="space-y-6 bg-gradient-to-b from-emerald-50/50 to-cyan-50/40 rounded-2xl p-2 md:p-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          EcoTimes: EcoNews Challenges
        </h2>
        <p className="text-muted-foreground">
          Short, visual eco-news with one quick quiz. Learn, play, and climb the
          leaderboard!
        </p>
        <div className="mt-3 text-sm text-cyan-700/80 bg-cyan-50 inline-flex px-3 py-1 rounded-full">
          You answered {completedCount}/5 EcoNews Quizzes this week keep it
          up!
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center">
        <div className="flex gap-2 bg-card/50 p-2 rounded-2xl backdrop-blur-sm">
          {CATEGORY_TABS.map((t) => (
            <Button
              key={t.id}
              variant={activeCategory === t.id ? "default" : "ghost"}
              className={`flex items-center gap-2 rounded-xl transition-all duration-200 ${
                activeCategory === t.id
                  ? "bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg"
                  : "hover:bg-cyan-50 hover:text-cyan-700"
              }`}
              onClick={() => setActiveCategory(t.id)}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Cards list view */}
      {!selectedId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="group p-0 bg-gradient-to-br from-cyan-50 to-emerald-50 overflow-hidden rounded-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {item.image ? (
                <AspectRatio ratio={16 / 9} className="w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.headline}
                    loading="lazy"
                    className="h-full w-full object-cover object-center block transition-transform duration-300 group-hover:scale-105"
                  />
                </AspectRatio>
              ) : (
                <div className="h-40 w-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center">
                  <item.icon className="h-10 w-10 text-cyan-700" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                  <div className="uppercase tracking-wide">
                    {item.category === "world" ? "World" : "National"}
                  </div>
                  <div>{item.date ?? ""}</div>
                </div>
                <div className="mt-1 flex items-start justify-between">
                  <h3 className="text-xl md:text-2xl font-bold text-cyan-800 pr-2">
                    {item.headline}
                  </h3>
                  {completedIds.includes(item.id) && (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700"
                    >
                      Completed
                    </Badge>
                  )}
                </div>
                <p className="text-base md:text-lg text-muted-foreground mt-1 line-clamp-3">
                  {item.summary}
                </p>
                {item.author && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={item.author.avatar || undefined} />
                      <AvatarFallback>
                        {(item.author.name || "A").slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {item.author.name}
                      </div>
                      <div>{item.author.role}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-5 pb-5">
                <Button
                  className="btn-eco"
                  onClick={() => setSelectedId(item.id)}
                >
                  Learn & Quiz
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail + Quiz view */}
      {selectedId && (
        <div className="space-y-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => setSelectedId(null)}
          >
            <ChevronLeft className="h-4 w-4" /> Back to EcoNews
          </Button>
          {(() => {
            const item = DEMO_NEWS.find((n) => n.id === selectedId)!;
            return (
              <Card className="p-0 bg-gradient-to-br from-cyan-50 to-emerald-50 overflow-hidden rounded-xl">
                {item.image ? (
                  <AspectRatio
                    ratio={32 / 9}
                    className="w-full overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.headline}
                      loading="lazy"
                      className="h-full w-full object-cover object-center block"
                    />
                  </AspectRatio>
                ) : null}
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white shadow">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-cyan-800">
                        {item.headline}
                      </h3>
                      <p className="text-base md:text-lg text-muted-foreground mt-1">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  {item.blog && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {item.blog}
                    </div>
                  )}

                  {item.stats && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {item.stats.lossCrores != null && (
                        <div className="rounded-lg bg-white/70 border p-3 text-center">
                          <div className="text-xs text-muted-foreground">
                            Estimated Loss
                          </div>
                          <div className="text-lg font-bold text-cyan-800">
                            ₹{item.stats.lossCrores.toLocaleString()} Cr
                          </div>
                        </div>
                      )}
                      {item.stats.affected != null && (
                        <div className="rounded-lg bg-white/70 border p-3 text-center">
                          <div className="text-xs text-muted-foreground">
                            People Affected
                          </div>
                          <div className="text-lg font-bold text-cyan-800">
                            {item.stats.affected.toLocaleString()}
                          </div>
                        </div>
                      )}
                      {item.stats.deaths != null && (
                        <div className="rounded-lg bg-white/70 border p-3 text-center">
                          <div className="text-xs text-muted-foreground">
                            Deaths
                          </div>
                          <div className="text-lg font-bold text-cyan-800">
                            {item.stats.deaths.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {item.reflection && (
                    <div className="mt-4 p-4 rounded-lg bg-white/60 border">
                      <div className="flex items-center gap-2 font-semibold text-cyan-800">
                        <BookOpen className="h-4 w-4" /> Reflection
                      </div>
                      <div className="text-sm mt-2">{item.reflection}</div>
                    </div>
                  )}

                  {item.preventionTips && (
                    <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                      <div className="font-semibold text-emerald-800 mb-2">
                        Prevention Tips
                      </div>
                      <ul className="list-disc list-inside text-sm text-emerald-800">
                        {item.preventionTips.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div>
                    <div className="font-semibold mb-2 text-cyan-800">
                      Quick Quiz
                    </div>
                    <div className="text-sm mb-3">{item.quiz.question}</div>
                    <div className="grid gap-2">
                      {item.quiz.options.map((opt, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className="justify-start"
                          onClick={() => handleAnswer(item, idx)}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default EcoTimes;
