import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useGreenCoins } from "@/hooks/useGreenCoins";
import {
  Coins,
  Wallet,
  Store,
  History,
  Plus,
  Minus,
  Gift,
  TreePine,
  BookOpen,
  ShoppingBag,
  Trophy,
  Heart,
  ArrowRight,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Leaf,
  Zap,
  Award,
  Crown,
  Star,
  Sparkles,
  MapPin,
  Camera,
  Fish,
  Building,
  Film,
  Ticket,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "earned" | "spent";
  amount: number;
  description: string;
  timestamp: string;
  category: string;
  icon: any;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: "discount" | "donation" | "badge" | "certificate";
  icon: any;
  available: boolean;
  popular?: boolean;
}

const GreenCoinsWallet = () => {
  const { balance, earnCoins, spendCoins, transactions } = useGreenCoins();
  const [activeTab, setActiveTab] = useState("wallet");
  const [isEarning, setIsEarning] = useState(false);
  const [earnedAmount, setEarnedAmount] = useState(0);
  const [activeCategory, setActiveCategory] = useState<
    "all" | "badge" | "discount" | "donation" | "certificate"
  >("all");

  // Use transactions from context, but add icons for display
  const transactionsWithIcons = transactions.map((t) => ({
    ...t,
    icon:
      t.category === "quiz"
        ? BookOpen
        : t.category === "redemption"
        ? ShoppingBag
        : t.category === "mission"
        ? Leaf
        : t.category === "donation"
        ? Heart
        : Leaf,
  }));

  const rewards: Reward[] = [
    // Badges & Stickers
    {
      id: "1",
      title: "Golden Tree Badge",
      description: "Exclusive badge for tree planting champions",
      cost: 100,
      category: "badge",
      icon: Trophy,
      available: true,
      popular: true,
    },
    {
      id: "2",
      title: "Water Guardian Sticker",
      description: "Show your water conservation skills",
      cost: 50,
      category: "badge",
      icon: Award,
      available: true,
    },
    {
      id: "3",
      title: "Eco Warrior Frame",
      description: "Special profile frame for your avatar",
      cost: 75,
      category: "badge",
      icon: Crown,
      available: true,
    },
    // Physical Rewards
    {
      id: "4",
      title: "Eco Certificate",
      description: "Official certificate for your environmental efforts",
      cost: 500,
      category: "certificate",
      icon: Trophy,
      available: balance >= 500,
    },
    {
      id: "5",
      title: "Plant Seeds Kit",
      description: "Real seeds to grow your own plants",
      cost: 250,
      category: "donation",
      icon: TreePine,
      available: true,
    },
    {
      id: "6",
      title: "Eco-friendly Pencils",
      description: "Set of 10 pencils made from recycled paper",
      cost: 100,
      category: "discount",
      icon: BookOpen,
      available: true,
    },
    // Tourist & Cultural Discounts
    {
      id: "7",
      title: "ASI Heritage Sites - 50% Off",
      description:
        "50% discount on Archaeological Survey of India tourist spots",
      cost: 200,
      category: "discount",
      icon: MapPin,
      available: true,
      popular: true,
    },
    {
      id: "8",
      title: "Zoo Entry - 10% Off",
      description: "10% discount on zoo tickets nationwide",
      cost: 80,
      category: "discount",
      icon: Camera,
      available: true,
    },
    {
      id: "9",
      title: "Aquarium Visit - 10% Off",
      description: "10% discount on aquarium entry tickets",
      cost: 75,
      category: "discount",
      icon: Fish,
      available: true,
    },
    {
      id: "10",
      title: "Museum Entry - 10% Off",
      description: "10% discount on museum tickets across India",
      cost: 90,
      category: "discount",
      icon: Building,
      available: true,
    },
    {
      id: "11",
      title: "Movie Tickets - 15% Off",
      description: "15% discount on cinema tickets (valid at major chains)",
      cost: 150,
      category: "discount",
      icon: Film,
      available: true,
      popular: true,
    },
    {
      id: "12",
      title: "Theme Park - 12% Off",
      description: "12% discount on theme park and adventure park tickets",
      cost: 120,
      category: "discount",
      icon: Ticket,
      available: true,
    },
    // School & Local Discounts
    {
      id: "13",
      title: "10% Canteen Discount",
      description: "Get 10% off your next meal at school canteen",
      cost: 100,
      category: "discount",
      icon: ShoppingBag,
      available: true,
    },
    {
      id: "14",
      title: "Bookstore Voucher",
      description: "15% off on eco-friendly books and supplies",
      cost: 120,
      category: "discount",
      icon: BookOpen,
      available: true,
    },
    // Donations
    {
      id: "15",
      title: "Plant a Real Sapling",
      description: "A real tree will be planted in your name",
      cost: 200,
      category: "donation",
      icon: TreePine,
      available: true,
    },
    {
      id: "16",
      title: "NGO Donation",
      description: "Donate to verified environmental organizations",
      cost: 250,
      category: "donation",
      icon: Heart,
      available: true,
    },
    // Premium Features
    {
      id: "17",
      title: "Premium Dashboard Theme",
      description: "Exclusive forest theme for your dashboard",
      cost: 400,
      category: "certificate",
      icon: Sparkles,
      available: balance >= 400,
    },
    {
      id: "18",
      title: "Double XP Boost (7 days)",
      description: "Earn double points for one week",
      cost: 300,
      category: "certificate",
      icon: Star,
      available: balance >= 300,
    },
  ];

  const handleRedeem = (reward: Reward) => {
    if (balance >= reward.cost) {
      spendCoins(reward.cost, `Redeemed: ${reward.title}`);
    }
  };

  const simulateEarning = (amount: number) => {
    setEarnedAmount(amount);
    setIsEarning(true);
    earnCoins(amount, "Eco action completed");

    setTimeout(() => {
      setIsEarning(false);
      setEarnedAmount(0);
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "quiz":
        return "text-blue-500";
      case "mission":
        return "text-green-500";
      case "redemption":
        return "text-orange-500";
      case "donation":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case "quiz":
        return "bg-blue-100";
      case "mission":
        return "bg-green-100";
      case "redemption":
        return "bg-orange-100";
      case "donation":
        return "bg-purple-100";
      default:
        return "bg-gray-100";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "from-yellow-400 to-orange-500 text-yellow-900";
      case "rare":
        return "from-purple-400 to-blue-500 text-purple-900";
      case "common":
        return "from-green-400 to-blue-400 text-green-900";
      default:
        return "from-gray-400 to-gray-500 text-gray-900";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "border-yellow-500";
      case "rare":
        return "border-purple-500";
      case "common":
        return "border-green-500";
      default:
        return "border-gray-500";
    }
  };

  const filteredRewards =
    activeCategory === "all"
      ? rewards
      : rewards.filter((reward) => reward.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient-eco mb-2">
          💰 GreenCoins Wallet
        </h2>
        <p className="text-muted-foreground">
          Earn coins through eco-actions, redeem for rewards!
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallet" className="space-y-6">
          {/* Balance Card */}
          <Card className="card-eco p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div
                  className={`h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center ${
                    isEarning ? "animate-coin-earn" : "animate-coin-sparkle"
                  }`}
                >
                  <Coins className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3
                className={`text-4xl font-bold text-gradient-eco mb-2 coin-balance-update ${
                  isEarning ? "earning" : ""
                }`}
              >
                {balance}
                {isEarning && (
                  <span className="text-yellow-500 ml-2 animate-coin-earn">
                    +{earnedAmount}
                  </span>
                )}
              </h3>
              <p className="text-muted-foreground mb-4">GreenCoins Balance</p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +150 this week
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <Users className="h-4 w-4" />
                  #5 in class
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="card-eco text-center p-4">
              <div className="flex items-center justify-center mb-2">
                <Plus className="h-6 w-6 text-green-500" />
              </div>
              <h4 className="text-xl font-bold text-green-600">1,250</h4>
              <p className="text-sm text-muted-foreground">Total Earned</p>
            </Card>
            <Card className="card-eco text-center p-4">
              <div className="flex items-center justify-center mb-2">
                <Minus className="h-6 w-6 text-red-500" />
              </div>
              <h4 className="text-xl font-bold text-red-600">750</h4>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </Card>
            <Card className="card-eco text-center p-4">
              <div className="flex items-center justify-center mb-2">
                <Gift className="h-6 w-6 text-purple-500" />
              </div>
              <h4 className="text-xl font-bold text-purple-600">8</h4>
              <p className="text-sm text-muted-foreground">Rewards Claimed</p>
            </Card>
          </div>

          {/* Demo Earning Section */}
          <Card className="card-eco">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Try Earning Coins
            </h3>
            <p className="text-muted-foreground mb-4">
              Click below to simulate earning GreenCoins from eco-actions
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => simulateEarning(25)}
                className="btn-eco"
                disabled={isEarning}
              >
                <Leaf className="h-4 w-4 mr-2" />
                Recycle (+25)
              </Button>
              <Button
                onClick={() => simulateEarning(50)}
                className="btn-earth"
                disabled={isEarning}
              >
                <TreePine className="h-4 w-4 mr-2" />
                Plant Tree (+50)
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="card-eco">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {transactionsWithIcons.slice(0, 3).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full ${getCategoryBg(
                        transaction.category
                      )} flex items-center justify-center`}
                    >
                      <transaction.icon
                        className={`h-4 w-4 ${getCategoryColor(
                          transaction.category
                        )}`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.timestamp}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      transaction.type === "earned"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "earned" ? "+" : "-"}
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="store" className="space-y-6">
          {/* Store Header */}
          <Card className="card-eco p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Rewards Store</h3>
                <p className="text-muted-foreground">
                  Redeem your GreenCoins for amazing rewards
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Available Balance
                </p>
                <p className="text-2xl font-bold text-gradient-eco">
                  {balance} Coins
                </p>
              </div>
            </div>
          </Card>

          {/* Category Filter */}
          <div className="flex justify-center px-2 sm:px-0">
            <div className="flex gap-2 bg-card/50 p-2 rounded-2xl backdrop-blur-sm max-w-full overflow-x-auto whitespace-nowrap">
              {[
                { id: "all" as const, label: "All Items", icon: Store },
                { id: "badge" as const, label: "Badges", icon: Trophy },
                {
                  id: "discount" as const,
                  label: "Discounts",
                  icon: ShoppingBag,
                },
                { id: "donation" as const, label: "Donations", icon: Heart },
                { id: "certificate" as const, label: "Premium", icon: Crown },
              ].map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "ghost"}
                  className={`flex items-center gap-2 rounded-xl transition-all duration-200 shrink-0 text-sm px-3 py-1 sm:px-4 sm:py-2 ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-eco"
                      : "hover:bg-primary/10 hover:text-primary hover:shadow-sm"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <category.icon className="h-4 w-4" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRewards.map((reward) => (
              <Card
                key={reward.id}
                className={`card-eco p-4 transition-all duration-200 hover:shadow-lg border-2 ${
                  !reward.available ? "opacity-60" : ""
                }`}
              >
                {reward.popular && (
                  <Badge className="mb-2 bg-gradient-to-r from-pink-500 to-purple-500">
                    Popular
                  </Badge>
                )}

                {/* Item Icon */}
                <div className="text-center mb-4">
                  <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-r from-primary/20 to-primary-glow/20 p-0.5">
                    <div className="h-full w-full rounded-xl bg-background flex items-center justify-center">
                      <reward.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Item Info */}
                <div className="text-center space-y-2 mb-4">
                  <h4 className="font-bold text-gradient-eco">
                    {reward.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {reward.description}
                  </p>
                </div>

                {/* Price & Purchase */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <span className="text-xl font-bold">{reward.cost}</span>
                    <span className="text-sm text-muted-foreground">coins</span>
                  </div>

                  <Button
                    className="w-full btn-eco"
                    disabled={!reward.available || balance < reward.cost}
                    onClick={() => handleRedeem(reward)}
                  >
                    {reward.available && balance >= reward.cost ? (
                      <>
                        Redeem
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {balance < reward.cost
                          ? "Not Enough Coins"
                          : "Redeemed"}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Earning Tips */}
          <Card className="card-eco">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              How to Earn More GreenCoins
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span>
                    Complete daily eco-actions: <strong>10-50 coins</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span>
                    Finish learning modules: <strong>25 coins</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span>
                    Get verified peer actions: <strong>30 coins</strong>
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span>
                    Weekly streak bonus: <strong>100 coins</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span>
                    Top 3 in leaderboard: <strong>200 coins</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span>
                    Share eco-stories: <strong>15 coins</strong>
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Transaction History */}
          <Card className="card-eco">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Transaction History
            </h3>
            <div className="space-y-3">
              {transactionsWithIcons.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-primary/5 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-full ${getCategoryBg(
                        transaction.category
                      )} flex items-center justify-center`}
                    >
                      <transaction.icon
                        className={`h-5 w-5 ${getCategoryColor(
                          transaction.category
                        )}`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.timestamp}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-semibold text-lg ${
                      transaction.type === "earned"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "earned" ? "+" : "-"}
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GreenCoinsWallet;
