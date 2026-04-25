import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useGreenCoins } from "@/hooks/useGreenCoins";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  School,
  BookOpen,
  Trophy,
  Edit3,
  Save,
  X,
  Leaf,
  Target,
  Coins,
  Users,
  Crown,
  Link,
  UserPlus,
  UserMinus,
  Heart,
  Star,
  DollarSign,
  Flame,
  LogOut,
  Gift,
  Award,
  Medal,
  Recycle,
  Truck,
  Package,
  Cpu,
  Gamepad2,
  Home,
  PencilLine,
} from "lucide-react";

interface StudentInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  grade: string;
  school: string;
  address: string;
  bio: string;
  avatar?: string;
  ecoPoints: number;
  ecoCoins: number;
  streak: number;
  rank: number;
  achievements: string[];
  interests: string[];
}

const StudentProfile = () => {
  const { user, logout } = useAuth();
  const { earnCoins } = useGreenCoins();
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const referralCode = `ECO${(user?.id || "123").toString().padStart(3, "0")}`;
  const [totalReferrals, setTotalReferrals] = useState<number>(7);
  const [followers, setFollowers] = useState<number>(42);
  const [following, setFollowing] = useState<number>(28);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState([
    {
      id: "1",
      name: "Aarav Sharma",
      username: "aarav_eco",
      avatar: "",
      isFollowing: false,
      school: "St. Vincent High School",
      ecoPoints: 1247,
    },
    {
      id: "2",
      name: "Meera Patel",
      username: "meera_green",
      avatar: "",
      isFollowing: true,
      school: "Green Valley Public School",
      ecoPoints: 892,
    },
    {
      id: "3",
      name: "Rohan Kumar",
      username: "rohan_earth",
      avatar: "",
      isFollowing: false,
      school: "Riverdale Secondary",
      ecoPoints: 1156,
    },
    {
      id: "4",
      name: "Sara Ahmed",
      username: "sara_nature",
      avatar: "",
      isFollowing: true,
      school: "Sunrise International School",
      ecoPoints: 743,
    },
    {
      id: "5",
      name: "Ishaan Singh",
      username: "ishaan_eco",
      avatar: "",
      isFollowing: false,
      school: "EcoLearn Academy",
      ecoPoints: 987,
    },
  ]);
  const [followingList, setFollowingList] = useState([
    {
      id: "2",
      name: "Meera Patel",
      username: "meera_green",
      avatar: "",
      school: "Green Valley Public School",
      ecoPoints: 892,
    },
    {
      id: "4",
      name: "Sara Ahmed",
      username: "sara_nature",
      avatar: "",
      school: "Sunrise International School",
      ecoPoints: 743,
    },
    {
      id: "6",
      name: "Anaya Joshi",
      username: "anaya_earth",
      avatar: "",
      school: "St. Vincent High School",
      ecoPoints: 1103,
    },
    {
      id: "7",
      name: "Kabir Verma",
      username: "kabir_green",
      avatar: "",
      school: "Green Valley Public School",
      ecoPoints: 654,
    },
  ]);
  const schoolOptions = [
    "St. Vincent High School",
    "Green Valley Public School",
    "Riverdale Secondary",
    "Sunrise International School",
    "EcoLearn Academy",
  ];
  const schoolLeaderboards: Record<string, { name: string; refs: number }[]> = {
    "St. Vincent High School": [
      { name: "Aarav", refs: 18 },
      { name: "Meera", refs: 15 },
      { name: "Rohan", refs: 12 },
      { name: "Sara", refs: 9 },
    ],
    "Green Valley Public School": [
      { name: "Ishaan", refs: 14 },
      { name: "Anaya", refs: 10 },
      { name: "Kabir", refs: 8 },
    ],
    "Riverdale Secondary": [
      { name: "Dev", refs: 11 },
      { name: "Nia", refs: 9 },
    ],
    "Sunrise International School": [
      { name: "Aria", refs: 13 },
      { name: "Vihaan", refs: 10 },
    ],
    "EcoLearn Academy": [
      { name: "Zara", refs: 16 },
      { name: "Ayaan", refs: 12 },
    ],
  };
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    id: user?.id || "1",
    name: user?.name || "Student",
    email: user?.email || "student@ecolearn.com",
    phone: "+91 98765 43210",
    dateOfBirth: "2008-03-15",
    grade: "Class 10",
    school: "St. Vincent High School",
    address: "123 Green Street, Mumbai, Maharashtra 400001",
    bio: `Hello! I'm ${
      user?.name || "a student"
    } and I'm passionate about environmental conservation. I joined EcoQuest to make a positive impact on our planet!`,
    avatar: "",
    ecoPoints: 1247,
    ecoCoins: 150,
    streak: 12,
    rank: 3,
    achievements: [
      "New Member Badge",
      "First Login Achievement",
      "Profile Setup Complete",
    ],
    interests: [
      "Environmental Conservation",
      "Sustainability",
      "Green Technology",
    ],
  });

  // Update student info when user changes
  useEffect(() => {
    if (user) {
      setStudentInfo((prev) => ({
        ...prev,
        id: user.id,
        name: user.name,
        email: user.email,
        bio: `Hello! I'm ${user.name} and I'm passionate about environmental conservation. I joined EcoQuest to make a positive impact on our planet!`,
      }));
    }
  }, [user]);

  const [editForm, setEditForm] = useState<StudentInfo>(studentInfo);

  const handleEdit = () => {
    setEditForm(studentInfo);
    setIsEditing(true);
  };

  const handleSave = () => {
    setStudentInfo(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(studentInfo);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof StudentInfo, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof StudentInfo, value: string) => {
    const array = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setEditForm((prev) => ({ ...prev, [field]: array }));
  };

  const handleCopyShare = async () => {
    const shareText = `Join me on EcoQuest! Use my referral code ${referralCode} to sign up. I earn +20 GreenCoins and you get a +10 GreenCoin welcome bonus! 🌱🌍`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "EcoQuest Referral", text: shareText });
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleFollow = (userId: string) => {
    setFollowersList((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
    setFollowers((prev) => prev + 1);
  };

  const handleUnfollow = (userId: string) => {
    setFollowingList((prev) => prev.filter((user) => user.id !== userId));
    setFollowing((prev) => prev - 1);
  };

  // Donation & Reuse section state
  type DonationMethod = "school_box" | "ngo_pickup" | "drop_off";
  interface DonationItem {
    id: string;
    category:
      | "Clothes"
      | "Books & Study Materials"
      | "Stationery"
      | "Toys & Games"
      | "Electronics"
      | "Household Eco Items";
    itemName: string;
    quantity: number;
    method: DonationMethod;
    ngo?: string;
    date: string;
  }

  const ngoPartners = [
    "GreenFuture NGO",
    "EcoCare Foundation",
    "Books for All",
  ];

  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [pledge, setPledge] = useState({
    category: "Books & Study Materials" as DonationItem["category"],
    itemName: "Used textbooks",
    quantity: 1,
    method: "school_box" as DonationMethod,
    ngo: ngoPartners[0],
  });

  const totalItemsDonated = donations.reduce((sum, d) => sum + d.quantity, 0);
  const estimatedWastePreventedKg = totalItemsDonated * 0.5; // simple assumption
  const estimatedCO2SavedKg = Math.round(estimatedWastePreventedKg * 1.8);

  const handlePledge = () => {
    const newDonation: DonationItem = {
      id: Date.now().toString(),
      category: pledge.category,
      itemName: pledge.itemName,
      quantity: Math.max(1, Number(pledge.quantity) || 1),
      method: pledge.method,
      ngo: pledge.method === "ngo_pickup" ? pledge.ngo : undefined,
      date: new Date().toISOString().slice(0, 10),
    };
    setDonations((prev) => [newDonation, ...prev]);
    // Reward coins and badges
    earnCoins(20, `Donation: ${newDonation.itemName}`);
    setStudentInfo((prev) => ({ ...prev, ecoCoins: prev.ecoCoins + 20 }));
    if (!prevHasBadge("Eco-Giver")) {
      setStudentInfo((prev) => ({
        ...prev,
        achievements: ["Eco-Giver", ...prev.achievements],
      }));
    }
    if (
      totalItemsDonated + newDonation.quantity >= 5 &&
      !prevHasBadge("Zero-Waste Champion")
    ) {
      setStudentInfo((prev) => ({
        ...prev,
        achievements: ["Zero-Waste Champion", ...prev.achievements],
      }));
    }
  };

  const prevHasBadge = (label: string) =>
    studentInfo.achievements.some(
      (a) => a.toLowerCase() === label.toLowerCase()
    );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <p className="text-muted-foreground">
          Your personal information and eco-achievements
        </p>
      </div>

      {/* Profile Header */}
      <Card className="card-eco">
        <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6">
          <div className="text-center lg:text-left w-full lg:w-auto">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto lg:mx-0 mb-3 sm:mb-4 ring-4 ring-primary/20">
              <AvatarImage src={studentInfo.avatar} />
              <AvatarFallback className="text-xl sm:text-2xl font-bold">
                {studentInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl sm:text-2xl font-bold text-gradient-eco mb-2">
              {studentInfo.name}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 px-2 sm:px-0">
              {studentInfo.grade} • {studentInfo.school}
            </p>
            {/* Followers/Following Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-3">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                onClick={() => setShowFollowersModal(true)}
              >
                <span className="font-semibold text-sm sm:text-base">
                  {followers}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  followers
                </span>
              </div>
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                onClick={() => setShowFollowingModal(true)}
              >
                <span className="font-semibold text-sm sm:text-base">
                  {following}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  following
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary text-xs sm:text-sm"
              >
                Rank #{studentInfo.rank}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-warning/10 text-warning text-xs sm:text-sm"
              >
                {studentInfo.streak} day streak
              </Badge>
            </div>
          </div>

          <div className="w-full lg:flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gradient-eco">
                {studentInfo.ecoPoints}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Eco Points
              </div>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-r from-warning to-warning-glow flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gradient-water">
                {studentInfo.ecoCoins}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                GreenCoins
              </div>
            </div>

            <div className="text-center">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-r from-accent to-accent-glow flex items-center justify-center mx-auto mb-2">
                <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gradient-accent">
                {studentInfo.streak}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Day Streak
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end mt-4 px-4 sm:px-6">
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            title="Logout"
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </Card>

      {/* Donation & Reuse */}
      <Card className="card-eco bg-gradient-to-br from-cyan-50 to-sky-50">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 flex items-center justify-center shadow-eco flex-shrink-0">
                <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-cyan-700">
                  Donation & Reuse
                </h3>
                <p className="text-xs sm:text-sm text-cyan-700/70">
                  Give items a second life. Help people, reduce waste.
                </p>
              </div>
            </div>
            <Badge className="bg-cyan-100 text-cyan-700 text-xs sm:text-sm w-full sm:w-auto text-center">
              NGO partners: {ngoPartners.length}
            </Badge>
          </div>

          {/* Pledge Form */}
          <div className="rounded-xl border border-cyan-200 bg-white/70 p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="sm:col-span-2 lg:col-span-2">
                <Label className="text-sm text-cyan-800">Category</Label>
                <Select
                  value={pledge.category}
                  onValueChange={(v) =>
                    setPledge((p) => ({
                      ...p,
                      category: v as DonationItem["category"],
                    }))
                  }
                >
                  <SelectTrigger className="bg-white/70 border-cyan-200">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Clothes",
                      "Books & Study Materials",
                      "Stationery",
                      "Toys & Games",
                      "Electronics",
                      "Household Eco Items",
                    ].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-cyan-800">Item</Label>
                <Input
                  value={pledge.itemName}
                  onChange={(e) =>
                    setPledge((p) => ({ ...p, itemName: e.target.value }))
                  }
                  className="bg-white/70 border-cyan-200"
                  placeholder="e.g., Winter jackets"
                />
              </div>
              <div>
                <Label className="text-sm text-cyan-800">Quantity</Label>
                <Input
                  type="number"
                  value={pledge.quantity}
                  onChange={(e) =>
                    setPledge((p) => ({
                      ...p,
                      quantity: Number(e.target.value),
                    }))
                  }
                  className="bg-white/70 border-cyan-200"
                  min={1}
                />
              </div>
              <div>
                <Label className="text-sm text-cyan-800">Method</Label>
                <Select
                  value={pledge.method}
                  onValueChange={(v) =>
                    setPledge((p) => ({ ...p, method: v as DonationMethod }))
                  }
                >
                  <SelectTrigger className="bg-white/70 border-cyan-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school_box">
                      School Collection Box
                    </SelectItem>
                    <SelectItem value="ngo_pickup">NGO Pickup</SelectItem>
                    <SelectItem value="drop_off">Drop-off Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {pledge.method === "ngo_pickup" && (
              <div className="mt-3">
                <Label className="text-sm text-cyan-800">NGO Partner</Label>
                <Select
                  value={pledge.ngo}
                  onValueChange={(v) => setPledge((p) => ({ ...p, ngo: v }))}
                >
                  <SelectTrigger className="bg-white/70 border-cyan-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ngoPartners.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex justify-end mt-4">
              <Button
                onClick={handlePledge}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                I want to donate
              </Button>
            </div>
          </div>

          {/* Impact + Badges */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl p-4 bg-cyan-50 border border-cyan-200 text-center">
              <div className="h-10 w-10 rounded-full bg-cyan-500 text-white flex items-center justify-center mx-auto mb-2">
                <Recycle className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-cyan-700">
                {totalItemsDonated}
              </div>
              <div className="text-sm text-cyan-700/80">Items Reused</div>
            </div>
            <div className="rounded-xl p-4 bg-cyan-50 border border-cyan-200 text-center">
              <div className="h-10 w-10 rounded-full bg-sky-500 text-white flex items-center justify-center mx-auto mb-2">
                <Package className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-cyan-700">
                {estimatedWastePreventedKg} kg
              </div>
              <div className="text-sm text-cyan-700/80">Waste Prevented</div>
            </div>
            <div className="rounded-xl p-4 bg-cyan-50 border border-cyan-200 text-center">
              <div className="h-10 w-10 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto mb-2">
                <Leaf className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-cyan-700">
                {estimatedCO2SavedKg} kg
              </div>
              <div className="text-sm text-cyan-700/80">CO₂ Saved</div>
            </div>
          </div>

          {/* Recent donations */}
          {donations.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-cyan-800">
                Recent Pledges
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {donations.slice(0, 4).map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-lg bg-white/60 border border-cyan-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {d.category === "Clothes" ? (
                        <Gift className="h-4 w-4 text-cyan-600" />
                      ) : d.category === "Books & Study Materials" ? (
                        <BookOpen className="h-4 w-4 text-cyan-600" />
                      ) : d.category === "Stationery" ? (
                        <PencilLine className="h-4 w-4 text-cyan-600" />
                      ) : d.category === "Toys & Games" ? (
                        <Gamepad2 className="h-4 w-4 text-cyan-600" />
                      ) : d.category === "Electronics" ? (
                        <Cpu className="h-4 w-4 text-cyan-600" />
                      ) : (
                        <Home className="h-4 w-4 text-cyan-600" />
                      )}
                      <div className="text-sm">
                        <div className="font-medium">
                          {d.itemName} • x{d.quantity}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {d.method === "ngo_pickup"
                            ? `NGO: ${d.ngo}`
                            : d.method === "school_box"
                            ? "School box"
                            : "Drop-off"}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-cyan-100 text-cyan-700">
                      +20 GreenCoins
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mini leaderboard */}
          <div className="rounded-xl border border-cyan-200 p-4 bg-white/70">
            <div className="flex items-center gap-2 mb-2 text-cyan-800">
              <Award className="h-4 w-4" />
              <span className="font-semibold text-sm">Top Donors (School)</span>
            </div>
            <div className="space-y-1 text-sm">
              {[
                { name: "Anaya", items: 14 },
                { name: "Kabir", items: 9 },
                { name: "Meera", items: 8 },
                { name: user?.name || "You", items: totalItemsDonated },
              ]
                .sort((a, b) => b.items - a.items)
                .slice(0, 4)
                .map((r, i) => (
                  <div
                    key={r.name}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      r.name === (user?.name || "You")
                        ? "bg-cyan-50"
                        : "bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${
                          i === 0
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-cyan-100 text-cyan-700"
                        }`}
                      >
                        #{i + 1}
                      </Badge>
                      <span className="font-medium">{r.name}</span>
                    </div>
                    <div className="text-cyan-700 font-semibold">
                      {r.items} items
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Info note */}
          <div className="text-xs text-muted-foreground">
            Impact estimates are approximate. Example: 1 item ≈ 0.5 kg waste
            prevented; 1 kg waste ≈ 1.8 kg CO₂ saved. NGOs provide periodic
            updates like “Your 3 books helped 2 students continue studies”.
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="card-eco">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </h3>
          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </Label>
                <p className="text-lg font-semibold">{studentInfo.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Email
                </Label>
                <p className="text-lg">{studentInfo.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Phone
                </Label>
                <p className="text-lg">{studentInfo.phone}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </Label>
                <p className="text-lg">
                  {new Date(studentInfo.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={editForm.grade}
                  onChange={(e) => handleInputChange("grade", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="school">School</Label>
                <Select
                  value={editForm.school}
                  onValueChange={(value) => handleInputChange("school", value)}
                >
                  <SelectTrigger id="school">
                    <SelectValue placeholder="Select your school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editForm.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={editForm.grade}
                  onChange={(e) => handleInputChange("grade", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="school">School</Label>
                <Select
                  value={editForm.school}
                  onValueChange={(value) => handleInputChange("school", value)}
                >
                  <SelectTrigger id="school">
                    <SelectValue placeholder="Select your school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editForm.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <Label className="text-sm font-medium text-muted-foreground">
            Bio
          </Label>
          {!isEditing ? (
            <p className="text-lg mt-2">{studentInfo.bio}</p>
          ) : (
            <Textarea
              value={editForm.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="mt-2"
              rows={3}
            />
          )}
        </div>
      </Card>

      {/* Eco-Referral System */}
      <Card className="card-eco bg-gradient-to-br from-primary/5 to-primary-glow/10">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center shadow-eco">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gradient-eco">
                  Eco-Referral System
                </h3>
                <p className="text-sm text-muted-foreground">
                  Invite friends and grow our green community 🌱
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Top Referrer of the Month 🏆
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-card/70 border border-border">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                  <Link className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">
                    Your Referral Code
                  </div>
                  <div className="text-lg font-bold tracking-wide">
                    {referralCode}
                  </div>
                </div>
                <Button
                  onClick={handleCopyShare}
                  className="btn-eco whitespace-nowrap"
                >
                  {copied ? "Copied!" : "Copy/Share Code"}
                </Button>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-semibold">
                    You've invited {totalReferrals} eco-warriors 🌱
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Every friend you invite makes Earth a little greener 🌍
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    Inviter:{" "}
                    <span className="font-semibold text-gradient-eco">+20</span>{" "}
                    GreenCoins
                  </div>
                  <div className="text-sm">
                    Invitee:{" "}
                    <span className="font-semibold text-gradient-water">
                      +10
                    </span>{" "}
                    GreenCoins
                  </div>
                </div>
              </div>
            </div>

            {/* School Referral Leaderboard */}
            <div className="rounded-2xl border border-border bg-card/70 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-warning" />
                  <div className="text-sm font-semibold">
                    {studentInfo.school} • Referral Leaderboard
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  Live
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                {(() => {
                  const base = schoolLeaderboards[studentInfo.school] || [];
                  const withYou = [
                    ...base,
                    { name: user?.name || "You", refs: totalReferrals },
                  ];
                  const ranked = withYou
                    .reduce((acc: { name: string; refs: number }[], item) => {
                      const existing = acc.find((a) => a.name === item.name);
                      if (existing)
                        existing.refs = Math.max(existing.refs, item.refs);
                      else acc.push({ ...item });
                      return acc;
                    }, [])
                    .sort((a, b) => b.refs - a.refs)
                    .slice(0, 5);

                  return ranked.map((r, idx) => {
                    const isYou = r.name === (user?.name || "You");
                    const chipColor =
                      idx === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : idx === 1
                        ? "bg-slate-100 text-slate-700"
                        : idx === 2
                        ? "bg-amber-100 text-amber-800"
                        : "bg-muted/30 text-muted-foreground";
                    return (
                      <div
                        key={r.name}
                        className={`flex items-center justify-between ${
                          isYou ? "bg-primary/5 rounded-lg px-2" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 py-1">
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center ${
                              idx === 0
                                ? "bg-gradient-to-r from-warning to-primary"
                                : "bg-muted"
                            }`}
                          >
                            <span className="text-[10px] font-bold">
                              {idx + 1}
                            </span>
                          </div>
                          <span className={`${isYou ? "font-semibold" : ""}`}>
                            {isYou ? "You" : r.name}
                          </span>
                          {isYou && (
                            <Badge
                              variant="secondary"
                              className="h-5 px-2 text-[10px]"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                        <div
                          className={`px-2 py-0.5 rounded-full text-[10px] ${chipColor}`}
                        >
                          {r.refs} invites
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="card-eco">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Achievements
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentInfo.achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                <Trophy className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-medium">{achievement}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Interests */}
      <Card className="card-eco">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Environmental Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {studentInfo.interests.map((interest, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {interest}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Profile Completion */}
      <Card className="card-eco text-center bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <div className="py-6">
          <User className="h-12 w-12 text-primary mx-auto mb-4 animate-glow" />
          <h3 className="text-xl font-bold text-gradient-eco mb-2">
            Complete Your Profile!
          </h3>
          <p className="text-muted-foreground mb-4">
            Keep your profile updated to unlock more features and personalized
            content.
          </p>
          <Button className="btn-eco">Update Profile</Button>
        </div>
      </Card>

      {/* Followers Modal */}
      <Dialog open={showFollowersModal} onOpenChange={setShowFollowersModal}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gradient-eco">
              Followers ({followers})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {followersList.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      @{user.username}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.school}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {user.ecoPoints} points
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={user.isFollowing ? "outline" : "default"}
                    className={
                      user.isFollowing ? "text-muted-foreground" : "btn-eco"
                    }
                    onClick={() => handleFollow(user.id)}
                  >
                    {user.isFollowing ? (
                      <>
                        <UserMinus className="h-3 w-3 mr-1" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3 mr-1" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Following Modal */}
      <Dialog open={showFollowingModal} onOpenChange={setShowFollowingModal}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gradient-eco">
              Following ({following})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {followingList.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      @{user.username}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.school}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {user.ecoPoints} points
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleUnfollow(user.id)}
                  >
                    <UserMinus className="h-3 w-3 mr-1" />
                    Unfollow
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentProfile;
