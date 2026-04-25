import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star, Zap, Droplets, TreePine, Recycle, Target } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate?: string;
}

const AchievementBadges = () => {
  const achievements: Achievement[] = [
    {
      id: 'first-tree',
      name: 'Green Thumb',
      description: 'Plant your first tree',
      icon: TreePine,
      earned: true,
      rarity: 'common',
      earnedDate: '2024-01-15'
    },
    {
      id: 'water-saver',
      name: 'Water Guardian',
      description: 'Save 100 liters of water',
      icon: Droplets,
      earned: true,
      rarity: 'rare',
      earnedDate: '2024-01-20'
    },
    {
      id: 'recycling-hero',
      name: 'Recycling Champion',
      description: 'Recycle 50kg of waste',
      icon: Recycle,
      earned: false,
      progress: 45,
      maxProgress: 50,
      rarity: 'epic'
    },
    {
      id: 'energy-master',
      name: 'Energy Saver',
      description: 'Conserve 200 kWh of energy',
      icon: Zap,
      earned: false,
      progress: 80,
      maxProgress: 200,
      rarity: 'rare'
    },
    {
      id: 'streak-master',
      name: 'Consistency King',
      description: 'Maintain a 30-day streak',
      icon: Target,
      earned: false,
      progress: 12,
      maxProgress: 30,
      rarity: 'epic'
    },
    {
      id: 'eco-legend',
      name: 'Eco Legend',
      description: 'Complete all environmental challenges',
      icon: Trophy,
      earned: false,
      rarity: 'legendary'
    }
  ];

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gradient-to-r from-muted to-muted-foreground/20';
      case 'rare':
        return 'bg-gradient-to-r from-primary to-primary-glow';
      case 'epic':
        return 'bg-gradient-to-r from-accent to-primary-glow';
      case 'legendary':
        return 'bg-gradient-to-r from-warning to-destructive';
      default:
        return 'bg-gradient-to-r from-muted to-muted-foreground/20';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-2 border-muted';
      case 'rare':
        return 'border-2 border-primary';
      case 'epic':
        return 'border-2 border-accent';
      case 'legendary':
        return 'border-2 border-warning';
      default:
        return 'border-2 border-muted';
    }
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const inProgressAchievements = achievements.filter(a => !a.earned && a.progress !== undefined);
  const lockedAchievements = achievements.filter(a => !a.earned && a.progress === undefined);

  return (
    <Card className="card-eco">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Achievement Badges
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div>🏆 {earnedAchievements.length} Earned</div>
          <div>⏳ {inProgressAchievements.length} In Progress</div>
          <div>🔒 {lockedAchievements.length} Locked</div>
        </div>
      </div>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-success">🏆 Earned Badges</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`relative p-4 rounded-xl text-center ${getRarityBorder(achievement.rarity)} bg-gradient-to-b from-card to-card/50 hover:scale-105 transition-transform duration-200 cursor-pointer`}
              >
                {/* Glow effect for earned badges */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-primary-glow/10 animate-glow" />
                
                <div className="relative z-10">
                  <div className={`h-12 w-12 rounded-full ${getRarityStyle(achievement.rarity)} p-0.5 mx-auto mb-2`}>
                    <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                      <achievement.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h5 className="font-semibold text-xs mb-1">{achievement.name}</h5>
                  <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {achievement.rarity}
                  </Badge>
                  {achievement.earnedDate && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(achievement.earnedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In Progress Achievements */}
      {inProgressAchievements.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-warning">⏳ In Progress</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl ${getRarityBorder(achievement.rarity)} bg-gradient-to-b from-card to-card/50 hover:scale-105 transition-transform duration-200`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-10 w-10 rounded-full ${getRarityStyle(achievement.rarity)} p-0.5`}>
                    <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                      <achievement.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm">{achievement.name}</h5>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {achievement.rarity}
                  </Badge>
                </div>
                
                {achievement.progress !== undefined && achievement.maxProgress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{achievement.progress} / {achievement.maxProgress}</span>
                    </div>
                    <div className="progress-eco">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 text-muted-foreground">🔒 Locked Badges</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {lockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-3 rounded-xl border-2 border-dashed border-muted bg-muted/20 text-center opacity-60"
              >
                <div className="h-8 w-8 rounded-full bg-muted mx-auto mb-2 flex items-center justify-center">
                  <achievement.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <h5 className="font-semibold text-xs mb-1">{achievement.name}</h5>
                <Badge variant="outline" className="text-xs">
                  {achievement.rarity}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default AchievementBadges;