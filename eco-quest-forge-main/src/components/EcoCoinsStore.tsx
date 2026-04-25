import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Coins,
  ShoppingBag,
  Star,
  Gift,
  Trophy,
  TreePine,
  Sparkles,
  Crown,
  Award,
  Heart,
  MapPin,
  Camera,
  Fish,
  Building,
  Film,
  Ticket,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: "badges" | "city" | "rewards" | "premium";
  icon: any;
  rarity: "common" | "rare" | "legendary";
  owned?: boolean;
  stock?: number;
  previewImage?: string;
}

const EcoCoinsStore = () => {
  const [activeCategory, setActiveCategory] = useState<
    "badges" | "city" | "rewards" | "premium"
  >("badges");
  const [ecoCoins, setEcoCoins] = useState(850);
  const { toast } = useToast();

  const storeItems: StoreItem[] = [
    // Badges & Stickers
    {
      id: "1",
      name: "Golden Tree Badge",
      description: "Exclusive badge for tree planting champions",
      cost: 100,
      category: "badges",
      icon: TreePine,
      rarity: "legendary",
      stock: 1,
    },
    {
      id: "2",
      name: "Water Guardian Sticker",
      description: "Show your water conservation skills",
      cost: 50,
      category: "badges",
      icon: Award,
      rarity: "rare",
    },
    {
      id: "3",
      name: "Eco Warrior Frame",
      description: "Special profile frame for your avatar",
      cost: 75,
      category: "badges",
      icon: Crown,
      rarity: "rare",
    },

    // Virtual City Upgrades
    {
      id: "4",
      name: "Solar Panel Array",
      description: "Add renewable energy to your eco-city",
      cost: 200,
      category: "city",
      icon: Sparkles,
      rarity: "rare",
    },
    {
      id: "5",
      name: "Green Park",
      description: "Beautiful park with native trees and flowers",
      cost: 150,
      category: "city",
      icon: TreePine,
      rarity: "common",
    },
    {
      id: "6",
      name: "Wind Turbines",
      description: "Clean wind energy for your city",
      cost: 300,
      category: "city",
      icon: Star,
      rarity: "legendary",
    },

    // Physical Rewards
    {
      id: "7",
      name: "Eco Certificate",
      description: "Official certificate for your environmental efforts",
      cost: 500,
      category: "rewards",
      icon: Trophy,
      rarity: "legendary",
      stock: 5,
    },
    {
      id: "8",
      name: "Plant Seeds Kit",
      description: "Real seeds to grow your own plants",
      cost: 250,
      category: "rewards",
      icon: TreePine,
      rarity: "rare",
      stock: 10,
    },
    {
      id: "9",
      name: "Eco-friendly Pencils",
      description: "Set of 10 pencils made from recycled paper",
      cost: 100,
      category: "rewards",
      icon: Gift,
      rarity: "common",
      stock: 25,
    },

    // Tourist & Cultural Discounts
    {
      id: "13",
      name: "ASI Heritage Sites - 50% Off",
      description:
        "50% discount on Archaeological Survey of India tourist spots",
      cost: 200,
      category: "rewards",
      icon: MapPin,
      rarity: "legendary",
      stock: 5,
    },
    {
      id: "14",
      name: "Zoo Entry - 10% Off",
      description: "10% discount on zoo tickets nationwide",
      cost: 80,
      category: "rewards",
      icon: Camera,
      rarity: "common",
      stock: 20,
    },
    {
      id: "15",
      name: "Aquarium Visit - 10% Off",
      description: "10% discount on aquarium entry tickets",
      cost: 75,
      category: "rewards",
      icon: Fish,
      rarity: "common",
      stock: 15,
    },
    {
      id: "16",
      name: "Museum Entry - 10% Off",
      description: "10% discount on museum tickets across India",
      cost: 90,
      category: "rewards",
      icon: Building,
      rarity: "common",
      stock: 18,
    },
    {
      id: "17",
      name: "Movie Tickets - 15% Off",
      description: "15% discount on cinema tickets (valid at major chains)",
      cost: 150,
      category: "rewards",
      icon: Film,
      rarity: "rare",
      stock: 12,
    },
    {
      id: "18",
      name: "Theme Park - 12% Off",
      description: "12% discount on theme park and adventure park tickets",
      cost: 120,
      category: "rewards",
      icon: Ticket,
      rarity: "rare",
      stock: 8,
    },

    // Premium Features
    {
      id: "19",
      name: "Premium Dashboard Theme",
      description: "Exclusive forest theme for your dashboard",
      cost: 400,
      category: "premium",
      icon: Sparkles,
      rarity: "legendary",
    },
    {
      id: "20",
      name: "Double XP Boost (7 days)",
      description: "Earn double points for one week",
      cost: 300,
      category: "premium",
      icon: Star,
      rarity: "rare",
    },
    {
      id: "21",
      name: "Custom Avatar Outfit",
      description: "Unique eco-warrior outfit for your avatar",
      cost: 200,
      category: "premium",
      icon: Crown,
      rarity: "rare",
    },
  ];

  const categories = [
    { id: "badges" as const, label: "Badges & Stickers", icon: Star },
    { id: "city" as const, label: "City Upgrades", icon: TreePine },
    { id: "rewards" as const, label: "Real Rewards", icon: Gift },
    { id: "premium" as const, label: "Premium Items", icon: Crown },
  ];

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

  const handlePurchase = (item: StoreItem) => {
    if (ecoCoins >= item.cost) {
      setEcoCoins((prev) => prev - item.cost);
      toast({
        title: "Purchase Successful! 🎉",
        description: `You've bought ${item.name} for ${item.cost} eco-coins!`,
      });
    } else {
      toast({
        title: "Insufficient Eco-Coins 💰",
        description: `You need ${
          item.cost - ecoCoins
        } more eco-coins for this item.`,
        variant: "destructive",
      });
    }
  };

  const filteredItems = storeItems.filter(
    (item) => item.category === activeCategory
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-eco mb-2">
          Eco-Coins Store
        </h2>
        <p className="text-muted-foreground">
          Spend your hard-earned eco-coins on badges, city upgrades, and real
          rewards!
        </p>
      </div>

      {/* Eco-Coins Balance */}
      <Card className="card-eco">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center">
              <Coins className="h-8 w-8 text-yellow-900" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gradient-eco">
                {ecoCoins.toLocaleString()}
              </h3>
              <p className="text-muted-foreground">Available Eco-Coins</p>
            </div>
          </div>
          <div className="text-right">
            <Button variant="outline" size="sm">
              <Gift className="h-4 w-4 mr-2" />
              Earn More
            </Button>
          </div>
        </div>
      </Card>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        <div className="flex gap-2 bg-card/50 p-2 rounded-2xl backdrop-blur-sm">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "ghost"}
              className={`flex items-center gap-2 rounded-xl transition-all duration-200 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-eco"
                  : "hover:bg-muted/50"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Store Items */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={`card-eco border-2 ${getRarityBorder(
              item.rarity
            )} relative overflow-hidden`}
          >
            {/* Rarity Badge */}
            <div
              className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getRarityColor(
                item.rarity
              )}`}
            >
              {item.rarity}
            </div>

            <div className="space-y-4">
              {/* Item Icon */}
              <div className="text-center">
                <div
                  className={`h-16 w-16 mx-auto rounded-2xl bg-gradient-to-r ${getRarityColor(
                    item.rarity
                  )} p-0.5`}
                >
                  <div className="h-full w-full rounded-xl bg-background flex items-center justify-center">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>

              {/* Item Info */}
              <div className="text-center space-y-2">
                <h4 className="font-bold text-gradient-eco">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>

              {/* Stock Info */}
              {item.stock !== undefined && (
                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    {item.stock} in stock
                  </Badge>
                </div>
              )}

              {/* Price & Purchase */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="text-xl font-bold">{item.cost}</span>
                  <span className="text-sm text-muted-foreground">
                    eco-coins
                  </span>
                </div>

                <Button
                  className="w-full btn-eco"
                  onClick={() => handlePurchase(item)}
                  disabled={
                    ecoCoins < item.cost ||
                    (item.stock !== undefined && item.stock === 0)
                  }
                >
                  {ecoCoins < item.cost
                    ? "Not Enough Coins"
                    : item.stock === 0
                    ? "Out of Stock"
                    : "Purchase"}
                </Button>
              </div>

              {/* Affordability Indicator */}
              {ecoCoins < item.cost && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground text-center">
                    You need {item.cost - ecoCoins} more coins
                  </div>
                  <Progress
                    value={(ecoCoins / item.cost) * 100}
                    className="h-2"
                  />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Featured Deals */}
      <Card className="card-eco bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <div className="text-center py-6">
          <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-4 animate-bounce-gentle" />
          <h3 className="text-xl font-bold text-gradient-eco mb-2">
            Weekly Special!
          </h3>
          <p className="text-muted-foreground mb-4">
            Complete 5 eco-actions this week and get 20% off all premium items!
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-sm text-muted-foreground">
              Progress: 2/5 actions
            </div>
            <Progress value={40} className="w-32" />
          </div>
        </div>
      </Card>

      {/* Earning Tips */}
      <Card className="card-eco">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          How to Earn More Eco-Coins
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
    </div>
  );
};

export default EcoCoinsStore;
