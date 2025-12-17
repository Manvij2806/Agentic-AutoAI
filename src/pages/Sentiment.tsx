import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Star,
  Hash,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { serviceData } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const sentimentScore = 88;

const sentimentData = [
  { date: 'Nov 17', positive: 85, neutral: 12, negative: 3 },
  { date: 'Nov 24', positive: 82, neutral: 14, negative: 4 },
  { date: 'Dec 01', positive: 88, neutral: 10, negative: 2 },
  { date: 'Dec 08', positive: 86, neutral: 11, negative: 3 },
  { date: 'Dec 15', positive: 90, neutral: 8, negative: 2 },
  { date: 'Dec 17', positive: 88, neutral: 10, negative: 2 },
];

const pieData = [
  { name: 'Positive', value: 88, color: 'hsl(var(--success))' },
  { name: 'Neutral', value: 10, color: 'hsl(var(--muted-foreground))' },
  { name: 'Negative', value: 2, color: 'hsl(var(--destructive))' },
];

const reviewItems = [
  {
    id: 1,
    title: 'Excellent service! They fixed my car quickly and the price was fair.',
    source: 'Google Reviews',
    time: '2 hours ago',
    sentiment: 'positive',
    rating: 5,
  },
  {
    id: 2,
    title: 'Very professional team. They explained everything clearly before starting work.',
    source: 'Yelp',
    time: '5 hours ago',
    sentiment: 'positive',
    rating: 5,
  },
  {
    id: 3,
    title: 'Great experience! Will definitely come back for future services.',
    source: 'Google Reviews',
    time: '8 hours ago',
    sentiment: 'positive',
    rating: 5,
  },
  {
    id: 4,
    title: 'Service was okay but had to wait longer than expected.',
    source: 'Facebook',
    time: '1 day ago',
    sentiment: 'neutral',
    rating: 3,
  },
  {
    id: 5,
    title: 'Honest mechanics who dont try to upsell unnecessary services.',
    source: 'Yelp',
    time: '2 days ago',
    sentiment: 'positive',
    rating: 5,
  },
];

const topKeywords = [
  { word: 'Professional', count: 156, trend: 'up' },
  { word: 'Fair Price', count: 134, trend: 'up' },
  { word: 'Quick Service', count: 98, trend: 'neutral' },
  { word: 'Honest', count: 87, trend: 'up' },
  { word: 'Friendly', count: 72, trend: 'up' },
  { word: 'Clean', count: 65, trend: 'neutral' },
];

const platformRatings = [
  { platform: 'Google Reviews', rating: 4.8, reviews: 342 },
  { platform: 'Yelp', rating: 4.7, reviews: 156 },
  { platform: 'Facebook', rating: 4.9, reviews: 89 },
  { platform: 'BBB', rating: 'A+', reviews: 45 },
  { platform: 'CarFax', rating: 4.6, reviews: 78 },
];

const alerts = [
  { type: 'positive', message: '5-star review spike: +20% this week', time: '2 hours ago' },
  { type: 'info', message: '12 new reviews to respond to', time: '6 hours ago' },
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating ? "fill-warning text-warning" : "text-muted"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Customer Sentiment</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of customer reviews, feedback, and satisfaction for {serviceData.name}.
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
              <ThumbsUp className={cn(
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
              <h3 className="font-semibold mb-4">Overall Satisfaction Score</h3>
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
                    {sentimentScore}%
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
              <h3 className="font-semibold mb-4">Review Distribution</h3>
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

          {/* Recent Reviews */}
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Recent Customer Reviews
              </h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {reviewItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="mt-1">
                    {getSentimentIcon(item.sentiment)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-2">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(item.rating)}
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{item.source}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{item.time}</span>
                    </div>
                  </div>
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
              Top Mentions
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

          {/* Platform Ratings */}
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Platform Ratings
            </h3>
            <div className="space-y-4">
              {platformRatings.map((platform) => (
                <div key={platform.platform} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{platform.platform}</span>
                    <span className={cn(
                      "text-sm font-bold",
                      typeof platform.rating === 'number' && platform.rating >= 4.5 ? "text-success" : "text-warning"
                    )}>
                      {typeof platform.rating === 'number' ? `${platform.rating}★` : platform.rating}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {platform.reviews} reviews
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Review Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Reviews (30d)</span>
                <span className="font-semibold">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Response Rate</span>
                <span className="font-semibold">98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Response Time</span>
                <span className="font-semibold">2 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">5-Star Reviews</span>
                <span className="font-semibold text-success">82%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
