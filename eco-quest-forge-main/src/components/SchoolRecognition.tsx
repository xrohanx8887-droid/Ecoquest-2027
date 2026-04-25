import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { School, Trophy, TrendingUp, MapPin, Users, Gift } from 'lucide-react';

const SchoolRecognition = () => {
  const topSchools = [
    {
      id: '1',
      name: 'Delhi Public School, R.K. Puram',
      location: 'New Delhi',
      totalPoints: 125420,
      totalActions: 2891,
      rank: 1,
      badges: ['Most Active Green School', 'Plastic Free Champion']
    },
    {
      id: '2', 
      name: 'Kendriya Vidyalaya, Pune',
      location: 'Pune, Maharashtra',
      totalPoints: 98750,
      totalActions: 2234,
      rank: 2,
      badges: ['Water Conservation Hero']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient-eco mb-2">School Recognition</h2>
        <p className="text-muted-foreground">
          Celebrating schools driving environmental change across India
        </p>
      </div>

      {/* National Impact */}
      <Card className="card-eco bg-gradient-to-r from-primary/10 to-primary-glow/10">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            This Month's Collective Impact
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">1,247</div>
            <p className="text-sm text-muted-foreground">Trees Planted</p>
          </div>
          <div className="text-center p-4 bg-white/50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">2,340</div>
            <p className="text-sm text-muted-foreground">Kg Waste Recycled</p>
          </div>
          <div className="text-center p-4 bg-white/50 rounded-xl">
            <div className="text-2xl font-bold text-cyan-600">15,678</div>
            <p className="text-sm text-muted-foreground">Liters Water Saved</p>
          </div>
          <div className="text-center p-4 bg-white/50 rounded-xl">
            <div className="text-2xl font-bold text-yellow-600">892</div>
            <p className="text-sm text-muted-foreground">kWh Energy Saved</p>
          </div>
        </div>
      </Card>

      {/* Top Schools */}
      <Card className="card-eco">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <School className="h-5 w-5 text-primary" />
          Top Schools This Month
        </h3>
        <div className="space-y-4">
          {topSchools.map((school) => (
            <div key={school.id} className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary-glow/5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gradient-eco">{school.name}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {school.location}
                  </p>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900">
                  Rank #{school.rank}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{school.totalPoints.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-success">{school.totalActions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Eco Actions</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {school.badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    🏆 {badge}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SchoolRecognition;