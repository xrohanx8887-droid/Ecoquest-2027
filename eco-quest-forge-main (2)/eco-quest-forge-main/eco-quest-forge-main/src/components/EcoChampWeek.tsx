import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Crown, Star, TrendingUp, Calendar, Award, Sparkles, Users } from 'lucide-react';

interface ChampData {
  id: string;
  name: string;
  grade: string;
  school: string;
  avatar?: string;
  weeklyPoints: number;
  totalActions: number;
  streak: number;
  topAchievement: string;
  category: string;
  previousRank?: number;
}

const EcoChampWeek = () => {
  const currentWeek = "September 19-25, 2025";
  
  const weeklyChamps: ChampData[] = [
    {
      id: '1',
      name: 'Aarav Gupta',
      grade: '8th Grade',
      school: 'Delhi Public School',
      weeklyPoints: 485,
      totalActions: 12,
      streak: 7,
      topAchievement: 'Planted 8 trees in school garden',
      category: 'Environmental Action',
      previousRank: 3
    },
    {
      id: '2',
      name: 'Diya Sharma',
      grade: '9th Grade', 
      school: 'Kendriya Vidyalaya',
      weeklyPoints: 420,
      totalActions: 10,
      streak: 6,
      topAchievement: 'Led plastic-free lunch campaign',
      category: 'Waste Reduction',
      previousRank: 1
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Award className="h-6 w-6 text-gray-400" />;
      case 3: return <Trophy className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-eco mb-2">Eco Champ of the Week</h2>
        <p className="text-muted-foreground mb-2">
          Celebrating outstanding environmental leaders making real impact
        </p>
        <Badge variant="outline" className="text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          Week of {currentWeek}
        </Badge>
      </div>

      {/* Champion Podium */}
      <Card className="card-eco">
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {weeklyChamps.slice(0, 2).map((champ, index) => {
            const rank = index + 1;
            
            return (
              <Card
                key={champ.id}
                className={`p-6 text-center ${
                  rank === 1 
                    ? 'bg-gradient-to-b from-yellow-50 to-orange-50 border-yellow-200' 
                    : 'bg-gradient-to-b from-gray-50 to-blue-50 border-gray-200'
                }`}
              >
                <div className="flex justify-center mb-4">
                  {getRankIcon(rank)}
                </div>

                <Avatar className="h-16 w-16 mx-auto mb-4 ring-2 ring-primary/20">
                  <AvatarFallback className="text-lg font-bold">
                    {champ.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <h4 className="font-bold text-gradient-eco text-lg">{champ.name}</h4>
                  <p className="text-sm text-muted-foreground">{champ.grade} • {champ.school}</p>
                  <div className="text-2xl font-bold text-primary">{champ.weeklyPoints}</div>
                  <p className="text-xs text-muted-foreground">points this week</p>
                  <div className="mt-3 p-2 bg-white/50 rounded-lg">
                    <p className="text-xs font-medium text-primary">{champ.topAchievement}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Your Progress */}
      <Card className="card-eco bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <div className="text-center py-6">
          <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gradient-eco mb-2">Your Progress This Week</h3>
          <div className="text-3xl font-bold text-primary mb-2">247 points</div>
          <p className="text-muted-foreground mb-4">
            You're currently ranked #8 • Keep going to reach top 5!
          </p>
          <Button className="btn-eco">
            Complete Eco Action
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EcoChampWeek;