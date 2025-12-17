import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  Newspaper,
  BarChart3,
  Star,
  Hash,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { companyData } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const sentimentScore = 72; // 0-100

const sentimentData = [
  { date: 'Nov 17', positive: 65, neutral: 25, negative: 10 },
  { date: 'Nov 24', positive: 58, neutral: 30, negative: 12 },
  { date: 'Dec 01', positive: 70, neutral: 22, negative: 8 },
  { date: 'Dec 08', positive: 68, neutral: 24, negative: 8 },
  { date: 'Dec 15', positive: 75, neutral: 18, negative: 7 },
  { date: 'Dec 17', positive: 72, neutral: 20, negative: 8 },
];

const pieData = [
  { name: 'Positive', value: 72, color: 'hsl(var(--success))' },
  { name: 'Neutral', value: 20, color: 'hsl(var(--muted-foreground))' },
  { name: 'Negative', value: 8, color: 'hsl(var(--destructive))' },
];

const newsItems = [
  {
    id: 1,
    title: 'TechCorp Reports Strong Q3 Earnings, Beats Analyst Expectations',
    source: 'Reuters',
    time: '2 hours ago',
    sentiment: 'positive',
    url: '#',
  },
  {
    id: 2,
    title: 'TechCorp Announces Strategic AI Partnership with Microsoft',
    source: 'Bloomberg',
    time: '5 hours ago',
    sentiment: 'positive',
    url: '#',
  },
  {
    id: 3,
    title: 'Analysts Raise Price Targets Following Earnings Beat',
    source: 'CNBC',
    time: '8 hours ago',
    sentiment: 'positive',
    url: '#',
  },
  {
    id: 4,
    title: 'Tech Sector Faces Regulatory Scrutiny in EU Markets',
    source: 'Financial Times',
    time: '1 day ago',
    sentiment: 'neutral',
    url: '#',
  },
  {
    id: 5,
    title: 'TechCorp CFO Discusses Capital Allocation Strategy',
    source: 'Wall Street Journal',
    time: '2 days ago',
    sentiment: 'neutral',
    url: '#',
  },
];

const analystRatings = [
  { firm: 'Goldman Sachs', rating: 'Buy', target: 195, previous: 180 },
  { firm: 'Morgan Stanley', rating: 'Overweight', target: 190, previous: 175 },
  { firm: 'JP Morgan', rating: 'Buy', target: 188, previous: 170 },
  { firm: 'Barclays', rating: 'Hold', target: 175, previous: 172 },
  { firm: 'UBS', rating: 'Buy', target: 192, previous: 178 },
];

const topKeywords = [
  { word: 'AI', count: 156, trend: 'up' },
  { word: 'Cloud', count: 134, trend: 'up' },
  { word: 'Revenue', count: 98, trend: 'neutral' },
  { word: 'Growth', count: 87, trend: 'up' },
  { word: 'Partnership', count: 72, trend: 'up' },
  { word: 'Earnings', count: 65, trend: 'neutral' },
];

const alerts = [
  { type: 'positive', message: 'Sentiment spike: +15% in last 24 hours', time: '2 hours ago' },
  { type: 'info', message: '5 new analyst reports published', time: '6 hours ago' },
];

export default function Sentiment() {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSentimentColor = (score: number) => {
    if (score >= 60) return 'text-success';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sentiment Analysis</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of market sentiment, news mentions, and analyst ratings for {companyData.ticker}.
        </p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border animate-fade-in",
                alert.type === 'positive' && "bg-success/10 border-success/30",
                alert.type === 'info' && "bg-primary/10 border-primary/30"
              )}
            >
              <AlertTriangle className={cn(
                "w-5 h-5",
                alert.type === 'positive' && "text-success",
                alert.type === 'info' && "text-primary"
              )} />
              <span className="flex-1">{alert.message}</span>
              <span className="text-sm text-muted-foreground">{alert.time}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sentiment Gauge & Pie */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border/50 text-center">
              <h3 className="font-semibold mb-4">Overall Sentiment Score</h3>
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="hsl(var(--success))"
                    strokeWidth="10"
                    strokeDasharray={`${sentimentScore * 2.83} 283`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className={cn("text-4xl font-bold", getSentimentColor(sentimentScore))}>
                    {sentimentScore}
                  </span>
                  <span className="text-sm text-muted-foreground">Positive</span>
                </div>
              </div>
              <div className="flex justify-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  Positive
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                  Neutral
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  Negative
                </span>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border/50">
              <h3 className="font-semibold mb-4">Sentiment Distribution</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
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
            </div>
          </div>

          {/* Sentiment Timeline */}
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h3 className="font-semibold mb-4">30-Day Sentiment Timeline</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="positive" stroke="hsl(var(--success))" strokeWidth={2} name="Positive %" />
                <Line type="monotone" dataKey="neutral" stroke="hsl(var(--muted-foreground))" strokeWidth={2} name="Neutral %" />
                <Line type="monotone" dataKey="negative" stroke="hsl(var(--destructive))" strokeWidth={2} name="Negative %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* News Feed */}
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-primary" />
                Latest News Mentions
              </h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-1">
                    {getSentimentIcon(item.sentiment)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <a href={item.url} className="font-medium hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </a>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Keywords */}
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              Top Keywords
            </h3>
            <div className="space-y-3">
              {topKeywords.map((keyword, index) => (
                <div key={keyword.word} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-sm text-muted-foreground">{index + 1}</span>
                    <span className="font-medium">{keyword.word}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{keyword.count}</span>
                    {keyword.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                    {keyword.trend === 'neutral' && <Minus className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analyst Ratings */}
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Analyst Ratings
            </h3>
            <div className="space-y-4">
              {analystRatings.map((analyst) => (
                <div key={analyst.firm} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{analyst.firm}</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      analyst.rating === 'Buy' && "bg-success/20 text-success",
                      analyst.rating === 'Overweight' && "bg-success/20 text-success",
                      analyst.rating === 'Hold' && "bg-warning/20 text-warning"
                    )}>
                      {analyst.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Target: ${analyst.target}</span>
                    <span className="text-success text-xs">
                      +${analyst.target - analyst.previous} from ${analyst.previous}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Coverage Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Mentions (7d)</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Analyst Coverage</span>
                <span className="font-semibold">28 firms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Price Target</span>
                <span className="font-semibold">$188</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Buy Ratings</span>
                <span className="font-semibold text-success">78%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
