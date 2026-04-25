import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Leaf,
  Trophy,
  BookOpen,
  Target,
  Calendar,
  Calculator,
  Camera,
  Crown,
  Coins,
  User,
  ArrowRight,
  Users,
  Flame,
  Link as LinkIcon,
  LogOut,
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  Star,
  Newspaper,
  Menu,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LearningModules from "@/components/LearningModules";
import EcoProgress from "@/components/EcoProgress";
import AchievementBadges from "@/components/AchievementBadges";
import Leaderboard from "@/components/Leaderboard";
import EcoActivityHeatmap from "@/components/EcoActivityHeatmap";
import EcoJournal from "@/components/EcoJournal";
import CarbonCalculator from "@/components/CarbonCalculator";
import PeerValidation from "@/components/PeerValidation";
import EcoChampWeek from "@/components/EcoChampWeek";
import SchoolRecognition from "@/components/SchoolRecognition";
import StudentProfile from "@/components/StudentProfile";
import GreenCoinsWallet from "@/components/GreenCoinsWallet";
import CommunityWall from "@/components/CommunityWall";
import CompeteSection from "@/components/CompeteSection";
import CommunityDrives from "@/components/CommunityDrives";
import EcoTimes from "@/components/EcoTimes";
import EcoAlerts from "@/components/EcoAlerts";
import { toast } from "@/components/ui/sonner";
import {
  getLinkedDrivesByAlert,
  type LinkedDriveInfo,
  type OrganizeDrivePayload,
} from "@/lib/alertToDrive";
import { useGreenCoins } from "@/hooks/useGreenCoins";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [ecoPoints, setEcoPoints] = useState(1247);
  const { balance: ecoCoins, earnCoins } = useGreenCoins();
  const { user, logout } = useAuth();
  const [streak, setStreak] = useState(12);
  const [showProfile, setShowProfile] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [convertAmount, setConvertAmount] = useState(100);
  const referralCode = `ECO${(user?.id || "123").toString().padStart(3, "0")}`;
  const [totalReferrals, setTotalReferrals] = useState(7);
  const [referralStreakDays, setReferralStreakDays] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [organizeDrivePayload, setOrganizeDrivePayload] =
    useState<OrganizeDrivePayload | null>(null);
  const [linkedDriveByAlert, setLinkedDriveByAlert] = useState<
    Record<string, LinkedDriveInfo>
  >(() => getLinkedDrivesByAlert());

  const refreshLinkedDrives = useCallback(() => {
    setLinkedDriveByAlert(getLinkedDrivesByAlert());
  }, []);

  const handleOrganizeCommunityDrive = useCallback(
    (payload: OrganizeDrivePayload) => {
      setOrganizeDrivePayload(payload);
      setActiveTab("community-drives");
    },
    []
  );

  const consumeOrganizePayload = useCallback(() => {
    setOrganizeDrivePayload(null);
  }, []);

  const [displayReferrals, setDisplayReferrals] = useState(totalReferrals);
  useEffect(() => {
    if (displayReferrals === totalReferrals) return;
    const step = totalReferrals > displayReferrals ? 1 : -1;
    const timer = setInterval(() => {
      setDisplayReferrals((prev) => {
        const next = prev + step;
        if (
          (step > 0 && next >= totalReferrals) ||
          (step < 0 && next <= totalReferrals)
        ) {
          clearInterval(timer);
          return totalReferrals;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [totalReferrals, displayReferrals]);

  // Timed AQI notifications: first at 1 min, then every 5 mins
  useEffect(() => {
    const showAQINotification = () => {
      toast("AQI Alert: Hazardous smog in Delhi & Punjab", {
        description:
          "Warning: Air quality is at dangerous levels. Limit outdoor activity and wear a mask.",
        action: {
          label: "View Alerts",
          onClick: () => setActiveTab("alerts"),
        },
      });
    };

    const firstTimeout = window.setTimeout(showAQINotification, 60 * 1000);
    const intervalId = window.setInterval(showAQINotification, 1 * 60 * 1000);

    return () => {
      window.clearTimeout(firstTimeout);
      window.clearInterval(intervalId);
    };
  }, []);

  const motivationalMessage = useMemo(() => {
    const n = totalReferrals;
    const options = [
      `Together with you, ${n} people are now fighting climate change `,
      `Every friend you invite makes Earth a little greener `,
      `Your green squad is growing  you’re leading the change `,
    ];
    return options[n % options.length];
  }, [totalReferrals]);

  const referralGoal = 10;
  const referralPercent = useMemo(
    () =>
      Math.min(
        100,
        Math.round(
          (Math.min(totalReferrals, referralGoal) / referralGoal) * 100
        )
      ),
    [totalReferrals]
  );

  const handleConvertPoints = () => {
    if (convertAmount <= ecoPoints && convertAmount > 0) {
      // Convert points to coins (5 points = 1 coin)
      const coinsToAdd = Math.floor(convertAmount / 5);
      setEcoPoints(ecoPoints - convertAmount);
      earnCoins(coinsToAdd, `Converted ${convertAmount} points to GreenCoins`);
      setShowConvertDialog(false);
      setConvertAmount(100);
    }
  };

  const tabConfig = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Target,
      animation: "animate-ping",
    },
    { id: "learn", label: "Learn", icon: BookOpen, animation: "animate-float" },
    {
      id: "ecotimes",
      label: "EcoTimes",
      icon: Newspaper,
      animation: "animate-wiggle",
    },
    {
      id: "validation",
      label: "Share",
      icon: Camera,
      animation: "animate-sparkle",
    },
    {
      id: "community-drives",
      label: "Community Drives",
      icon: Users,
      animation: "animate-pulse",
    },
    {
      id: "wallet",
      label: "Wallet & Store",
      icon: Coins,
      animation: "animate-coin-sparkle",
    },
    {
      id: "compete",
      label: "Compete",
      icon: Trophy,
      animation: "animate-pulse",
    },
    {
      id: "journal",
      label: "Journal",
      icon: Calendar,
      animation: "animate-breathe",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "alerts":
        return (
          <EcoAlerts
            onOrganizeCommunityDrive={handleOrganizeCommunityDrive}
            linkedDriveByAlert={linkedDriveByAlert}
          />
        );
      case "learn":
        return <LearningModules />;
      case "ecotimes":
        return <EcoTimes />;
      case "validation":
        return <PeerValidation />;
      case "community-drives":
        return (
          <CommunityDrives
            organizeDrivePayload={organizeDrivePayload}
            onConsumeOrganizePayload={consumeOrganizePayload}
            onDriveLinkedToAlert={refreshLinkedDrives}
          />
        );
      case "wallet":
        return <GreenCoinsWallet />;
      case "compete":
        return <CompeteSection />;
      case "journal":
        return <EcoJournal />;
      default:
        return (
          <div className="space-y-6">
            {/* Enhanced Hero Stats for Student Appeal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card-fun text-center hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-8 w-8 text-fun-blue animate-sparkle" />
                </div>
                <h3 className="text-2xl font-bold text-gradient-fun">
                  {ecoPoints}
                </h3>
                <p className="text-muted-foreground font-medium">
                  Eco Points 🌟
                </p>
                <div className="mt-2 text-xs text-fun-blue animate-pulse">
                  Keep going! +25 points today
                </div>
              </Card>

              <Card className="card-energy text-center hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="h-8 w-8 text-fun-orange animate-wiggle" />
                </div>
                <h3 className="text-2xl font-bold text-gradient-energy">
                  {streak} days
                </h3>
                <p className="text-muted-foreground font-medium">
                  Fire Streak 🔥
                </p>
                <div className="mt-2 text-xs text-fun-orange animate-pulse">
                  Amazing! Keep the momentum
                </div>
              </Card>

              <Card className="card-magic text-center hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="h-8 w-8 text-fun-purple animate-float" />
                </div>
                <h3 className="text-2xl font-bold text-gradient-magic">#3</h3>
                <p className="text-muted-foreground font-medium">
                  Class Rank 🏆
                </p>
                <div className="mt-2 text-xs text-fun-purple animate-pulse">
                  Rising star! Almost #2
                </div>
              </Card>
            </div>

            {/* Progress Overview */}
            <EcoProgress />

            {/* Eco Activity Heatmap */}
            <EcoActivityHeatmap />

            {/* Enhanced Green Network Section */}
            <Card
              className={`card-fun bg-gradient-to-br ${
                totalReferrals >= 10
                  ? "from-fun-purple/10 to-fun-pink/15"
                  : totalReferrals >= 5
                  ? "from-fun-blue/10 to-fun-purple/15"
                  : "from-primary-light/20 to-primary/10"
              } border-2 ${
                totalReferrals >= 10
                  ? "border-fun-purple/30"
                  : totalReferrals >= 5
                  ? "border-fun-blue/30"
                  : "border-primary/20"
              }`}
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Your Green Network 🌍
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1 flex items-center justify-center">
                    <div className="w-full px-4">
                      <div className="text-xs text-muted-foreground mb-1">
                        Growth to next milestone
                      </div>
                      <div className="h-5 rounded-full bg-emerald-100/60 overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width] duration-700 ease-out relative"
                          style={{ width: `${referralPercent}%` }}
                        >
                          <div className="absolute inset-y-0 right-1 flex items-center gap-1 pr-1">
                            {Array.from({
                              length: Math.max(
                                1,
                                Math.min(4, Math.ceil(referralPercent / 25))
                              ),
                            }).map((_, i) => (
                              <span
                                key={i}
                                className="text-[10px] animate-pulse"
                              >
                                🌱
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>
                          Milestone:{" "}
                          {totalReferrals >= 10
                            ? " Planet Protector"
                            : totalReferrals >= 5
                            ? " Tree Grower"
                            : totalReferrals >= 1
                            ? " Seed Planter"
                            : "—"}
                        </span>
                        <span>
                          {totalReferrals}/{referralGoal} invites
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1 text-[11px]">
                        {[
                          [1, "Seed Planter", "🌱"],
                          [5, "Tree Grower", "🌳"],
                          [10, "Planet Protector", "🌍"],
                        ].map(([c, l, i]) => (
                          <span
                            key={c as number}
                            className={`px-2 py-1 rounded-full border ${
                              totalReferrals >= (c as number)
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-muted/30 text-muted-foreground border-transparent"
                            }`}
                          >
                            {i as string} {l as string}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <div className="text-2xl font-bold text-gradient-rainbow animate-pulse">
                      {displayReferrals} New Eco-Warriors Joined Through You
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {motivationalMessage}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Together, you've saved{" "}
                      <span className="font-semibold text-gradient-water">
                        {totalReferrals * 2} kg
                      </span>{" "}
                      of CO₂ 🌍
                    </div>
                    <div className="text-xs text-muted-foreground">{`You're ahead of 85% of students in your school`}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      <span>
                        {referralStreakDays}-day referral streak, keep it going!
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Rewards:</span>
                      <span>
                        Inviter{" "}
                        <span className="font-semibold text-gradient-eco">
                          +20
                        </span>{" "}
                        GreenCoins
                      </span>
                      <span>•</span>
                      <span>
                        Invitee{" "}
                        <span className="font-semibold text-gradient-water">
                          +10
                        </span>{" "}
                        GreenCoins
                      </span>
                    </div>
                    <div>
                      <Button
                        className="btn-eco mt-2 flex items-center gap-2"
                        onClick={async () => {
                          const shareText = `Join me on EcoQuest! Use my referral code ${referralCode} to sign up. I earn +20 GreenCoins and you get +10! 🌍`;
                          try {
                            if (navigator.share) {
                              await navigator.share({
                                title: "EcoQuest Referral",
                                text: shareText,
                              });
                              return;
                            }
                          } catch {}
                          try {
                            await navigator.clipboard.writeText(shareText);
                          } catch {}
                        }}
                      >
                        <LinkIcon className="h-4 w-4" /> Invite More Friends
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      You're #4 this week — just 2 more invites to reach Top 3
                      🏆
                    </div>
                    {totalReferrals >= 10 && (
                      <div className="mt-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
                        <div className="text-sm font-semibold">
                          Congrats! You’ve built a Green Network of 10 members
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Share this achievement on WhatsApp/Instagram
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="btn-eco"
                            onClick={async () => {
                              const text =
                                "I just became a Planet Protector on EcoQuest with 10 referrals! Join me 🌱";
                              try {
                                if (navigator.share) {
                                  await navigator.share({
                                    title: "EcoQuest Milestone",
                                    text,
                                  });
                                  return;
                                }
                              } catch {}
                              try {
                                await navigator.clipboard.writeText(text);
                              } catch {}
                            }}
                          >
                            Share Achievement
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <AchievementBadges />

            {/* Enhanced Quick Actions */}
            <Card className="card-magic">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gradient-magic">
                <Leaf className="h-5 w-5 text-fun-purple animate-wiggle" />
                Today's Eco Actions 🚀
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button className="btn-fun justify-start h-auto py-4 px-6 group">
                  <div className="text-left">
                    <div className="font-semibold">🌱 Plant a Tree</div>
                    <div className="text-xs opacity-80">
                      +50 points • Super eco!
                    </div>
                  </div>
                  <div className="ml-auto text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                    🌟
                  </div>
                </Button>
                <Button className="btn-energy justify-start h-auto py-4 px-6 group">
                  <div className="text-left">
                    <div className="font-semibold">♻️ Recycle Waste</div>
                    <div className="text-xs opacity-80">
                      +30 points • Easy win!
                    </div>
                  </div>
                  <div className="ml-auto text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                    ⚡
                  </div>
                </Button>
                <Button className="btn-magic justify-start h-auto py-4 px-6 group">
                  <div className="text-left">
                    <div className="font-semibold">💧 Water Conservation</div>
                    <div className="text-xs opacity-80">
                      +25 points • Save drops!
                    </div>
                  </div>
                  <div className="ml-auto text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                    ✨
                  </div>
                </Button>
                <Button className="btn-eco justify-start h-auto py-4 px-6 group">
                  <div className="text-left">
                    <div className="font-semibold">⚡ Energy Saving</div>
                    <div className="text-xs opacity-80">
                      +40 points • Power move!
                    </div>
                  </div>
                  <div className="ml-auto text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                    🔥
                  </div>
                </Button>
              </div>
            </Card>
          </div>
        );
    }
  };

  // Responsive: show sidebar on mobile, horizontal nav on desktop
  return (
    <div className="min-h-screen relative">
      {/* Ultra-colorful and attractive background with multiple effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Main colorful eco gradient */}
        <div className="w-full h-full bg-gradient-to-br from-fun-blue/12 via-primary-light/15 to-fun-purple/12 absolute inset-0" />
        {/* Additional colorful overlay */}
        <div className="w-full h-full bg-gradient-to-tr from-fun-pink/8 via-fun-orange/10 to-accent/8 absolute inset-0" />

        {/* Large decorative eco shapes */}
        <div className="absolute top-[-140px] left-[-140px] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-fun-blue/25 via-primary/20 to-transparent opacity-65 blur-3xl animate-drift" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-fun-purple/25 via-accent/20 to-transparent opacity-55 blur-3xl animate-swirl" />
        <div className="absolute top-[35%] left-[-90px] w-[250px] h-[250px] rounded-full bg-gradient-to-br from-fun-orange/20 via-warning/15 to-transparent opacity-45 blur-3xl animate-breathe" />
        <div className="absolute bottom-[18%] left-[8%] w-[140px] h-[140px] rounded-full bg-gradient-to-br from-fun-pink/20 via-fun-purple/15 to-transparent opacity-35 blur-3xl animate-morph" />

        {/* Medium floating elements */}
        <div className="absolute top-[20%] right-[5%] w-[180px] h-[180px] rounded-full bg-gradient-to-br from-fun-blue/18 via-primary/15 to-transparent opacity-50 blur-2xl animate-ripple" />
        <div className="absolute bottom-[50%] right-[12%] w-[130px] h-[130px] rounded-full bg-gradient-to-br from-fun-pink/20 via-accent/15 to-transparent opacity-55 blur-2xl animate-drift" />
        <div className="absolute top-[70%] left-[25%] w-[100px] h-[100px] rounded-full bg-gradient-to-br from-fun-orange/18 via-warning/12 to-transparent opacity-50 blur-2xl animate-breathe" />

        {/* Enhanced conic and radial glows */}
        <div className="absolute -top-20 right-[-70px] h-[480px] w-[480px] rounded-full opacity-45 blur-3xl bg-[conic-gradient(at_top_right,theme(colors.fun-blue.300)_0%,theme(colors.fun-purple.300)_25%,theme(colors.accent.300)_50%,theme(colors.fun-orange.300)_75%,transparent_80%)]" />
        <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.18),transparent_65%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.15),transparent_60%)]" />

        {/* Small accent orbs */}
        <div className="absolute top-[55%] left-[35%] w-[90px] h-[90px] rounded-full bg-gradient-to-br from-fun-pink/15 to-fun-purple/10 opacity-50 blur-xl animate-float" />
        <div className="absolute bottom-[25%] right-[18%] w-[70px] h-[70px] rounded-full bg-gradient-to-br from-fun-orange/18 to-warning/12 opacity-55 blur-lg animate-sparkle" />
        <div className="absolute top-[80%] right-[35%] w-[85px] h-[85px] rounded-full bg-gradient-to-br from-fun-blue/16 to-primary/12 opacity-50 blur-lg animate-pulse-slow" />

        {/* Subtle wave patterns */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-[25%] left-[15%] w-[280px] h-[90px] bg-gradient-to-r from-transparent via-fun-blue/6 to-transparent rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-[25%] right-[25%] w-[230px] h-[70px] bg-gradient-to-r from-transparent via-fun-purple/7 to-transparent rounded-full blur-2xl animate-pulse-slower" />
          <div className="absolute top-[55%] left-[55%] w-[180px] h-[50px] bg-gradient-to-r from-transparent via-fun-orange/6 to-transparent rounded-full blur-2xl animate-wiggle" />
        </div>
      </div>
      {/* Enhanced Header */}
      <header className="border-b border-fun-blue/20 bg-white/40 bg-gradient-to-r from-fun-blue-10 via-white/60 to-fun-purple-10 backdrop-blur-lg sticky top-0 z-50 shadow-fun">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden mr-2 p-2 rounded-full hover:bg-muted/50 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <img
                src="/ecoquest-logo.png"
                alt="EcoQuest"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
              />
            </div>
          </div>
          {/* ...points, coins, profile button... */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="badge-fun text-[10px] sm:text-xs px-2 py-1 animate-pulse">
                {ecoPoints} <span className="hidden xs:inline">Points</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConvertDialog(true)}
                className="h-6 w-6 p-0 hover:bg-primary/50 rounded-full"
                title="Convert Points to GreenCoins"
              >
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <div
              className="badge-energy flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform text-[10px] sm:text-xs px-2 py-1 animate-wiggle"
              onClick={() => setActiveTab("wallet")}
            >
              <Coins className="h-3 w-3" />
              {ecoCoins} <span className="hidden sm:inline">GreenCoins</span> 💰
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("alerts")}
              className="flex items-center gap-1 hover:bg-red-50 rounded-full px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300"
              title="Eco-Alerts - 4 Active Alerts"
            >
              <AlertTriangle className="h-3 w-3" />
              <span className="hidden sm:inline">Alerts</span>
              <Badge
                variant="destructive"
                className="ml-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
              >
                4
              </Badge>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 hover:bg-cyan-100 hover:text-cyan-700 rounded-full p-2 transition-colors duration-200"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">
                Profile
              </span>
            </Button>
          </div>
        </div>
      </header>
      {/* Sidebar Drawer for mobile */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 md:hidden ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      >
        <nav
          className={`fixed top-0 left-0 h-full w-72 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Profile summary */}
          <div className="p-6 border-b border-muted flex flex-col items-center gap-2 bg-gradient-to-br from-fun-blue/10 to-fun-purple/15">
            <Avatar className="h-16 w-16 mb-2 ring-4 ring-fun-purple/30 animate-pulse">
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-fun-blue to-fun-purple text-white">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-lg font-bold text-gradient-rainbow">
              {user?.name || "Student"}
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {user?.email || "student@ecolearn.com"}
            </div>
            <div className="flex gap-2 text-xs">
              <span className="bg-fun-blue/20 text-fun-blue px-2 py-1 rounded-full font-semibold">
                {ecoPoints} pts ⭐
              </span>
              <span className="bg-fun-orange/20 text-fun-orange px-2 py-1 rounded-full flex items-center gap-1 font-semibold">
                <Coins className="h-3 w-3" />
                {ecoCoins} 💰
              </span>
            </div>
            <button
              className="mt-2 text-sm text-fun-purple underline hover:opacity-80 font-semibold hover:text-fun-blue transition-colors"
              onClick={() => {
                setShowProfile(true);
                setSidebarOpen(false);
              }}
            >
              View Profile ✨
            </button>
          </div>
          {/* Nav links */}
          <div className="flex flex-col gap-1 p-4">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-base font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-fun-blue/15 to-fun-purple/15 text-fun-purple shadow-fun transform scale-105"
                    : "hover:bg-gradient-to-r hover:from-fun-blue/10 hover:to-fun-purple/10 hover:text-fun-blue hover:shadow-sm hover:scale-105"
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
              >
                <tab.icon
                  className={`h-5 w-5 ${
                    activeTab === tab.id ? tab.animation : ""
                  }`}
                />
                {tab.label}
                {activeTab === tab.id && <span className="ml-auto">✨</span>}
              </button>
            ))}
          </div>
        </nav>
      </div>
      {/* Enhanced Desktop Nav */}
      <div className="container mx-auto px-4 py-6 hidden md:block">
        <div className="w-full flex justify-center">
          <div className="flex gap-2 mb-8 bg-gradient-to-r from-fun-blue/10 via-white/85 to-fun-purple/10 p-3 rounded-2xl backdrop-blur-md max-w-6xl w-full justify-center overflow-x-auto shadow-fun border border-fun-blue/20 bg-colorful-pattern">
            {tabConfig.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`flex items-center gap-2 rounded-xl transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-fun-blue to-fun-purple text-white shadow-magic hover:shadow-fun transform scale-105"
                    : "hover:bg-gradient-to-r hover:from-fun-blue/10 hover:to-fun-purple/10 hover:text-fun-purple hover:shadow-fun hover:scale-105"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon
                  className={`h-4 w-4 ${
                    activeTab === tab.id ? tab.animation : ""
                  }`}
                />
                {tab.label}
                {activeTab === tab.id && <span className="ml-1">✨</span>}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Enhanced Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="rounded-2xl border border-fun-blue/20 bg-gradient-to-br from-white/85 via-fun-blue/5 to-fun-purple/5 backdrop-blur-lg shadow-fun p-3 sm:p-5 hover:shadow-magic transition-all duration-300 bg-rainbow-shift">
          {renderContent()}
        </div>
      </div>
      {/* Profile Dialog (unchanged) */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gradient-rainbow">
              Student Profile
            </DialogTitle>
          </DialogHeader>
          <StudentProfile />
        </DialogContent>
      </Dialog>
      {/* Convert Points Dialog */}
      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gradient-fun">
              Convert Points to GreenCoins 💰
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {ecoPoints}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Available Points
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                  <div className="text-2xl font-bold bg-blue-300 text-white px-6 py-2 rounded-full shadow-eco flex items-center justify-center gap-2">
                    <Coins className="inline h-6 w-6 mr-1 text-white opacity-90" />
                    {Math.floor(convertAmount / 5)} GreenCoins
                  </div>
                  <div className="text-sm text-muted-foreground">
                    GreenCoins
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Exchange Rate: 5 Points = 1 GreenCoin
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="convert-amount">Amount to Convert</Label>
              <Input
                id="convert-amount"
                type="number"
                min="1"
                max={ecoPoints}
                value={convertAmount}
                onChange={(e) => setConvertAmount(Number(e.target.value))}
                className="text-center text-lg font-semibold"
              />
              <div className="text-xs text-muted-foreground text-center">
                You will receive {Math.floor(convertAmount / 5)} GreenCoins
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleConvertPoints}
                disabled={convertAmount <= 0 || convertAmount > ecoPoints}
                className="flex-1 btn-eco"
              >
                Convert Points
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConvertDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
