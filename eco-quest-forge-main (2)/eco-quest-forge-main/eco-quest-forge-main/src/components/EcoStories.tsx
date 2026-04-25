import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import VideoTemplate from "./VideoTemplate";
import {
  BookOpen,
  User,
  MapPin,
  Calendar,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  Award,
  Video,
  Star,
  Coins,
  Leaf,
} from "lucide-react";

interface EcoHero {
  id: string;
  name: string;
  age?: number;
  location: string;
  avatar?: string;
  title: string;
  story: string;
  achievement: string;
  impact: string;
  category: "local" | "national" | "global";
  likes: number;
  dateAdded: string;
  videoUrl?: string;
  videoDuration?: string;
  lesson?: string;
  ecoPointsReward?: number;
  ecoCoinsReward?: number;
  isWatched?: boolean;
  watchProgress?: number;
}

const EcoStories = () => {
  const [activeCategory, setActiveCategory] = useState<
    "local" | "national" | "global"
  >("national");
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>(
    {}
  );

  const ecoHeroes: EcoHero[] = [
    // National Heroes with Videos
    {
      id: "gandhi",
      name: "Mahatma Gandhi",
      location: "Champaran, Bihar & Nationwide",
      title: "Champaran Satyagraha & Swadeshi Movement",
      story:
        "Mahatma Gandhi's Champaran Satyagraha in 1917 was India's first civil disobedience movement. He taught the importance of simplicity, sustainability, and using local products. His Swadeshi movement promoted self-reliance and minimal waste, principles that are crucial for environmental conservation today.",
      achievement:
        "Led India's first civil disobedience movement and promoted sustainable living",
      impact:
        "Inspired millions to adopt simple, sustainable lifestyles and local production",
      category: "national",
      likes: 5420,
      dateAdded: "2024-01-15",
      videoUrl: "https://www.youtube.com/embed/example1",
      videoDuration: "8:45",
      lesson:
        "Simplicity, sustainability, use of local products, minimal waste",
      ecoPointsReward: 100,
      ecoCoinsReward: 25,
      isWatched: false,
      watchProgress: 0,
    },
    {
      id: "gaura-devi",
      name: "Gaura Devi",
      location: "Uttarakhand, India",
      title: "Chipko Movement Leader (1973)",
      story:
        "Gaura Devi, a village woman from Uttarakhand, led the famous Chipko movement where villagers hugged trees to prevent them from being cut down. This movement became a symbol of environmental protection and women-led eco-activism.",
      achievement:
        "Led the Chipko movement protecting forests from commercial logging",
      impact:
        "Inspired forest conservation movements across India and globally",
      category: "national",
      likes: 3890,
      dateAdded: "2024-01-20",
      videoUrl: "https://www.youtube.com/embed/example2",
      videoDuration: "6:30",
      lesson: "Tree conservation, protecting forests, women-led eco-activism",
      ecoPointsReward: 80,
      ecoCoinsReward: 20,
      isWatched: false,
      watchProgress: 0,
    },
    {
      id: "sundarlal-bahuguna",
      name: "Sundarlal Bahuguna",
      location: "Uttarakhand, India",
      title: "Save Himalaya Movement",
      story:
        "Sundarlal Bahuguna dedicated his life to protecting the Himalayan forests and rivers. He walked thousands of kilometers to raise awareness about environmental conservation and the importance of preserving our natural resources.",
      achievement:
        "Walked 5000+ km across Himalayas to save forests and rivers",
      impact:
        "Protected thousands of hectares of forest land and river ecosystems",
      category: "national",
      likes: 3120,
      dateAdded: "2024-01-25",
      videoUrl: "https://www.youtube.com/embed/example3",
      videoDuration: "7:15",
      lesson: "Forest preservation, river conservation, water as a lifeline",
      ecoPointsReward: 90,
      ecoCoinsReward: 22,
      isWatched: false,
      watchProgress: 0,
    },
    {
      id: "amrita-devi",
      name: "Amrita Devi Bishnoi",
      location: "Rajasthan, India",
      title: "Bishnoi Community Protector (1730)",
      story:
        "Amrita Devi Bishnoi sacrificed her life along with 363 others to protect the sacred Khejri trees from being cut down by the king's men. This sacrifice led to the protection of forests and inspired the Bishnoi community's environmental values.",
      achievement:
        "Sacrificed life to protect sacred trees, inspiring forest conservation",
      impact:
        "Established Bishnoi community as environmental protectors for generations",
      category: "national",
      likes: 4560,
      dateAdded: "2024-02-01",
      videoUrl: "https://www.youtube.com/embed/example4",
      videoDuration: "5:45",
      lesson: "Sacrifice to save trees, biodiversity conservation",
      ecoPointsReward: 75,
      ecoCoinsReward: 18,
      isWatched: false,
      watchProgress: 0,
    },
    {
      id: "jadav-payeng",
      name: "Jadav Payeng",
      location: "Assam, India",
      title: "The Forest Man of India",
      story:
        "Jadav Payeng single-handedly planted and nurtured a forest on a barren sandbar in the Brahmaputra River. Over 40 years, he transformed 550 hectares of wasteland into a thriving forest ecosystem.",
      achievement: "Created 550-hectare forest single-handedly over 40 years",
      impact:
        "Demonstrated individual action can create massive environmental change",
      category: "national",
      likes: 5230,
      dateAdded: "2024-02-05",
      videoUrl: "https://www.youtube.com/embed/example5",
      videoDuration: "9:20",
      lesson: "Reforestation, individual action can change the environment",
      ecoPointsReward: 110,
      ecoCoinsReward: 28,
      isWatched: false,
      watchProgress: 0,
    },
    {
      id: "salim-ali",
      name: "Salim Ali",
      location: "Mumbai, Maharashtra",
      title: "Bird Man of India",
      story:
        "Dr. Salim Ali was India's most prominent ornithologist who dedicated his life to studying and conserving birds. His work highlighted the importance of biodiversity and ecological balance in maintaining healthy ecosystems.",
      achievement:
        "Documented 1000+ bird species and established bird conservation in India",
      impact: "Created awareness about biodiversity and ecological balance",
      category: "national",
      likes: 2980,
      dateAdded: "2024-02-08",
      videoUrl: "https://www.youtube.com/embed/example6",
      videoDuration: "6:50",
      lesson:
        "Importance of biodiversity, bird conservation, ecological balance",
      ecoPointsReward: 85,
      ecoCoinsReward: 21,
      isWatched: false,
      watchProgress: 0,
    },
    {
      id: "medha-patkar",
      name: "Medha Patkar",
      location: "Narmada Valley, India",
      title: "Narmada Bachao Andolan",
      story:
        "Medha Patkar led the Narmada Bachao Andolan to protect the Narmada River and its communities from large dam projects. She advocated for sustainable development that respects both environment and human rights.",
      achievement:
        "Led 30+ year movement to protect Narmada River and communities",
      impact:
        "Highlighted importance of sustainable development and community rights",
      category: "national",
      likes: 3670,
      dateAdded: "2024-02-10",
      videoUrl: "https://www.youtube.com/embed/example7",
      videoDuration: "8:10",
      lesson:
        "Sustainable development, protecting rivers and displaced communities",
      ecoPointsReward: 95,
      ecoCoinsReward: 24,
      isWatched: false,
      watchProgress: 0,
    },
    {
      id: "rajendra-singh",
      name: "Rajendra Singh",
      location: "Rajasthan, India",
      title: "Waterman of India",
      story:
        "Rajendra Singh revived traditional water harvesting techniques and brought water back to over 1000 villages in Rajasthan. His work demonstrates how traditional knowledge can solve modern environmental challenges.",
      achievement:
        "Revived water in 1000+ villages using traditional harvesting methods",
      impact:
        "Restored water security for millions and promoted sustainable water management",
      category: "national",
      likes: 4180,
      dateAdded: "2024-02-12",
      videoUrl: "https://www.youtube.com/embed/example8",
      videoDuration: "7:40",
      lesson: "Rainwater harvesting, water conservation",
      ecoPointsReward: 88,
      ecoCoinsReward: 22,
      isWatched: false,
      watchProgress: 0,
    },
    {
      id: "afroz-shah",
      name: "Afroz Shah",
      location: "Mumbai, Maharashtra",
      title: "Versova Beach Cleanup",
      story:
        "Afroz Shah initiated the world's largest beach cleanup at Versova Beach in Mumbai. His community-driven action inspired millions and showed how individual initiative can create massive environmental impact.",
      achievement:
        "Led world's largest beach cleanup removing 5000+ tons of waste",
      impact: "Inspired global beach cleanup movements and community action",
      category: "national",
      likes: 3890,
      dateAdded: "2024-02-15",
      videoUrl: "https://www.youtube.com/embed/example9",
      videoDuration: "5:55",
      lesson: "Waste management, community-driven action for cleaner cities",
      ecoPointsReward: 70,
      ecoCoinsReward: 17,
      isWatched: false,
      watchProgress: 0,
    },
    {
      id: "kailash-satyarthi",
      name: "Kailash Satyarthi",
      location: "New Delhi, India",
      title: "Environment & Child Rights Activist (Nobel Laureate)",
      story:
        "Nobel Peace Prize winner Kailash Satyarthi links environmental sustainability with social justice and education. His work shows how protecting children and the environment are interconnected global challenges.",
      achievement:
        "Nobel Peace Prize winner linking sustainability with social justice",
      impact:
        "Established connection between environmental protection and human rights",
      category: "national",
      likes: 5120,
      dateAdded: "2024-02-18",
      videoUrl: "https://www.youtube.com/embed/example10",
      videoDuration: "8:30",
      lesson: "Linking sustainability with social justice & education",
      ecoPointsReward: 105,
      ecoCoinsReward: 26,
      isWatched: false,
      watchProgress: 0,
    },
    // Local Heroes
    {
      id: "priya-sharma",
      name: "Priya Sharma",
      age: 16,
      location: "Mumbai, Maharashtra",
      title: "Plastic-Free Campus Champion",
      story:
        "Priya noticed the huge amount of plastic waste in her school cafeteria. She started a campaign to replace all single-use plastics with biodegradable alternatives. Within 6 months, her school became completely plastic-free!",
      achievement: "Eliminated 500kg of plastic waste monthly from her school",
      impact: "Her model is now adopted by 15 other schools in Mumbai",
      category: "local",
      likes: 245,
      dateAdded: "2024-01-15",
    },
    {
      id: "arjun-patel",
      name: "Arjun Patel",
      age: 14,
      location: "Ahmedabad, Gujarat",
      title: "Solar Energy Pioneer",
      story:
        "When frequent power cuts affected his studies, Arjun learned about solar energy. He convinced his school to install solar panels and now teaches other students about renewable energy through workshops.",
      achievement: "Helped install 50kW solar system saving 2000 units monthly",
      impact: "Trained over 200 students in solar energy basics",
      category: "local",
      likes: 189,
      dateAdded: "2024-02-08",
    },
    // Global Leaders
    {
      id: "greta-thunberg",
      name: "Greta Thunberg",
      location: "Stockholm, Sweden",
      title: "Global Climate Activist",
      story:
        "At just 15, Greta started skipping school on Fridays to protest climate inaction. Her solo protest grew into a global movement inspiring millions of young people worldwide to demand climate action.",
      achievement: "Inspired 6 million+ young climate activists globally",
      impact: "Led to climate emergency declarations in multiple countries",
      category: "global",
      likes: 5420,
      dateAdded: "2024-02-01",
    },
    {
      id: "wangari-maathai",
      name: "Wangari Maathai",
      location: "Nairobi, Kenya",
      title: "Tree Planting Pioneer",
      story:
        "Nobel Peace Prize winner Wangari Maathai founded the Green Belt Movement, empowering women to plant trees and fight deforestation while improving their livelihoods.",
      achievement: "Led to planting of 51 million trees across Kenya",
      impact: "Restored degraded landscapes and empowered 30,000+ women",
      category: "global",
      likes: 3890,
      dateAdded: "2024-01-28",
    },
  ];

  const categories = [
    { id: "local" as const, label: "Local Heroes", icon: User },
    { id: "national" as const, label: "National Icons", icon: BookOpen },
    { id: "global" as const, label: "Global Leaders", icon: User },
  ];

  const filteredStories = ecoHeroes.filter(
    (hero) => hero.category === activeCategory
  );
  const currentStory = filteredStories[currentStoryIndex] || filteredStories[0];

  const nextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % filteredStories.length);
  };

  const prevStory = () => {
    setCurrentStoryIndex(
      (prev) => (prev - 1 + filteredStories.length) % filteredStories.length
    );
  };

  const handleVideoProgress = (heroId: string, progress: number) => {
    setVideoProgress((prev) => ({ ...prev, [heroId]: progress }));

    // Mark as watched when progress reaches 90%
    if (progress >= 90 && !watchedVideos.has(heroId)) {
      setWatchedVideos((prev) => new Set([...prev, heroId]));
    }
  };

  const handleVideoComplete = (heroId: string) => {
    setWatchedVideos((prev) => new Set([...prev, heroId]));
  };

  const getTotalRewards = () => {
    return ecoHeroes
      .filter((hero) => hero.category === "national" && hero.ecoPointsReward)
      .reduce((total, hero) => total + (hero.ecoPointsReward || 0), 0);
  };

  const getWatchedRewards = () => {
    return ecoHeroes
      .filter(
        (hero) =>
          hero.category === "national" &&
          hero.ecoPointsReward &&
          watchedVideos.has(hero.id)
      )
      .reduce((total, hero) => total + (hero.ecoPointsReward || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-eco mb-2">
          Eco Heroes
        </h2>
        <p className="text-muted-foreground">
          Be inspired by real changemakers who are making a difference for our
          planet
        </p>
      </div>

      {/* Rewards Summary for National Heroes */}
      {activeCategory === "national" && (
        <Card className="card-eco bg-gradient-to-r from-primary/5 to-primary-glow/5">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                <Award className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  National Heroes Rewards
                </h3>
                <p className="text-sm text-muted-foreground">
                  Watch videos to earn eco points and coins
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gradient-eco">
                {getWatchedRewards()}/{getTotalRewards()}
              </div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </div>
          </div>
          <Progress
            value={(getWatchedRewards() / getTotalRewards()) * 100}
            className="mx-4 mb-4"
          />
        </Card>
      )}

      {/* Category Tabs */}
      <div className="flex justify-center">
        <div className="flex gap-2 bg-card/50 p-2 rounded-2xl backdrop-blur-sm">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "ghost"}
              className={`flex items-center gap-2 rounded-xl transition-all duration-200 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-eco"
                  : "hover:bg-primary/10 hover:text-primary hover:shadow-sm"
              }`}
              onClick={() => {
                setActiveCategory(category.id);
                setCurrentStoryIndex(0);
              }}
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Story */}
      {currentStory && (
        <Card className="card-eco">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Story of the Day
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStory}
                disabled={filteredStories.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {currentStoryIndex + 1} of {filteredStories.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextStory}
                disabled={filteredStories.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Hero Profile */}
            <div className="space-y-4">
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-3 ring-2 ring-primary/20">
                  <AvatarImage src={currentStory.avatar} />
                  <AvatarFallback className="text-lg font-bold">
                    {currentStory.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h4 className="text-lg font-bold text-gradient-eco">
                  {currentStory.name}
                </h4>
                {currentStory.age && (
                  <p className="text-sm text-muted-foreground">
                    Age: {currentStory.age}
                  </p>
                )}
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {currentStory.location}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {currentStory.title}
                </Badge>

                {/* Rewards Badge for National Heroes */}
                {currentStory.category === "national" &&
                  currentStory.ecoPointsReward && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">
                          Rewards
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-bold text-gradient-eco">
                            {currentStory.ecoPointsReward}
                          </div>
                          <div className="text-muted-foreground">
                            Eco Points
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-gradient-water">
                            {currentStory.ecoCoinsReward}
                          </div>
                          <div className="text-muted-foreground">Eco Coins</div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Story Content */}
            <div className="md:col-span-2 space-y-4">
              {/* Video Section for National Heroes */}
              {currentStory.category === "national" &&
                currentStory.videoUrl &&
                currentStory.lesson && (
                  <VideoTemplate
                    videoUrl={currentStory.videoUrl}
                    title={currentStory.title}
                    duration={currentStory.videoDuration || "5:00"}
                    lesson={currentStory.lesson}
                    ecoPointsReward={currentStory.ecoPointsReward || 0}
                    ecoCoinsReward={currentStory.ecoCoinsReward || 0}
                    onVideoComplete={() => handleVideoComplete(currentStory.id)}
                    onProgressUpdate={(progress) =>
                      handleVideoProgress(currentStory.id, progress)
                    }
                  />
                )}

              <div>
                <h5 className="font-semibold mb-2 text-primary">The Story</h5>
                <p className="text-muted-foreground leading-relaxed">
                  {currentStory.story}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h6 className="font-semibold mb-1 text-success">
                    Key Achievement
                  </h6>
                  <p className="text-sm text-muted-foreground">
                    {currentStory.achievement}
                  </p>
                </div>
                <div>
                  <h6 className="font-semibold mb-1 text-accent">
                    Impact Created
                  </h6>
                  <p className="text-sm text-muted-foreground">
                    {currentStory.impact}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(currentStory.dateAdded).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    {currentStory.likes} likes
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                  Share Story
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* All Stories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStories.map((hero, index) => (
          <Card
            key={hero.id}
            className={`card-eco cursor-pointer transition-all duration-200 ${
              index === currentStoryIndex ? "ring-2 ring-primary/30" : ""
            }`}
            onClick={() => setCurrentStoryIndex(index)}
          >
            <div className="text-center mb-3">
              <Avatar className="h-12 w-12 mx-auto mb-2">
                <AvatarFallback className="text-sm">
                  {hero.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h4 className="font-semibold text-sm text-gradient-eco">
                {hero.name}
              </h4>
              <p className="text-xs text-muted-foreground">{hero.location}</p>
            </div>

            <Badge
              variant="outline"
              className="text-xs mb-2 w-full justify-center"
            >
              {hero.title}
            </Badge>

            {/* Video Indicator for National Heroes */}
            {hero.category === "national" && hero.videoUrl && (
              <div className="flex items-center justify-center gap-1 mb-2">
                <Video className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary">Video Available</span>
                {watchedVideos.has(hero.id) && (
                  <Badge
                    variant="secondary"
                    className="bg-success/10 text-success text-xs"
                  >
                    <Star className="h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
              {hero.story.substring(0, 100)}...
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-red-500" />
                {hero.likes}
              </div>
              <span>{hero.category}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Inspiration CTA */}
      <Card className="card-eco text-center bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <div className="py-6">
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4 animate-glow" />
          <h3 className="text-xl font-bold text-gradient-eco mb-2">
            Be the Next Eco Hero!
          </h3>
          <p className="text-muted-foreground mb-4">
            Every great change starts with a single person. Share your own
            eco-story and inspire others!
          </p>
          <Button className="btn-eco">Share Your Story</Button>
        </div>
      </Card>
    </div>
  );
};

export default EcoStories;
