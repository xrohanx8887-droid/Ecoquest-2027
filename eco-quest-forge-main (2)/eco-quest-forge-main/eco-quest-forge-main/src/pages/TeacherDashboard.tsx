import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  BarChart as ReBarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  LineChart as ReLineChart,
  Line,
  AreaChart as ReAreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  RadarChart as ReRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart as ReRadialBarChart,
  RadialBar,
  ScatterChart as ReScatterChart,
  Scatter,
  ComposedChart as ReComposedChart,
  ReferenceLine,
  Brush,
} from "recharts";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Megaphone,
  GraduationCap,
  BarChart3,
  Calendar,
  Plus,
  LogOut,
  Target,
  Download,
  Award,
  FolderPlus,
  ShieldCheck,
  Trophy,
  Share2,
  Bell,
  MessageSquare,
  Leaf,
  Cloud,
  Droplet,
  Upload,
  File as FileIcon,
  Youtube,
  Link2,
  BookOpen,
  Play,
  TrendingUp,
} from "lucide-react";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const API_URL = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:3001';
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "classes"
    | "submissions"
    | "announcements"
    | "reports"
    | "progress"
    | "content"
    | "drives"
    | "leaderboards"
    | "collab"
    | "alerts"
  >(
    "overview"
  );
  // Demo defaults (used for initial UI and offline fallback)
  const demoClasses = [
    { id: "c1", name: "Class 8C", students: 36, weeklyEcoActions: 124 },
    { id: "c2", name: "Class 9B", students: 32, weeklyEcoActions: 108 },
    { id: "c3", name: "Class 10A", students: 34, weeklyEcoActions: 156 },
  ];
  const demoSubs = [
    { id: "s1", student: "Aarav Gupta", class: "Class 8C", action: "Planted 2 trees", points: 50, date: "2025-09-20" },
    { id: "s2", student: "Ishika", class: "Class 10A", action: "Recycled 5kg paper", points: 30, date: "2025-09-21" },
    { id: "s3", student: "Vicky", class: "Class 9B", action: "Saved 100L water", points: 25, date: "2025-09-22" },
  ];
  const demoAnns = [
    { id: "a1", title: "Cleanliness Drive on Saturday", message: "Join us for a campus clean-up at 8 AM.", date: "2025-09-27" },
    { id: "a2", title: "Water Conservation Seminar", message: "Guest talk on saving water this Wednesday.", date: "2025-09-24" },
  ];
  // Data state (start with demo; server will override if available)
  const [classes, setClasses] = useState<Array<{ id: string; name: string; students: number; weeklyEcoActions: number }>>(demoClasses);
  const [pendingSubmissions, setPendingSubmissions] = useState<Array<{ id: string; student: string; class: string; action: string; points: number; date: string }>>(demoSubs);
  const [loading, setLoading] = useState(true);

  // Announcement form state
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");
  const [annDate, setAnnDate] = useState("");

  // Create Class dialog state
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  // Class analytics dialog state
  const [showClassAnalytics, setShowClassAnalytics] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{ id: string; name: string; students: number; weeklyEcoActions: number } | null>(null);

  // Chart data state
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const classPalette = ["#22c55e", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"];
  const [selectedChartClass, setSelectedChartClass] = useState<string>("All Classes");
  const [weeksToShow, setWeeksToShow] = useState<number>(6);

  // Announcements state
  const [annList, setAnnList] = useState<Array<{ id: string; title: string; message: string; date: string }>>(demoAnns);

  // Review dialog state for eco-action verification with remarks
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewRemarks, setReviewRemarks] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<
    { id: string; student: string; class: string; action: string; points: number; date: string } | null
  >(null);
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Content management state (demo local storage)
  const [contentItems, setContentItems] = useState<Array<{
    id: string;
    type: "module" | "quiz" | "challenge" | "mission" | "task" | "resource" | "video" | "article";
    title: string;
    details?: string;
    class?: string;
    date?: string;
    points?: number;
    url?: string;
    topic?: string;
    ext?: string;
  }>>([]);
  const [newContent, setNewContent] = useState({
    moduleTitle: "",
    quizTitle: "",
    quizQuestions: 10,
    challengeTitle: "",
    challengePoints: 50,
    missionTitle: "",
    missionDate: "",
    missionClass: "",
    taskTitle: "",
    taskClass: "",
    resourceTitle: "",
    resourceTopic: "",
    resourceClass: "",
    resourceFile: null as File | null,
    videoTitle: "",
    videoUrl: "",
    videoClass: "",
    videoTopic: "",
    articleTitle: "",
    articleUrl: "",
    articleClass: "",
    articleTopic: "",
  });

  // Community & Drives (demo)
  const [drives, setDrives] = useState<Array<{
    id: string;
    title: string;
    date: string;
    status: "pending" | "approved" | "completed";
    participants: number;
    bonusPoints?: number;
  }>>([
    { id: "d1", title: "Campus Clean-up", date: "2025-10-05", status: "pending", participants: 0 },
    { id: "d2", title: "E-Waste Collection Drive", date: "2025-10-12", status: "approved", participants: 34, bonusPoints: 20 },
  ]);

  // Alerts & Communication (demo)
  const [teacherAlerts, setTeacherAlerts] = useState<Array<{ id: string; title: string; message: string; date: string; class?: string }>>([
    { id: "al1", title: "Air Quality Alert", message: "Wear masks due to high AQI.", date: new Date().toISOString().slice(0,10) },
  ]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const token = localStorage.getItem('ecolearn_token');
      try {
        if (!token) throw new Error('No token');
        // Fetch classes
        const clsRes = await fetch(`${API_URL}/api/teacher/classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (clsRes.ok) {
          const data = await clsRes.json();
          if (data?.success && Array.isArray(data.classes)) {
            setClasses(data.classes);
          } else {
            setClasses(demoClasses);
          }
        } else {
          setClasses(demoClasses);
        }

        // Fetch pending submissions
        const subRes = await fetch(`${API_URL}/api/teacher/submissions?status=pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (subRes.ok) {
          const data = await subRes.json();
          if (data?.success && Array.isArray(data.submissions)) {
            const mapped = data.submissions.map((s: any) => ({
              id: s.id,
              student: s.student,
              class: s.class,
              action: s.action,
              points: s.points,
              date: s.date,
            }));
            setPendingSubmissions(mapped);
          } else {
            setPendingSubmissions(demoSubs);
          }
        } else {
          setPendingSubmissions(demoSubs);
        }

        // Fetch announcements
        const annRes = await fetch(`${API_URL}/api/teacher/announcements`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (annRes.ok) {
          const data = await annRes.json();
          if (data?.success && Array.isArray(data.announcements)) {
            const mapped = data.announcements.map((a: any) => ({ id: a.id, title: a.title, message: a.message, date: a.date }));
            setAnnList(mapped);
          } else {
            setAnnList(demoAnns);
          }
        } else {
          setAnnList(demoAnns);
        }
      } catch {
        setClasses(demoClasses);
        setPendingSubmissions(demoSubs);
        setAnnList(demoAnns);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute analytics datasets whenever classes or submissions change
  useEffect(() => {
    const base = classes.length ? classes : demoClasses;
    const weeks = ["W1", "W2", "W3", "W4", "W5", "W6"];
    const factors = [0.6, 0.8, 1.0, 1.2, 0.9, 1.1];
    const wd = weeks.map((w, idx) => {
      const row: any = { week: w };
      base.forEach((c, ci) => {
        const key = c.name;
        const baseVal = c.weeklyEcoActions || 100 - ci * 10;
        row[key] = Math.max(5, Math.round(baseVal * factors[idx] * 0.6));
      });
      return row;
    });
    setWeeklyData(wd);

    const pending = pendingSubmissions.length || demoSubs.length;
    const totalThisWeek = base.reduce((acc, c) => acc + (c.weeklyEcoActions || 0), 0) || 388;
    const approved = Math.max(10, Math.round(Math.min(totalThisWeek, totalThisWeek * 0.65)));
    const rejected = Math.max(3, Math.round(Math.max(0, totalThisWeek - approved - pending) * 0.3));
    setStatusData([
      { status: "Approved", count: approved },
      { status: "Pending", count: pending },
      { status: "Rejected", count: rejected },
    ]);
  }, [classes, pendingSubmissions]);

  const classChartConfig = useMemo(() => {
    const base = classes.length ? classes : demoClasses;
    const list = selectedChartClass === "All Classes" ? base : base.filter((c) => c.name === selectedChartClass);
    const cfg: any = {};
    list.forEach((c, idx) => {
      cfg[c.name] = { label: c.name, color: classPalette[idx % classPalette.length] };
    });
    return cfg;
  }, [classes, selectedChartClass]);

  const statusChartConfig = useMemo(() => ({
    Approved: { label: "Approved", color: "#22c55e" },
    Pending: { label: "Pending", color: "#f59e0b" },
    Rejected: { label: "Rejected", color: "#ef4444" },
  }), []);

  const handleViewClass = (cls: { id: string; name: string; students: number; weeklyEcoActions: number }) => {
    setSelectedClass(cls);
    setShowClassAnalytics(true);
  };

  const displayedWeeklyData = useMemo(() => {
    const start = Math.max(0, weeklyData.length - weeksToShow);
    return weeklyData.slice(start);
  }, [weeklyData, weeksToShow]);

  const displayClasses = useMemo(() => {
    const base = classes.length ? classes : demoClasses;
    return selectedChartClass === "All Classes" ? base : base.filter((c) => c.name === selectedChartClass);
  }, [classes, selectedChartClass]);

  const exportClassesCSV = () => {
    const list = classes.length ? classes : demoClasses;
    const rows = [
      ["Class", "Students", "WeeklyEcoActions"],
      ...list.map((c) => [c.name, String(c.students), String(c.weeklyEcoActions)]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "class-analytics.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApprove = async (id: string) => {
    const token = localStorage.getItem('ecolearn_token');
    try {
      if (!token) throw new Error('No token');
      const res = await fetch(`${API_URL}/api/teacher/submissions/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPendingSubmissions((prev) => prev.filter((s) => s.id !== id));
        toast({ title: 'Approved', description: 'Submission has been approved.' });
      } else {
        toast({ title: 'Approve failed', description: 'Could not approve submission.', variant: 'destructive' });
      }
    } catch {
      // fallback: optimistic update
      setPendingSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleReject = async (id: string) => {
    const token = localStorage.getItem('ecolearn_token');
    try {
      if (!token) throw new Error('No token');
      const res = await fetch(`${API_URL}/api/teacher/submissions/${id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPendingSubmissions((prev) => prev.filter((s) => s.id !== id));
        toast({ title: 'Rejected', description: 'Submission has been rejected.' });
      } else {
        toast({ title: 'Reject failed', description: 'Could not reject submission.', variant: 'destructive' });
      }
    } catch {
      // fallback: optimistic update
      setPendingSubmissions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const ecoStats = useMemo(() => ({
    totalStudents: classes.reduce((acc, c) => acc + (c.students || 0), 0),
    weeklyActions: classes.reduce((acc, c) => acc + (c.weeklyEcoActions || 0), 0),
    approvedThisWeek: Math.max(0, 82 - pendingSubmissions.length),
    pendingApprovals: pendingSubmissions.length,
  }), [classes, pendingSubmissions.length]);

  // Impact conversions (demo multipliers)
  const impactStats = useMemo(() => {
    const totalActions = classes.reduce((acc, c) => acc + (c.weeklyEcoActions || 0), 0) || 0;
    const treesPlanted = Math.round(totalActions * 0.1); // ~1 tree per 10 actions
    const co2SavedKg = Math.round(totalActions * 0.5 * 10) / 10; // 0.5kg/action
    const waterSavedL = Math.round(totalActions * 2); // 2L/action
    return { treesPlanted, co2SavedKg, waterSavedL };
  }, [classes]);

  // Approve/Reject with optional remarks (used by Review dialog)
  const handleReviewDecision = async (
    id: string,
    decision: "approve" | "reject",
    remarks?: string
  ) => {
    const token = localStorage.getItem('ecolearn_token');
    try {
      if (!token) throw new Error('No token');
      const res = await fetch(`${API_URL}/api/teacher/submissions/${id}/${decision}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarks }),
      });
      if (res.ok) {
        setPendingSubmissions((prev) => prev.filter((s) => s.id !== id));
        toast({ title: decision === 'approve' ? 'Approved' : 'Rejected', description: remarks ? `Remarks: ${remarks}` : undefined });
      } else {
        toast({ title: `${decision === 'approve' ? 'Approve' : 'Reject'} failed`, description: 'Could not submit review.', variant: 'destructive' });
      }
    } catch {
      // fallback: optimistic update
      setPendingSubmissions((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setShowReviewDialog(false);
      setReviewRemarks("");
      setSelectedSubmission(null);
    }
  };

  const tabConfig = [
    { id: "overview" as const, label: "Dashboard", icon: Target, animation: "animate-ping" },
    { id: "classes" as const, label: "Classes", icon: Users, animation: "animate-float" },
    { id: "submissions" as const, label: "Submissions", icon: ClipboardList, animation: "animate-sparkle" },
    { id: "announcements" as const, label: "Announcements", icon: Megaphone, animation: "animate-breathe" },
    { id: "reports" as const, label: "Reports", icon: BarChart3, animation: "animate-pulse" },
    { id: "progress" as const, label: "Progress", icon: Award, animation: "animate-pulse" },
    { id: "content" as const, label: "Content", icon: FolderPlus, animation: "animate-float" },
    { id: "leaderboards" as const, label: "Leaderboards", icon: Trophy, animation: "animate-sparkle" },
  ];

  const Overview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Total Students</div>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold mt-2">{ecoStats.totalStudents}</div>
          <div className="text-xs text-muted-foreground">across your classes</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Weekly Eco Actions</div>
            <ClipboardList className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold mt-2">{ecoStats.weeklyActions}</div>
          <div className="text-xs text-muted-foreground">submitted this week</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Approved</div>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold mt-2">{ecoStats.approvedThisWeek}</div>
          <div className="text-xs text-muted-foreground">this week</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Pending Approvals</div>
            <XCircle className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold mt-2">{ecoStats.pendingApprovals}</div>
          <div className="text-xs text-muted-foreground">awaiting review</div>
        </Card>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Trees Planted (est.)</div>
            <Leaf className="h-4 w-4 text-green-700" />
          </div>
          <div className="text-2xl font-bold mt-2">{impactStats.treesPlanted}</div>
          <div className="text-xs text-muted-foreground">this month (from actions)</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">CO₂ Saved</div>
            <Cloud className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold mt-2">{impactStats.co2SavedKg} kg</div>
          <div className="text-xs text-muted-foreground">estimated this month</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Water Conserved</div>
            <Droplet className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold mt-2">{impactStats.waterSavedL} L</div>
          <div className="text-xs text-muted-foreground">estimated this month</div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Your Classes</h3>
          </div>
          <Button size="sm" className="btn-eco" onClick={() => setShowCreateClass(true)}><Plus className="h-4 w-4 mr-1" />Create Class</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {classes.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{c.name}</div>
                <Badge variant="secondary">{c.students} students</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Eco actions this week</div>
              <div className="text-xl font-bold">{c.weeklyEcoActions}</div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleViewClass(c)}>View</Button>
                <Button size="sm" className="btn-eco" onClick={() => setActiveTab("submissions")}>Manage</Button>
              </div>
            </Card>
          ))}
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Weekly Actions by Class</h4>
              <div className="flex items-center gap-2">
                <Select value={selectedChartClass} onValueChange={setSelectedChartClass}>
                  <SelectTrigger className="w-40 h-8">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Classes">All Classes</SelectItem>
                    {(classes.length ? classes : demoClasses).map((c) => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={String(weeksToShow)} onValueChange={(v) => setWeeksToShow(Number(v))}>
                  <SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">Last 6 weeks</SelectItem>
                    <SelectItem value="4">Last 4 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <ChartContainer config={classChartConfig} className="h-72 w-full">
              <ReBarChart data={displayedWeeklyData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                {displayClasses.map((c, idx) => (
                  <Bar key={c.id} dataKey={c.name} stackId={undefined} fill={classPalette[idx % classPalette.length]} radius={[6,6,0,0]} />
                ))}
                <ChartLegend content={<ChartLegendContent />} />
              </ReBarChart>
            </ChartContainer>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Review Status Distribution</h4>
            </div>
            <ChartContainer config={statusChartConfig} className="h-72 w-full">
              <ReBarChart data={statusData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="status" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={entry.status === 'Approved' ? '#22c55e' : entry.status === 'Pending' ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </ReBarChart>
            </ChartContainer>
          </Card>
        </div>
      </Card>
    </div>
  );

  // New placeholder tabs to be enhanced next
  const Progress = () => {
    const [filterClass, setFilterClass] = useState<string>("All Classes");
    const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");
    
    const classStats = useMemo(() => {
      const base = classes.length ? classes : demoClasses;
      return base.map(cls => ({
        ...cls,
        completionRate: 60 + Math.round(Math.random() * 35), // 60-95%
        avgEcoPoints: Math.floor(50 + Math.random() * 200),
        topBadge: ["Eco Champion", "Green Warrior", "Recycling Pro", "Water Saver"][Math.floor(Math.random() * 4)],
        trend: Math.random() > 0.5 ? 'up' : 'down',
        trendValue: Math.floor(5 + Math.random() * 15)
      }));
    }, [classes]);

    const filteredClasses = filterClass === "All Classes" 
      ? classStats 
      : classStats.filter(c => c.name === filterClass);

    const participationRate = useMemo(() => {
      const totalStudents = classes.reduce((acc, c) => acc + c.students, 0) || 1;
      const participants = Math.min(
        totalStudents, 
        Math.round((ecoStats.weeklyActions / Math.max(1, totalStudents * 4)) * totalStudents)
      );
      return Math.min(100, Math.round((participants / totalStudents) * 100));
    }, [classes, ecoStats.weeklyActions]);

    const getTrendIcon = (trend: string) => (
      trend === 'up' ? (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )
    );

    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Class Progress Overview</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="time-range" className="whitespace-nowrap">Time Range:</Label>
              <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="class-filter" className="whitespace-nowrap">Class:</Label>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Classes">All Classes</SelectItem>
                  {classStats.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Participation</div>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold mt-1">{participationRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {participationRate > 75 ? 'Excellent' : participationRate > 50 ? 'Good' : 'Needs improvement'}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Avg. EcoPoints</div>
              <Leaf className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold mt-1">
              {filteredClasses.reduce((sum, c) => sum + c.avgEcoPoints, 0) / (filteredClasses.length || 1).toFixed(0)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              per student
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Top Badge</div>
              <Award className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-lg font-bold mt-1 truncate">
              {filteredClasses[0]?.topBadge || 'Eco Champion'}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              Most earned badge
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Trend</div>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {filteredClasses[0]?.trendValue || 12}%
              </span>
              <span className={`flex items-center text-sm ${filteredClasses[0]?.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {getTrendIcon(filteredClasses[0]?.trend || 'up')}
                {filteredClasses[0]?.trend === 'up' ? 'Up' : 'Down'} from last period
              </span>
            </div>
          </Card>
        </div>

        {/* Class Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClasses.map((cls) => (
            <Card key={cls.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{cls.name}</h3>
                  <p className="text-sm text-muted-foreground">{cls.students} students</p>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  {cls.topBadge}
                </Badge>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion</span>
                  <span className="font-medium">{cls.completionRate}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      cls.completionRate > 80 ? 'bg-green-500' : 
                      cls.completionRate > 50 ? 'bg-blue-500' : 'bg-yellow-500'
                    }`} 
                    style={{ width: `${cls.completionRate}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Avg. EcoPoints</p>
                  <p className="font-semibold">{cls.avgEcoPoints}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Weekly Actions</p>
                  <p className="font-semibold">{cls.weeklyEcoActions}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <Button variant="outline" size="sm" className="w-full" onClick={() => {
                  setFilterClass(cls.name);
                  setActiveTab("classes");
                }}>
                  View Class Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Participation Graph */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Participation Over Time</h3>
            <div className="flex gap-2">
              {['Week', 'Month', 'Year'].map((period) => (
                <Button
                  key={period}
                  variant={timeRange === period.toLowerCase() ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(period.toLowerCase() as any)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
            <p className="text-muted-foreground">Participation chart will be displayed here</p>
          </div>
        </Card>
      </div>
    );
  };

  const Content = () => (
    <div className="space-y-4">
      {/* Class Resources: PDF/PPT/Docs */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2"><BookOpen className="h-5 w-5 text-primary"/><h3 className="text-lg font-semibold">Class Resources (PDF / PPT)</h3></div>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <Label>Title</Label>
            <Input placeholder="e.g., Climate Change Basics" value={newContent.resourceTitle} onChange={(e)=>setNewContent({...newContent, resourceTitle: e.target.value})} />
          </div>
          <div>
            <Label>Topic</Label>
            <Input placeholder="e.g., Greenhouse effect" value={newContent.resourceTopic} onChange={(e)=>setNewContent({...newContent, resourceTopic: e.target.value})} />
          </div>
          <div>
            <Label>Class</Label>
            <Select value={newContent.resourceClass} onValueChange={(v)=>setNewContent({...newContent, resourceClass: v})}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Select Class"/></SelectTrigger>
              <SelectContent>
                {(classes.length ? classes : demoClasses).map((c) => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3 mt-2 items-end">
          <div className="md:col-span-2">
            <Label>Upload File</Label>
            <Input type="file" accept=".pdf,.ppt,.pptx,.doc,.docx" onChange={(e)=>setNewContent({...newContent, resourceFile: e.target.files?.[0] || null})}/>
            <div className="text-[11px] text-muted-foreground mt-1">Accepted: PDF, PPT, PPTX, DOC, DOCX</div>
          </div>
          <div>
            <Button className="btn-eco w-full" onClick={() => {
              if(!newContent.resourceTitle || !newContent.resourceClass || !newContent.resourceFile){ return; }
              const f = newContent.resourceFile as File;
              const url = URL.createObjectURL(f);
              const ext = (f.name.split('.').pop() || '').toLowerCase();
              const item = { id: `res_${Date.now()}`, type: "resource" as const, title: newContent.resourceTitle, class: newContent.resourceClass, topic: newContent.resourceTopic || undefined, details: f.name, url, ext };
              setContentItems(prev => [item, ...prev]);
              setNewContent({ ...newContent, resourceTitle: "", resourceTopic: "", resourceClass: "", resourceFile: null });
              toast({ title: 'Resource added', description: 'Your file is ready to share with students.' });
            }}><Upload className="h-4 w-4 mr-1"/>Upload Resource</Button>
          </div>
        </div>
      </Card>

      {/* YouTube Videos */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2"><Youtube className="h-5 w-5 text-red-500"/><h3 className="text-lg font-semibold">Add YouTube Video</h3></div>
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <Label>Title</Label>
            <Input placeholder="e.g., How Recycling Works" value={newContent.videoTitle} onChange={(e)=>setNewContent({...newContent, videoTitle: e.target.value})}/>
          </div>
          <div className="md:col-span-2">
            <Label>YouTube URL</Label>
            <Input placeholder="https://youtu.be/xyz or https://www.youtube.com/watch?v=..." value={newContent.videoUrl} onChange={(e)=>setNewContent({...newContent, videoUrl: e.target.value})}/>
          </div>
          <div>
            <Label>Class</Label>
            <Select value={newContent.videoClass} onValueChange={(v)=>setNewContent({...newContent, videoClass: v})}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Select Class"/></SelectTrigger>
              <SelectContent>
                {(classes.length ? classes : demoClasses).map((c) => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-3 mt-2">
          <div className="md:col-span-3">
            <Label>Topic (optional)</Label>
            <Input placeholder="e.g., Recycling plastics" value={newContent.videoTopic} onChange={(e)=>setNewContent({...newContent, videoTopic: e.target.value})}/>
          </div>
          <div className="flex items-end">
            <Button className="btn-fun w-full" onClick={() => {
              if(!newContent.videoUrl || !newContent.videoClass){ return; }
              const idMatch = newContent.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
              const vid = idMatch?.[1];
              const embedUrl = vid ? `https://www.youtube.com/embed/${vid}` : newContent.videoUrl;
              const item = { id: `v_${Date.now()}`, type: "video" as const, title: newContent.videoTitle || 'YouTube Video', class: newContent.videoClass, topic: newContent.videoTopic || undefined, url: embedUrl };
              setContentItems(prev => [item, ...prev]);
              setNewContent({ ...newContent, videoTitle: "", videoUrl: "", videoClass: "", videoTopic: "" });
              toast({ title: 'Video added', description: 'Students can watch this video in the content section.' });
            }}><Play className="h-4 w-4 mr-1"/>Add Video</Button>
          </div>
        </div>
      </Card>

      {/* Articles & Links */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2"><Link2 className="h-5 w-5 text-fun-blue"/><h3 className="text-lg font-semibold">Add Article / Link</h3></div>
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <Label>Title</Label>
            <Input placeholder="e.g., National Mission on Clean Ganga" value={newContent.articleTitle} onChange={(e)=>setNewContent({...newContent, articleTitle: e.target.value})}/>
          </div>
          <div className="md:col-span-2">
            <Label>URL</Label>
            <Input placeholder="https://example.com/article" value={newContent.articleUrl} onChange={(e)=>setNewContent({...newContent, articleUrl: e.target.value})}/>
          </div>
          <div>
            <Label>Class</Label>
            <Select value={newContent.articleClass} onValueChange={(v)=>setNewContent({...newContent, articleClass: v})}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Select Class"/></SelectTrigger>
              <SelectContent>
                {(classes.length ? classes : demoClasses).map((c) => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-3 mt-2">
          <div className="md:col-span-3">
            <Label>Topic (optional)</Label>
            <Input placeholder="e.g., River conservation" value={newContent.articleTopic} onChange={(e)=>setNewContent({...newContent, articleTopic: e.target.value})}/>
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={() => {
              if(!newContent.articleUrl || !newContent.articleClass){ return; }
              const item = { id: `a_${Date.now()}`, type: "article" as const, title: newContent.articleTitle || 'Article', class: newContent.articleClass, topic: newContent.articleTopic || undefined, url: newContent.articleUrl };
              setContentItems(prev => [item, ...prev]);
              setNewContent({ ...newContent, articleTitle: "", articleUrl: "", articleClass: "", articleTopic: "" });
              toast({ title: 'Link added', description: 'Shared with selected class.' });
            }}><Link2 className="h-4 w-4 mr-1"/>Add Link</Button>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2"><FolderPlus className="h-5 w-5 text-primary"/><h3 className="text-lg font-semibold">Upload Learning Content</h3></div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label>Module Title</Label>
            <Input placeholder="e.g., Water Conservation 101" value={newContent.moduleTitle} onChange={(e)=>setNewContent({...newContent, moduleTitle: e.target.value})}/>
            <div className="mt-2 flex gap-2">
              <Button size="sm" className="btn-eco" onClick={() => {
                if(!newContent.moduleTitle) return;
                const item = { id: `m_${Date.now()}`, type: "module" as const, title: newContent.moduleTitle };
                setContentItems(prev => [item, ...prev]);
                setNewContent({ ...newContent, moduleTitle: "" });
                toast({ title: 'Module uploaded', description: 'Students will see it in Learn.' });
              }}>Add Module</Button>
            </div>
          </div>
          <div>
            <Label>Quiz Title</Label>
            <Input placeholder="e.g., Plastic-Free Quiz" value={newContent.quizTitle} onChange={(e)=>setNewContent({...newContent, quizTitle: e.target.value})}/>
            <div className="mt-2 flex gap-2 items-center">
              <Label className="text-xs">Questions</Label>
              <Input type="number" className="w-24 h-8" value={newContent.quizQuestions} onChange={(e)=>setNewContent({...newContent, quizQuestions: Number(e.target.value)})}/>
              <Button size="sm" variant="outline" onClick={() => {
                if(!newContent.quizTitle) return;
                const item = { id: `q_${Date.now()}`, type: "quiz" as const, title: newContent.quizTitle, details: `${newContent.quizQuestions} questions` };
                setContentItems(prev => [item, ...prev]);
                setNewContent({ ...newContent, quizTitle: "" });
              }}>Add Quiz</Button>
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2"><Target className="h-5 w-5 text-emerald-600"/><h3 className="text-lg font-semibold">Custom Eco-Challenges & Tasks</h3></div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label>Challenge Title</Label>
            <Input placeholder="e.g., Bring a cloth bag this week" value={newContent.challengeTitle} onChange={(e)=>setNewContent({...newContent, challengeTitle: e.target.value})}/>
            <div className="mt-2 flex gap-2 items-center">
              <Label className="text-xs">Points</Label>
              <Input type="number" className="w-24 h-8" value={newContent.challengePoints} onChange={(e)=>setNewContent({...newContent, challengePoints: Number(e.target.value)})}/>
              <Button size="sm" className="btn-eco" onClick={() => {
                if(!newContent.challengeTitle) return;
                const item = { id: `ch_${Date.now()}`, type: "challenge" as const, title: newContent.challengeTitle, points: newContent.challengePoints };
                setContentItems(prev => [item, ...prev]);
                setNewContent({ ...newContent, challengeTitle: "" });
              }}>Create Challenge</Button>
            </div>
          </div>
          <div>
            <Label>Assign Task (Homework-style)</Label>
            <Input placeholder="Task title e.g., 'Carry steel bottle'" value={newContent.taskTitle} onChange={(e)=>setNewContent({...newContent, taskTitle: e.target.value})}/>
            <div className="mt-2 flex gap-2">
              <Select value={newContent.taskClass} onValueChange={(v)=>setNewContent({...newContent, taskClass: v})}>
                <SelectTrigger className="w-48 h-8"><SelectValue placeholder="Select Class"/></SelectTrigger>
                <SelectContent>
                  {(classes.length ? classes : demoClasses).map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={() => {
                if(!newContent.taskTitle || !newContent.taskClass) return;
                const item = { id: `t_${Date.now()}`, type: "task" as const, title: newContent.taskTitle, class: newContent.taskClass };
                setContentItems(prev => [item, ...prev]);
                setNewContent({ ...newContent, taskTitle: "", taskClass: "" });
              }}>Assign Task</Button>
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2"><Calendar className="h-5 w-5 text-fun-blue"/><h3 className="text-lg font-semibold">Schedule Class Missions</h3></div>
        <div className="grid md:grid-cols-3 gap-3">
          <Input placeholder="Mission title e.g., 'Plastic-free week'" value={newContent.missionTitle} onChange={(e)=>setNewContent({...newContent, missionTitle: e.target.value})}/>
          <Input type="date" value={newContent.missionDate} onChange={(e)=>setNewContent({...newContent, missionDate: e.target.value})}/>
          <Select value={newContent.missionClass} onValueChange={(v)=>setNewContent({...newContent, missionClass: v})}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Select Class"/></SelectTrigger>
            <SelectContent>
              {(classes.length ? classes : demoClasses).map((c) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3">
          <Button className="btn-eco" onClick={() => {
            if(!newContent.missionTitle || !newContent.missionDate || !newContent.missionClass) return;
            const item = { id: `ms_${Date.now()}`, type: "mission" as const, title: newContent.missionTitle, class: newContent.missionClass, date: newContent.missionDate };
            setContentItems(prev => [item, ...prev]);
            setNewContent({ ...newContent, missionTitle: "", missionClass: "", missionDate: "" });
            toast({ title: 'Mission scheduled', description: 'Students will be notified.' });
          }}>Schedule Mission</Button>
        </div>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Your Content & Tasks</h3>
        {contentItems.length === 0 ? (
          <div className="text-sm text-muted-foreground">No content yet. Create modules, quizzes, resources, or challenges above.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {contentItems.map((it) => (
              <Card key={it.id} className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold flex items-center gap-2">
                    {it.type === 'resource' && <FileIcon className="h-4 w-4 text-primary"/>}
                    {it.type === 'video' && <Youtube className="h-4 w-4 text-red-500"/>}
                    {it.type === 'article' && <Link2 className="h-4 w-4 text-fun-blue"/>}
                    {['module','quiz','challenge','mission','task'].includes(it.type) && <FolderPlus className="h-4 w-4 text-emerald-600"/>}
                    {it.title}
                  </div>
                  <div className="flex items-center gap-2">
                    {it.class && <Badge variant="secondary">{it.class}</Badge>}
                    <Badge variant="outline">{it.type}</Badge>
                  </div>
                </div>
                {it.topic && <div className="text-xs text-muted-foreground">Topic: {it.topic}</div>}
                <div className="text-xs text-muted-foreground">{it.details || it.date || ''}</div>
                {it.type === 'video' && it.url?.includes('youtube') && (
                  <div className="mt-2 rounded-xl overflow-hidden">
                    <iframe src={it.url} title={it.title} className="w-full h-40" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                )}
                {(it.type === 'resource' || it.type === 'article') && it.url && (
                  <div className="mt-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(it.url!, '_blank')}>Open</Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  const Drives = () => (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/><h3 className="text-lg font-semibold">Approve / Post Eco-Drives</h3></div>
          <Button size="sm" variant="outline" onClick={() => setDrives(prev => [{ id: `d_${Date.now()}`, title: "New Drive", date: new Date().toISOString().slice(0,10), status: "pending", participants: 0 }, ...prev])}><Plus className="h-4 w-4"/>Add Drive</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drives.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.title}</TableCell>
                <TableCell>{new Date(d.date).toLocaleDateString?.() || d.date}</TableCell>
                <TableCell><Badge variant={d.status === 'approved' ? 'default' : d.status === 'completed' ? 'secondary' : 'outline'}>{d.status}</Badge></TableCell>
                <TableCell>{d.participants}</TableCell>
                <TableCell className="text-right space-x-2">
                  {d.status === 'pending' && (
                    <Button size="sm" className="btn-eco" onClick={() => setDrives(prev => prev.map(x => x.id === d.id ? { ...x, status: 'approved' } : x))}>Approve</Button>
                  )}
                  {d.status === 'approved' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setDrives(prev => prev.map(x => x.id === d.id ? { ...x, bonusPoints: (x.bonusPoints||10)+10 } : x))}>Bonus +10</Button>
                      <Button size="sm" variant="outline" onClick={() => setDrives(prev => prev.map(x => x.id === d.id ? { ...x, participants: x.participants + 5 } : x))}>+5 Participants</Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setDrives(prev => prev.filter(x => x.id !== d.id))}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  const Leaderboards = () => {
    const base = classes.length ? classes : demoClasses;
    const classRanking = [...base].sort((a,b) => (b.weeklyEcoActions||0)-(a.weeklyEcoActions||0));
    const topStudents = [
      { name: "Aarav Gupta", ecoPoints: 320 },
      { name: "Ishika", ecoPoints: 305 },
      { name: "Vicky", ecoPoints: 290 },
      { name: "Priya", ecoPoints: 272 },
      { name: "Rohan", ecoPoints: 261 },
    ];
    return (
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2"><Trophy className="h-5 w-5 text-primary"/><h3 className="text-lg font-semibold">EcoStars of the Week</h3></div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>EcoPoints</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topStudents.map((s) => (
                <TableRow key={s.name}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.ecoPoints}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2"><Trophy className="h-5 w-5 text-fun-purple"/><h3 className="text-lg font-semibold">Inter-class Competition</h3></div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Weekly Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classRanking.slice(0,5).map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.weeklyEcoActions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  };

  const Collab = () => (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Share2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Teacher Collaboration Hub</h3>
      </div>
      <div className="text-sm text-muted-foreground">
        Share modules and quizzes with other teachers and access curated eco-content.
      </div>
    </Card>
  );

  const Alerts = () => {
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertClass, setAlertClass] = useState("");
    return (
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2"><Bell className="h-5 w-5 text-primary"/><h3 className="text-lg font-semibold">Push Eco-Alerts</h3></div>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <Label>Title</Label>
              <Input placeholder="e.g., Local river clean-up this Sunday" value={alertTitle} onChange={(e)=>setAlertTitle(e.target.value)}/>
            </div>
            <div>
              <Label>Class (optional)</Label>
              <Select value={alertClass} onValueChange={setAlertClass}>
                <SelectTrigger className="h-9"><SelectValue placeholder="All Classes"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  {(classes.length ? classes : demoClasses).map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Label>Message</Label>
              <Textarea rows={4} placeholder="Write the alert..." value={alertMessage} onChange={(e)=>setAlertMessage(e.target.value)}/>
            </div>
          </div>
          <div className="mt-3">
            <Button className="btn-eco" onClick={() => {
              if(!alertTitle || !alertMessage) return;
              setTeacherAlerts(prev => [{ id: `al_${Date.now()}`, title: alertTitle, message: alertMessage, date: new Date().toISOString().slice(0,10), class: alertClass || undefined }, ...prev]);
              setAlertTitle(""); setAlertMessage(""); setAlertClass("");
              toast({ title: 'Alert sent', description: 'Students will receive the notification.' });
            }}>Send Alert</Button>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Recent Alerts</h3>
          {teacherAlerts.length === 0 ? (
            <div className="text-sm text-muted-foreground">No alerts yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teacherAlerts.map((a) => (
                <Card key={a.id} className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString?.() || a.date}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{a.class || 'All Classes'}</div>
                  <div className="text-sm mt-1">{a.message}</div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  };

  const Classes = () => (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Classes</h3>
        </div>
        <Button size="sm" className="btn-eco" onClick={() => setShowCreateClass(true)}><Plus className="h-4 w-4 mr-1" />Add Class</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Weekly Actions</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell>{c.students}</TableCell>
              <TableCell>{c.weeklyEcoActions}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" className="mr-2">View</Button>
                <Button size="sm" className="btn-eco">Manage</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>Manage classes, enroll students, and track performance.</TableCaption>
      </Table>
    </Card>
  );

  const Submissions = () => (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Pending Submissions</h3>
        </div>
        <div className="text-sm text-muted-foreground">Review and approve student eco-actions</div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Review</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingSubmissions.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8"><AvatarFallback>{s.student.split(' ').map(n=>n[0]).join('')}</AvatarFallback></Avatar>
                  <div className="font-medium">{s.student}</div>
                </div>
              </TableCell>
              <TableCell>{s.class}</TableCell>
              <TableCell>{s.action}</TableCell>
              <TableCell>{s.points}</TableCell>
              <TableCell>{new Date(s.date).toLocaleDateString?.() || s.date}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="mr-2" onClick={() => { setSelectedSubmission(s); setReviewRemarks(""); setShowReviewDialog(true); }}>
                  <MessageSquare className="h-4 w-4 mr-1"/>Review
                </Button>
                <Button size="sm" variant="outline" className="mr-2" onClick={() => handleReject(s.id)}><XCircle className="h-4 w-4 mr-1"/>Reject</Button>
                <Button size="sm" className="btn-eco" onClick={() => handleApprove(s.id)}><CheckCircle2 className="h-4 w-4 mr-1"/>Approve</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

  const Announcements = () => (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Post Announcement</h3>
      </div>
      <div className="grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g., Cleanliness Drive on Saturday" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Input id="date" type="date" value={annDate} onChange={(e) => setAnnDate(e.target.value)} />
              <Calendar className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Write your announcement..." rows={5} value={annMessage} onChange={(e) => setAnnMessage(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button className="btn-eco" onClick={async () => {
            const token = localStorage.getItem('ecolearn_token');
            try {
              if (!annTitle || !annMessage) {
                toast({ title: 'Missing info', description: 'Title and message are required.', variant: 'destructive' });
                return;
              }
              if (!token) throw new Error('No token');
              const res = await fetch(`${API_URL}/api/teacher/announcements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ title: annTitle, message: annMessage, date: annDate || undefined }),
              });
              if (res.ok) {
                const data = await res.json();
                if (data?.success && data?.announcement) {
                  setAnnList((prev) => [
                    { id: data.announcement.id, title: data.announcement.title, message: data.announcement.message, date: data.announcement.date },
                    ...prev,
                  ]);
                }
                setAnnTitle(""); setAnnMessage(""); setAnnDate("");
                toast({ title: 'Announcement published', description: 'Students will see it in their feed.' });
              } else {
                toast({ title: 'Publish failed', description: 'Could not create announcement.', variant: 'destructive' });
              }
            } catch {
              const localAnn = { id: `local_${Date.now()}`, title: annTitle, message: annMessage, date: annDate || new Date().toISOString().slice(0,10) };
              setAnnList((prev) => [localAnn, ...prev]);
              toast({ title: 'Offline mode', description: 'Saved locally (demo).', variant: 'default' });
              setAnnTitle(""); setAnnMessage(""); setAnnDate("");
            }
          }}><Megaphone className="h-4 w-4 mr-1"/>Publish</Button>
          <Button variant="outline">Save Draft</Button>
        </div>
      </div>
      {/* Existing Announcements */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-3">Existing Announcements</h3>
        {annList.length === 0 ? (
          <div className="text-sm text-muted-foreground">No announcements yet. Create your first one above.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {annList.map((a) => (
              <Card key={a.id} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString?.() || a.date}</div>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">{a.message}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  const Reports = () => {
    const base = classes.length ? classes : demoClasses;
    // Pie/Donut: class share of weekly actions
    const classShare = useMemo(
      () => base.map((c, idx) => ({ name: c.name, value: c.weeklyEcoActions || 0, color: classPalette[idx % classPalette.length] })),
      [classes]
    );

    // Weekly totals derived from stacked dataset
    const weeklyTotals = useMemo(() =>
      weeklyData.map((row) => {
        const total = Object.entries(row).reduce((acc, [k, v]) => (k === "week" ? acc : acc + (Number(v) || 0)), 0);
        const approved = Math.round(total * 0.65);
        const pending = Math.round(total * 0.2);
        const rejected = Math.max(0, total - approved - pending);
        return { week: (row as any).week, total, approved, pending, rejected };
      }),
    [weeklyData]);

    // Stacked area series list
    const areaSeries = useMemo(
      () => base.map((c, idx) => ({ key: c.name, color: classPalette[idx % classPalette.length] })),
      [classes]
    );

    // Radial bar: participation rate by class
    const participation = useMemo(
      () => base.map((c, idx) => ({ name: c.name, rate: Math.min(100, Math.round(((c.weeklyEcoActions || 0) / Math.max(1, (c.students || 1) * 4)) * 100)), fill: classPalette[idx % classPalette.length] })),
      [classes]
    );

    // Radar: normalized metrics
    const radarData = useMemo(() => {
      const maxActions = Math.max(...base.map(c => c.weeklyEcoActions || 0), 1);
      const maxStudents = Math.max(...base.map(c => c.students || 0), 1);
      return base.slice(0, 5).map((c) => ({
        subject: c.name,
        Actions: Math.round(((c.weeklyEcoActions || 0) / maxActions) * 100),
        Students: Math.round(((c.students || 0) / maxStudents) * 100),
        Intensity: Math.round(((c.weeklyEcoActions || 0) / Math.max(1, c.students || 1)) * 10),
      }));
    }, [classes]);

    // Histogram of weekly total buckets
    const histogram = useMemo(() => {
      const bins = [
        { bin: "0-99", min: 0, max: 99, count: 0 },
        { bin: "100-149", min: 100, max: 149, count: 0 },
        { bin: "150-199", min: 150, max: 199, count: 0 },
        { bin: "200-299", min: 200, max: 299, count: 0 },
        { bin: "300+", min: 300, max: Infinity, count: 0 },
      ];
      weeklyTotals.forEach((w) => {
        const b = bins.find(x => w.total >= x.min && w.total <= x.max);
        if (b) b.count += 1;
      });
      return bins;
    }, [weeklyTotals]);

    // Scatter: Students vs Actions
    const scatterData = useMemo(() => base.map((c, idx) => ({
      x: c.students || 0,
      y: c.weeklyEcoActions || 0,
      name: c.name,
      fill: classPalette[idx % classPalette.length],
    })), [classes]);

    const statusColors: Record<string, string> = { Approved: '#22c55e', Pending: '#f59e0b', Rejected: '#ef4444' };

    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* KPI header with CSV */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Weekly Overview</h3></div>
            <Button variant="outline" size="sm" onClick={exportClassesCSV}><Download className="h-4 w-4 mr-1"/>Export CSV</Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
            <div className="p-2 rounded-xl bg-muted/40">
              <div className="text-xs text-muted-foreground">Avg actions / student</div>
              <div className="text-xl font-semibold">4.2</div>
            </div>
            <div className="p-2 rounded-xl bg-muted/40">
              <div className="text-xs text-muted-foreground">Top Class</div>
              <div className="text-xl font-semibold">{[...base].sort((a,b)=> (b.weeklyEcoActions||0) - (a.weeklyEcoActions||0))[0]?.name || '-'}</div>
            </div>
            <div className="p-2 rounded-xl bg-muted/40">
              <div className="text-xs text-muted-foreground">GreenCoins</div>
              <div className="text-xl font-semibold">1,280</div>
            </div>
            <div className="p-2 rounded-xl bg-muted/40">
              <div className="text-xs text-muted-foreground">Pending</div>
              <div className="text-xl font-semibold">{pendingSubmissions.length}</div>
            </div>
          </div>
        </Card>

        {/* Class Share Pie/Donut */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Class Share of Weekly Actions</h3>
          <ChartContainer config={{}} className="h-72 w-full">
            <RePieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <Pie data={classShare} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
                {classShare.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </RePieChart>
          </ChartContainer>
        </Card>

        {/* Stacked Area trend */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Weekly Trend by Class</h3>
          <ChartContainer config={{}} className="h-72 w-full">
            <ReAreaChart data={weeklyData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {areaSeries.map((s) => (
                <Area key={s.key} type="monotone" dataKey={s.key} stackId="1" stroke={s.color} fill={s.color} fillOpacity={0.25} />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
              <Brush dataKey="week" height={14} stroke="#8884d8" />
            </ReAreaChart>
          </ChartContainer>
        </Card>

        {/* Actions flow: total vs approved */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Actions Flow (Total vs Approved)</h3>
          <ChartContainer config={{}} className="h-72 w-full">
            <ReComposedChart data={weeklyTotals} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="#06b6d4" radius={[6,6,0,0]} />
              <Line type="monotone" dataKey="approved" stroke="#22c55e" strokeWidth={2} dot={false} />
              <ReferenceLine y={Math.round(weeklyTotals.reduce((a,b)=>a+b.total,0)/Math.max(1,weeklyTotals.length))} stroke="#64748b" strokeDasharray="4 4" label="Avg" />
            </ReComposedChart>
          </ChartContainer>
        </Card>

        {/* Review status donut */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Review Status</h3>
          <ChartContainer config={{}} className="h-72 w-full">
            <RePieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
              <Pie data={statusData} dataKey="count" nameKey="status" innerRadius={60} outerRadius={90}>
                {statusData.map((s) => (
                  <Cell key={s.status} fill={statusColors[s.status]} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="status" />} />
            </RePieChart>
          </ChartContainer>
        </Card>

        {/* Participation radial bars */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Participation by Class</h3>
          <ChartContainer config={{}} className="h-72 w-full">
            <ReRadialBarChart innerRadius={20} outerRadius={120} data={participation} startAngle={90} endAngle={-270}>
              <RadialBar background dataKey="rate" cornerRadius={4} />
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            </ReRadialBarChart>
          </ChartContainer>
        </Card>

        {/* Radar comparison */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Class Performance Radar</h3>
          <ChartContainer config={{}} className="h-72 w-full">
            <ReRadarChart data={radarData} outerRadius={90}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Actions" dataKey="Actions" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
              <Radar name="Students" dataKey="Students" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
              <Radar name="Intensity" dataKey="Intensity" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
              <ChartLegend content={<ChartLegendContent />} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </ReRadarChart>
          </ChartContainer>
        </Card>

        {/* Histogram distribution */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Weekly Total Distribution</h3>
          <ChartContainer config={{}} className="h-72 w-full">
            <ReBarChart data={histogram}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="bin" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent nameKey="bin" />} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[6,6,0,0]} />
            </ReBarChart>
          </ChartContainer>
        </Card>

        {/* Scatter Students vs Actions */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Students vs Weekly Actions</h3>
          <ChartContainer config={{}} className="h-72 w-full">
            <ReScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Students" />
              <YAxis type="number" dataKey="y" name="Actions" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Scatter data={scatterData} fill="#06b6d4" />
            </ReScatterChart>
          </ChartContainer>
        </Card>

        {/* Impact summary card (text) */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Impact This Month</h3>
          <div className="text-sm text-muted-foreground">Visual impact dashboard</div>
          <div className="mt-3 space-y-2 text-sm">
            <div><span className="font-semibold">{ecoStats.totalStudents}</span> students = <span className="font-semibold">{impactStats.co2SavedKg} kg</span> CO₂ saved</div>
            <div><span className="font-semibold">{impactStats.treesPlanted}</span> trees planted (est.)</div>
            <div><span className="font-semibold">{impactStats.waterSavedL}</span> L water conserved</div>
          </div>
        </Card>
      </div>
    );
  };

  // Handle tab selection and close mobile menu
  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId as any);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative">
      {/* Mobile Header */}
      <header className="lg:hidden border-b bg-white/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </svg>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="h-full py-4 overflow-y-auto">
                  <div className="px-4 py-4 border-b">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-6 w-6 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Teacher Dashboard</div>
                        <div className="font-semibold">Welcome{user?.name ? `, ${user.name}` : ""}</div>
                      </div>
                    </div>
                  </div>
                  <nav className="space-y-1 p-2">
                    {tabConfig.map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                        className={`w-full justify-start ${activeTab === tab.id ? 'bg-accent' : ''}`}
                        onClick={() => handleTabSelect(tab.id)}
                      >
                        <tab.icon className="mr-2 h-4 w-4" />
                        {tab.label}
                        {activeTab === tab.id && <span className="ml-auto">•</span>}
                      </Button>
                    ))}
                    <div className="pt-2 mt-2 border-t">
                      <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <div className="ml-2">
              <div className="text-sm text-muted-foreground">Teacher</div>
              <div className="font-semibold">Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex">Role: {user?.role || 'teacher'}</Badge>
            <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-1 sm:hidden">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block border-b bg-white/60 backdrop-blur-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Teacher Dashboard</div>
              <div className="text-lg font-semibold">Welcome{user?.name ? `, ${user.name}` : ""}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Role: {user?.role || 'teacher'}</Badge>
            <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-1">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {loading && (
          <div className="mb-4 text-sm text-muted-foreground">Loading your classes and submissions...</div>
        )}
        {/* Desktop Navigation */}
        <div className="hidden lg:flex w-full justify-center">
          <div className="flex gap-2 mb-8 bg-gradient-to-r from-fun-blue/10 via-white/85 to-fun-purple/10 p-3 rounded-2xl backdrop-blur-md max-w-6xl w-full justify-center overflow-x-auto scrollbar-hide shadow-fun border border-fun-blue/20 bg-colorful-pattern">
            {tabConfig.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`flex items-center gap-2 rounded-xl transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-fun-blue to-fun-purple text-white shadow-magic hover:shadow-fun transform scale-105"
                    : "hover:bg-gradient-to-r hover:from-fun-blue/10 hover:to-fun-purple/10 hover:text-fun-purple hover:shadow-fun hover:scale-105"
                }`}
                onClick={() => handleTabSelect(tab.id)}
              >
                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? tab.animation : ""}`} />
                {tab.label}
                {activeTab === tab.id && <span className="ml-1">✨</span>}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Mobile Page Title */}
        <div className="lg:hidden mb-6 px-2">
          <h2 className="text-2xl font-bold">
            {tabConfig.find(tab => tab.id === activeTab)?.label}
          </h2>
        </div>

        {/* Panels */}
        {activeTab === "overview" && <Overview />}
        {activeTab === "classes" && <Classes />}
        {activeTab === "submissions" && <Submissions />}
        {activeTab === "announcements" && <Announcements />}
        {activeTab === "reports" && <Reports />}
        {activeTab === "progress" && <Progress />}
        {activeTab === "content" && <Content />}
        {activeTab === "drives" && <Drives />}
        {activeTab === "leaderboards" && <Leaderboards />}
        {activeTab === "collab" && <Collab />}
        {activeTab === "alerts" && <Alerts />}
      </div>
      {/* Review Dialog for eco-action verification */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-3">
              <div className="text-sm"><span className="font-semibold">Student:</span> {selectedSubmission.student}</div>
              <div className="text-sm"><span className="font-semibold">Class:</span> {selectedSubmission.class}</div>
              <div className="text-sm"><span className="font-semibold">Action:</span> {selectedSubmission.action}</div>
              <div className="text-sm"><span className="font-semibold">Points:</span> {selectedSubmission.points}</div>
              <div>
                <Label htmlFor="remarks">Remarks (optional)</Label>
                <Textarea id="remarks" rows={4} placeholder="Write feedback or reason for rejection..." value={reviewRemarks} onChange={(e) => setReviewRemarks(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => selectedSubmission && handleReviewDecision(selectedSubmission.id, 'reject', reviewRemarks)}>Reject</Button>
                <Button className="btn-eco" onClick={() => selectedSubmission && handleReviewDecision(selectedSubmission.id, 'approve', reviewRemarks)}>Approve</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Class Analytics Dialog */}
      <Dialog open={showClassAnalytics} onOpenChange={setShowClassAnalytics}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Class Analytics{selectedClass ? ` - ${selectedClass.name}` : ""}</DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-3 text-center">
                  <div className="text-xs text-muted-foreground">Students</div>
                  <div className="text-xl font-bold">{selectedClass.students}</div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-xs text-muted-foreground">Eco actions this week</div>
                  <div className="text-xl font-bold">{selectedClass.weeklyEcoActions}</div>
                </Card>
                <Card className="p-3 text-center">
                  <div className="text-xs text-muted-foreground">Pending reviews</div>
                  <div className="text-xl font-bold">{pendingSubmissions.filter(p => p.class === selectedClass.name).length}</div>
                </Card>
              </div>
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Daily Actions (last 7 days)</h4>
                {(() => {
                  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
                  const base = selectedClass.weeklyEcoActions || 70;
                  const series = days.map((d, i) => ({ day: d, count: Math.max(1, Math.round(base * (0.08 + i * 0.02))) }));
                  return (
                    <ChartContainer config={{ count: { label: "Actions", color: "#22c55e" } }} className="h-64 w-full">
                      <ReBarChart data={series}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={[6,6,0,0]} />
                      </ReBarChart>
                    </ChartContainer>
                  );
                })()}
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Top Students</h4>
                {(() => {
                  const samples: Array<{ name: string; points: number; actions: number }> = [
                    { name: "Aarav Gupta", points: 180, actions: 12 },
                    { name: "Ishika", points: 160, actions: 10 },
                    { name: "Vicky", points: 140, actions: 9 },
                    { name: "Priya", points: 125, actions: 8 },
                    { name: "Rohan", points: 118, actions: 7 },
                  ];
                  const shifted = (() => {
                    const idx = (selectedClass.name.charCodeAt(0) + selectedClass.name.length) % samples.length;
                    return [...samples.slice(idx), ...samples.slice(0, idx)];
                  })();
                  return (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Eco Actions</TableHead>
                          <TableHead>Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shifted.map((s) => (
                          <TableRow key={s.name}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8"><AvatarFallback>{s.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback></Avatar>
                                <div className="font-medium">{s.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{s.actions}</TableCell>
                            <TableCell>{s.points}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  );
                })()}
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherDashboard;
