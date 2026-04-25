import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Clock,
  Award,
  Star,
  Leaf,
} from "lucide-react";

interface VideoTemplateProps {
  videoUrl: string;
  title: string;
  duration: string;
  lesson: string;
  ecoPointsReward: number;
  ecoCoinsReward: number;
  onVideoComplete: () => void;
  onProgressUpdate: (progress: number) => void;
}

const VideoTemplate = ({
  videoUrl,
  title,
  duration,
  lesson,
  ecoPointsReward,
  ecoCoinsReward,
  onVideoComplete,
  onProgressUpdate,
}: VideoTemplateProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Simulate video progress for demo purposes
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1;
          onProgressUpdate(newProgress);

          if (newProgress >= 90 && !isCompleted) {
            setIsCompleted(true);
            onVideoComplete();
          }

          return newProgress;
        });
      }, 1000); // Update every second
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, progress, isCompleted, onVideoComplete, onProgressUpdate]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    setProgress(Math.min(100, Math.max(0, newProgress)));
    onProgressUpdate(Math.min(100, Math.max(0, newProgress)));
  };

  return (
    <Card className="card-eco">
      <div className="space-y-4">
        {/* Video Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{duration}</span>
            {isCompleted && (
              <Badge variant="secondary" className="bg-success/10 text-success">
                <Star className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Video Player */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          {/* Placeholder for video - in real app, this would be an actual video player */}
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl mb-4">🎥</div>
              <div className="text-lg font-semibold mb-2">Hero Video</div>
              <div className="text-sm text-gray-300">
                Click play to start watching
              </div>
            </div>
          </div>

          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              <div className="flex-1 text-white text-sm">
                {formatTime(currentTime)} / {duration}
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Rewards Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-primary flex items-center gap-2">
              <Award className="h-5 w-5" />
              Rewards for Watching
            </h4>
            {isCompleted && (
              <Badge variant="secondary" className="bg-success/10 text-success">
                <Star className="h-3 w-3 mr-1" />
                Earned!
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient-eco">
                {ecoPointsReward}
              </div>
              <div className="text-sm text-muted-foreground">Eco Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gradient-water">
                {ecoCoinsReward}
              </div>
              <div className="text-sm text-muted-foreground">Eco Coins</div>
            </div>
          </div>
        </div>

        {/* Lesson Section */}
        <div className="bg-gradient-to-r from-success/10 to-success-glow/10 rounded-lg p-4 border border-success/20">
          <h4 className="font-semibold text-success mb-2 flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Key Lesson
          </h4>
          <p className="text-sm text-muted-foreground">{lesson}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            className="flex-1 btn-eco"
            onClick={togglePlay}
            disabled={isCompleted}
          >
            {isPlaying ? "Pause" : "Play"} Video
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onProgressUpdate(100)}
            disabled={isCompleted}
          >
            Mark Complete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VideoTemplate;

