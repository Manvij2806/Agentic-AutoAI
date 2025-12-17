import { useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Download,
  Filter,
  Zap,
  Users,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

const metrics = [
  { 
    label: 'Time Savings', 
    value: '96%', 
    change: '+12%', 
    icon: Clock,
    description: 'vs. manual process',
    color: 'text-success'
  },
  { 
    label: 'Cost Savings', 
    value: '$487K', 
    change: '+8%', 
    icon: DollarSign,
    description: 'Annual savings',
    color: 'text-primary'
  },
  { 
    label: 'Automation Rate', 
    value: '89%', 
    change: '+5%', 
    icon: Zap,
    description: 'Queries auto-resolved',
    color: 'text-secondary'
  },
  { 
    label: 'Satisfaction', 
    value: '4.8/5', 
    change: '+0.3', 
    icon: Users,
    description: 'Investor feedback',
    color: 'text-warning'
  },
];

const queryVolumeData = [
  { name: 'Financial', value: 35, color: 'hsl(var(--primary))' },
  { name: 'ESG', value: 25, color: 'hsl(var(--success))' },
  { name: 'Strategy', value: 20, color: 'hsl(var(--secondary))' },
  { name: 'Governance', value: 12, color: 'hsl(var(--warning))' },
  { name: 'Other', value: 8, color: 'hsl(var(--muted-foreground))' },
];

const responseTimeData = [
  { day: 'Mon', ai: 1.2, manual: 45 },
  { day: 'Tue', ai: 1.4, manual: 52 },
  { day: 'Wed', ai: 1.1, manual: 38 },
  { day: 'Thu', ai: 1.3, manual: 48 },
  { day: 'Fri', ai: 1.5, manual: 55 },
  { day: 'Sat', ai: 1.2, manual: 42 },
  { day: 'Sun', ai: 1.1, manual: 35 },
];

const commonQuestionsData = [
  { question: 'Revenue Growth', count: 156 },
  { question: 'Dividend Policy', count: 134 },
  { question: 'ESG Initiatives', count: 98 },
  { question: 'Market Outlook', count: 87 },
  { question: 'M&A Strategy', count: 72 },
];

const monthlyTrends = [
  { month: 'Jul', queries: 2400, resolved: 2280 },
  { month: 'Aug', queries: 2800, resolved: 2660 },
  { month: 'Sep', queries: 3200, resolved: 3040 },
  { month: 'Oct', queries: 3600, resolved: 3420 },
  { month: 'Nov', queries: 3100, resolved: 2945 },
  { month: 'Dec', queries: 2900, resolved: 2755 },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('30d');
  const [category, setCategory] = useState('all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor platform performance, query analytics, and ROI metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className="stat-card animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", 
                metric.color === 'text-success' && "bg-success/10",
                metric.color === 'text-primary' && "bg-primary/10",
                metric.color === 'text-secondary' && "bg-secondary/10",
                metric.color === 'text-warning' && "bg-warning/10"
              )}>
                <metric.icon className={cn("w-6 h-6", metric.color)} />
              </div>
              <span className="text-sm font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                {metric.change}
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{metric.value}</p>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Query Volume by Category */}
        <div className="bg-card rounded-xl p-6 border border-border/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Query Volume by Category
          </h3>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={queryVolumeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {queryVolumeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {queryVolumeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Response Time Comparison */}
        <div className="bg-card rounded-xl p-6 border border-border/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Response Time (seconds)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="ai" name="AI Response" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="manual" name="Manual (avg)" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Common Questions */}
        <div className="bg-card rounded-xl p-6 border border-border/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Top Query Topics
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={commonQuestionsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" className="text-xs" />
              <YAxis dataKey="question" type="category" className="text-xs" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="bg-card rounded-xl p-6 border border-border/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Monthly Query Trends
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="queries" name="Total Queries" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" name="Auto-Resolved" stroke="hsl(var(--success))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROI Summary */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          ROI Summary
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Hours Saved Monthly</p>
            <p className="text-2xl font-bold">1,240</p>
            <p className="text-xs text-success mt-1">~$124,000 value</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Queries Automated</p>
            <p className="text-2xl font-bold">8,945</p>
            <p className="text-xs text-success mt-1">89% automation rate</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Compliance Issues Caught</p>
            <p className="text-2xl font-bold">47</p>
            <p className="text-xs text-success mt-1">100% detection rate</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Reports Generated</p>
            <p className="text-2xl font-bold">156</p>
            <p className="text-xs text-success mt-1">Avg. 15 min saved each</p>
          </div>
        </div>
      </div>
    </div>
  );
}
