import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Camera,
  Upload,
  CheckCircle,
  Clock,
  X,
  Heart,
  TreePine,
  Recycle,
  Droplets,
  Zap,
  Calculator,
  Share2,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import CommunityWall from "./CommunityWall";
import CarbonCalculator from "./CarbonCalculator";
import {
  appendExtraWallPost,
  type WallPostCategory,
} from "@/lib/communityWallStorage";

interface EcoAction {
  id: string;
  studentName: string;
  action: string;
  category: "trees" | "recycling" | "water" | "energy" | "other";
  description: string;
  imageUrl?: string;
  location: string;
  dateSubmitted: string;
  status: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  points: number;
  likes: number;
  comments: number;
}

const INITIAL_ECO_ACTIONS: EcoAction[] = [
  {
    id: "1",
    studentName: "Rahul Sharma",
    action: "Planted 5 saplings in school garden",
    category: "trees",
    description:
      "Organized a tree planting drive with my friends during lunch break. We planted neem, mango, and gulmohar saplings in the empty area behind our school.",
    imageUrl: "/placeholder.svg",
    location: "DPS School, Delhi",
    dateSubmitted: "2024-02-20",
    status: "verified",
    verifiedBy: "Ms. Priya (Teacher)",
    points: 50,
    likes: 23,
    comments: 8,
  },
  {
    id: "2",
    studentName: "Ananya Patel",
    action: "Collected 2kg plastic waste for recycling",
    category: "recycling",
    description:
      "Spent my weekend collecting plastic bottles and bags from my neighborhood. Took everything to the local recycling center.",
    location: "Satellite Area, Ahmedabad",
    dateSubmitted: "2024-02-19",
    status: "pending",
    points: 30,
    likes: 15,
    comments: 3,
  },
  {
    id: "3",
    studentName: "Kiran Kumar",
    action: "Fixed water leakage, saved 100L daily",
    category: "water",
    description:
      "Noticed a leaking tap in our school washroom that was wasting lots of water. Reported to maintenance and helped fix it.",
    location: "Vijayanagar School, Bangalore",
    dateSubmitted: "2024-02-18",
    status: "verified",
    verifiedBy: "Peer Review",
    points: 40,
    likes: 31,
    comments: 12,
  },
  {
    id: "4",
    studentName: "Meera Singh",
    action: "LED bulb replacement at home",
    category: "energy",
    description:
      "Convinced my parents to replace all old bulbs with LED ones. This will save electricity and reduce our carbon footprint.",
    location: "Model Town, Ludhiana",
    dateSubmitted: "2024-02-17",
    status: "pending",
    points: 35,
    likes: 8,
    comments: 2,
  },
];

function peerCategoryToWall(cat: EcoAction["category"]): WallPostCategory {
  const m: Record<EcoAction["category"], WallPostCategory> = {
    trees: "tree-planting",
    recycling: "recycling",
    water: "water-conservation",
    energy: "energy-saving",
    other: "other",
  };
  return m[cat];
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

const MAX_FILE_BYTES = 10 * 1024 * 1024;

interface WallSharePayload {
  title: string;
  description: string;
  wallCategory: WallPostCategory;
  imageDataUrl: string;
  ecoPoints: number;
  proofName: string;
  proofMime: string;
  proofSize: number;
}

const PeerValidation = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "submit" | "pending" | "verified" | "calculator"
  >("submit");
  const [ecoActions, setEcoActions] =
    useState<EcoAction[]>(INITIAL_ECO_ACTIONS);
  const [selectedAction, setSelectedAction] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [wallShareOpen, setWallShareOpen] = useState(false);
  const [pendingWallShare, setPendingWallShare] =
    useState<WallSharePayload | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl);
    };
  }, [proofPreviewUrl]);

  const actionTypes = [
    { id: "trees", label: "Tree Planting", icon: TreePine, points: 50 },
    { id: "recycling", label: "Waste Recycling", icon: Recycle, points: 30 },
    { id: "water", label: "Water Conservation", icon: Droplets, points: 40 },
    { id: "energy", label: "Energy Saving", icon: Zap, points: 35 },
    { id: "other", label: "Other Eco Action", icon: Heart, points: 25 },
  ];

  const onProofSelected = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Images only",
        description: "Please choose a photo (JPG, PNG, etc.).",
        variant: "destructive",
      });
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast({
        title: "File too large",
        description: "Please use a photo under 10 MB.",
        variant: "destructive",
      });
      return;
    }
    if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl);
    setProofFile(file);
    setProofPreviewUrl(URL.createObjectURL(file));
  };

  const clearProof = () => {
    if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl);
    setProofPreviewUrl(null);
    setProofFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitToTeacher = async () => {
    if (!selectedAction || !description.trim() || !location.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in action type, description, and location.",
        variant: "destructive",
      });
      return;
    }
    if (!proofFile) {
      toast({
        title: "Photo required",
        description: "Upload a proof photo so your teacher can verify your action.",
        variant: "destructive",
      });
      return;
    }

    let imageDataUrl: string;
    try {
      imageDataUrl = await fileToDataUrl(proofFile);
    } catch {
      toast({
        title: "Upload failed",
        description: "Could not read your photo. Try another file.",
        variant: "destructive",
      });
      return;
    }

    const meta = actionTypes.find((a) => a.id === selectedAction)!;
    const studentLabel = user?.name?.trim() || "You";
    const wallCategory = peerCategoryToWall(
      selectedAction as EcoAction["category"]
    );
    const title = `${meta.label} — ${location.trim()}`;
    const body = `${description.trim()}\n\n📍 ${location.trim()}`;

    const newEntry: EcoAction = {
      id: `me-${Date.now()}`,
      studentName: studentLabel,
      action: meta.label,
      category: selectedAction as EcoAction["category"],
      description: description.trim(),
      imageUrl: imageDataUrl,
      location: location.trim(),
      dateSubmitted: new Date().toISOString().slice(0, 10),
      status: "pending",
      points: meta.points,
      likes: 0,
      comments: 0,
    };
    setEcoActions((prev) => [newEntry, ...prev]);

    setPendingWallShare({
      title,
      description: body,
      wallCategory,
      imageDataUrl,
      ecoPoints: meta.points,
      proofName: proofFile.name,
      proofMime: proofFile.type || "image/jpeg",
      proofSize: proofFile.size,
    });
    setWallShareOpen(true);

    setSelectedAction("");
    setDescription("");
    setLocation("");
    clearProof();

    toast({
      title: "Submitted to teacher",
      description:
        "Your eco-action and photo are on the way for review. You can share to the Community Wall next.",
    });
    setActiveTab("pending");
  };

  const handlePostToWall = () => {
    if (!pendingWallShare) return;
    const author = user?.name?.trim() || "You";
    const now = new Date().toISOString();
    appendExtraWallPost({
      _id: `wall-${Date.now()}`,
      title: pendingWallShare.title,
      description: pendingWallShare.description,
      category: pendingWallShare.wallCategory,
      author,
      image: {
        filename: pendingWallShare.proofName,
        path: "",
        mimetype: pendingWallShare.proofMime,
        size: pendingWallShare.proofSize,
      },
      imageUrl: pendingWallShare.imageDataUrl,
      likes: 0,
      comments: [],
      status: "approved",
      ecoPoints: pendingWallShare.ecoPoints,
      createdAt: now,
      updatedAt: now,
    });
    setWallShareOpen(false);
    setPendingWallShare(null);
    toast({
      title: "Posted to Community Wall",
      description: "Your photo and story are live for classmates to see.",
    });
    setActiveTab("verified");
  };

  const handleSkipWall = () => {
    setWallShareOpen(false);
    setPendingWallShare(null);
  };

  const getCategoryIcon = (category: string) => {
    const action = actionTypes.find((a) => a.id === category);
    return action ? action.icon : Heart;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const tabs = [
    { id: "submit" as const, label: "Submit Action", icon: Upload },
    { id: "pending" as const, label: "Pending Review", icon: Clock },
    { id: "verified" as const, label: "Community Wall", icon: CheckCircle },
    { id: "calculator" as const, label: "Calculator", icon: Calculator },
  ];

  const myName = user?.name?.trim() || "You";
  const myPending = ecoActions.filter(
    (a) => a.status === "pending" && a.studentName === myName
  );

  return (
    <div className="space-y-6">
      <Dialog open={wallShareOpen} onOpenChange={(o) => !o && handleSkipWall()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Share on Community Wall?
            </DialogTitle>
          </DialogHeader>
          {pendingWallShare && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your submission was sent to your teacher. You can also post the
                same photo and story on the social Community Wall to inspire
                others.
              </p>
              <div className="rounded-lg overflow-hidden border bg-muted/30 aspect-video flex items-center justify-center">
                <img
                  src={pendingWallShare.imageDataUrl}
                  alt="Your eco-action proof"
                  className="max-h-52 w-full object-contain"
                />
              </div>
              <div>
                <p className="font-semibold text-sm">{pendingWallShare.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-3 mt-1 whitespace-pre-line">
                  {pendingWallShare.description}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
            <Button variant="outline" onClick={handleSkipWall}>
              Not now
            </Button>
            <Button className="btn-eco" onClick={handlePostToWall}>
              <Share2 className="h-4 w-4 mr-2" />
              Post to Community Wall
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-eco mb-2">
          Peer Validation
        </h2>
        <p className="text-muted-foreground">
          Share your real eco-actions, get them verified, and inspire others!
        </p>
      </div>

      <div className="flex justify-center px-2 sm:px-0">
        <div className="flex gap-2 bg-card/50 p-2 rounded-2xl backdrop-blur-sm max-w-full overflow-x-auto whitespace-nowrap">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`flex items-center gap-2 rounded-xl transition-all duration-200 shrink-0 text-sm px-3 py-1 sm:px-4 sm:py-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg"
                  : "hover:bg-cyan-50 hover:text-cyan-600 hover:shadow-sm text-cyan-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon
                className={`h-4 w-4 ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-cyan-500 group-hover:text-cyan-600"
                }`}
              />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {activeTab === "submit" && (
        <Card className="card-eco">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Submit Your Eco Action
            </h3>
            <p className="text-muted-foreground text-sm">
              Upload proof for your teacher, then optionally share on the
              Community Wall.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="font-semibold">Type of Action</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="What eco-action did you perform?" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((action) => (
                    <SelectItem key={action.id} value={action.id}>
                      <div className="flex items-center gap-2">
                        <action.icon className="h-4 w-4" />
                        {action.label} (+{action.points} points)
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="font-semibold">Description</Label>
              <Textarea
                placeholder="Describe what you did, how you did it, and what impact it will have..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <Label className="font-semibold">Location</Label>
              <Input
                placeholder="Where did you perform this action? (e.g., My School, Local Park)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label className="font-semibold">Upload proof photo</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) =>
                  onProofSelected(e.target.files?.[0] ?? null)
                }
              />
              <div className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/20">
                {proofPreviewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={proofPreviewUrl}
                      alt="Proof preview"
                      className="max-h-48 rounded-lg mx-auto object-contain"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change photo
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full hover:border-primary/50 transition-colors cursor-pointer rounded-lg"
                  >
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2 flex items-center justify-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Click to upload a photo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Show your action in progress or the result. Max 10 MB.
                    </p>
                  </button>
                )}
              </div>
              {proofPreviewUrl && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={clearProof}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove photo
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 p-4 rounded-xl">
              <h4 className="font-semibold mb-2 text-primary">
                💡 Tips for Better Verification
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Include yourself in the photo to prove participation</li>
                <li>• Show before/after if applicable (like cleaned area)</li>
                <li>• Add location markers or recognizable landmarks</li>
                <li>• Write detailed descriptions of your impact</li>
              </ul>
            </div>

            <Button
              className="btn-eco w-full"
              onClick={() => void handleSubmitToTeacher()}
            >
              Submit to teacher
            </Button>
          </div>
        </Card>
      )}

      {activeTab === "pending" && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-1">
              Your actions under review
            </h3>
            <p className="text-sm text-muted-foreground">
              Teachers typically review within 24–48 hours.
            </p>
          </div>

          {myPending.length === 0 ? (
            <Card className="card-eco p-8 text-center text-muted-foreground text-sm">
              No submissions from you yet. Use Submit Action to send one with a
              photo.
            </Card>
          ) : (
            myPending.map((action) => {
              const Icon = getCategoryIcon(action.category);
              return (
                <Card key={action.id} className="card-eco overflow-hidden">
                  <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {action.imageUrl && (
                      <div className="shrink-0 w-full sm:w-36 h-28 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={action.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="h-12 w-12 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-xl flex items-center justify-center shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold">{action.action}</h4>
                          <Badge className={getStatusColor(action.status)}>
                            {action.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          {action.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{action.location}</span>
                          <span>+{action.points} points pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {activeTab === "verified" && <CommunityWall />}

      {activeTab === "calculator" && <CarbonCalculator />}
    </div>
  );
};

export default PeerValidation;
