import { useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Download,
  Zap,
  Users,
  Wrench,
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
    value: '85%', 
    change: '+15%', 
    icon: Clock,
    description: 'vs. manual diagnostics',
    color: 'text-success'
  },
  { 
    label: 'Revenue Growth', 
    value: '$485K', 
    change: '+18%', 
    icon: DollarSign,
    description: 'This month',
    color: 'text-primary'
  },
  { 
    label: 'Efficiency Rate', 
    value: '92%', 
    change: '+8%', 
    icon: Zap,
    description: 'Service completion',
    color: 'text-secondary'
  },
  { 
    label: 'Customer Retention', 
    value: '78%', 
    change: '+5%', 
    icon: Users,
    description: 'Return customers',
    color: 'text-warning'
  },
];

const serviceVolumeData = [
  { name: 'Oil Change', value: 29, color: 'hsl(var(--primary))' },
  { name: 'Tires', value: 18, color: 'hsl(var(--success))' },
  { name: 'Brakes', value: 15, color: 'hsl(var(--secondary))' },
  { name: 'Diagnostics', value: 13, color: 'hsl(var(--warning))' },
  { name: 'Other', value: 25, color: 'hsl(var(--muted-foreground))' },
];

const serviceTimeData = [
  { day: 'Mon', actual: 1.8, estimated: 2.0 },
  { day: 'Tue', actual: 1.6, estimated: 2.0 },
  { day: 'Wed', actual: 1.9, estimated: 2.0 },
  { day: 'Thu', actual: 1.7, estimated: 2.0 },
  { day: 'Fri', actual: 2.1, estimated: 2.0 },
  { day: 'Sat', actual: 1.5, estimated: 2.0 },
];

const topServicesData = [
  { service: 'Oil Change', revenue: 25650 },
  { service: 'Brake Service', revenue: 53400 },
  { service: 'Tire Service', revenue: 32250 },
  { service: 'Diagnostics', revenue: 15600 },
  { service: 'A/C Service', revenue: 17800 },
];

const monthlyTrends = [
  { month: 'Jul', services: 980, revenue: 280 },
  { month: 'Aug', services: 1050, revenue: 320 },
  { month: 'Sep', services: 1120, revenue: 380 },
  { month: 'Oct', services: 1080, revenue: 410 },
  { month: 'Nov', services: 1150, revenue: 450 },
  { month: 'Dec', services: 1180, revenue: 485 },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('30d');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Service Analytics</h1>
          <p className="text-muted-foreground">
            Monitor service performance, revenue metrics, and operational efficiency.
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
        {/* Service Volume by Type */}
        <div className="bg-card rounded-xl p-6 border border-border/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Service Volume by Type
          </h3>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={serviceVolumeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {serviceVolumeData.map((entry, index) => (
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
              {serviceVolumeData.map((item) => (
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

        {/* Service Time Efficiency */}
        <div className="bg-card rounded-xl p-6 border border-border/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Avg. Service Time (hours)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={serviceTimeData}>
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
              <Bar dataKey="actual" name="Actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="estimated" name="Estimated" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue by Service */}
        <div className="bg-card rounded-xl p-6 border border-border/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Revenue by Service Type
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topServicesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" className="text-xs" tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`} />
              <YAxis dataKey="service" type="category" className="text-xs" width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="bg-card rounded-xl p-6 border border-border/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Monthly Performance
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="services" name="Services" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue ($K)" stroke="hsl(var(--success))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Performance Summary
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Services This Month</p>
            <p className="text-2xl font-bold">1,180</p>
            <p className="text-xs text-success mt-1">+18% vs last month</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Avg. Ticket Value</p>
            <p className="text-2xl font-bold">$287</p>
            <p className="text-xs text-success mt-1">+$23 vs last month</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Labor Hours Used</p>
            <p className="text-2xl font-bold">1,680</p>
            <p className="text-xs text-success mt-1">92% utilization</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Parts Sold</p>
            <p className="text-2xl font-bold">3,420</p>
            <p className="text-xs text-success mt-1">$89K in parts revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
