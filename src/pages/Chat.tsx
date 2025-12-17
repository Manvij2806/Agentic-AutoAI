import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, TrendingUp, FileText, Leaf, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp, companyData, Message } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const quickQueries = [
  { label: 'Q3 Revenue?', icon: DollarSign },
  { label: 'ESG Metrics', icon: Leaf },
  { label: 'Dividend Policy', icon: TrendingUp },
  { label: 'Growth Strategy', icon: Sparkles },
];

const revenueData = [
  { quarter: 'Q1', revenue: 2.1 },
  { quarter: 'Q2', revenue: 2.25 },
  { quarter: 'Q3', revenue: 2.4 },
  { quarter: 'Q4 (Est)', revenue: 2.55 },
];

// Simulated AI responses
const aiResponses: Record<string, { content: string; sources: string[]; showChart?: boolean }> = {
  'q3 revenue': {
    content: `**Q3 2024 Revenue Performance**\n\nTechCorp Solutions reported revenue of **$2.4 billion** for Q3 2024, representing a **12% year-over-year increase** from $2.14B in Q3 2023.\n\n**Key Highlights:**\n- Gross margin improved to 28%, up from 26.5% YoY\n- Operating income grew 15% to $420M\n- Cloud services segment contributed 45% of total revenue\n\nThe strong performance was driven by increased enterprise adoption and expansion of our AI-powered solutions portfolio.`,
    sources: ['Q3_2024_Earnings_Report.pdf', 'Investor_Presentation_Q3.pdf'],
    showChart: true,
  },
  'esg metrics': {
    content: `**ESG Performance Overview**\n\nTechCorp maintains strong ESG ratings across all categories:\n\n**Environmental Score: 85/100**\n- Carbon neutral operations achieved\n- 100% renewable energy in data centers\n- 30% reduction in water usage\n\n**Social Score: 78/100**\n- 45% diversity in leadership roles\n- $50M invested in STEM education\n- 98% employee satisfaction rate\n\n**Governance Score: 92/100**\n- Independent board majority\n- Executive compensation tied to ESG goals\n- Best-in-class data privacy practices`,
    sources: ['ESG_Annual_Report_2024.pdf'],
  },
  'dividend policy': {
    content: `**Dividend Policy & Capital Returns**\n\nTechCorp maintains a progressive dividend policy with commitment to shareholder returns:\n\n**Current Dividend:**\n- Quarterly dividend: $0.45 per share\n- Annual yield: 1.8% (based on current price)\n- Payout ratio: 35% of earnings\n\n**Capital Allocation:**\n- 40% reinvested in R&D\n- 35% returned to shareholders (dividends + buybacks)\n- 25% strategic acquisitions\n\nThe Board has approved a 10% dividend increase for FY2025, subject to continued financial performance.`,
    sources: ['Q3_2024_Earnings_Report.pdf', 'Capital_Allocation_Policy.pdf'],
  },
  'growth strategy': {
    content: `**Strategic Growth Initiatives**\n\nTechCorp's growth strategy focuses on three pillars:\n\n**1. AI & Automation (40% of investment)**\n- Expanding enterprise AI solutions\n- New generative AI product launches in Q1 2025\n- Strategic partnerships with cloud providers\n\n**2. Geographic Expansion (30%)**\n- APAC revenue target: +25% YoY\n- New offices in Singapore and Mumbai\n- Localized product offerings\n\n**3. M&A Pipeline (30%)**\n- 3-5 tuck-in acquisitions planned\n- Focus on cybersecurity and data analytics\n- $500M allocated for strategic deals\n\n**2025 Guidance:** Revenue growth of 15-18%, with margin expansion of 100-150 bps.`,
    sources: ['Investor_Presentation_Q3.pdf', 'Strategic_Plan_2025.pdf'],
  },
};

function getAIResponse(query: string): { content: string; sources: string[]; showChart?: boolean } {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('revenue') || lowerQuery.includes('q3')) {
    return aiResponses['q3 revenue'];
  } else if (lowerQuery.includes('esg') || lowerQuery.includes('environmental') || lowerQuery.includes('sustainability')) {
    return aiResponses['esg metrics'];
  } else if (lowerQuery.includes('dividend') || lowerQuery.includes('payout')) {
    return aiResponses['dividend policy'];
  } else if (lowerQuery.includes('growth') || lowerQuery.includes('strategy') || lowerQuery.includes('future')) {
    return aiResponses['growth strategy'];
  }
  
  return {
    content: `I'd be happy to help you with information about ${companyData.name}. Based on our Q3 2024 data:\n\n- **Revenue:** $2.4B (+12% YoY)\n- **EPS:** $3.45\n- **Market Cap:** $45B\n- **ESG Score:** 85/100\n\nCould you please be more specific about what aspect you'd like to explore? I can provide detailed information on:\n- Financial performance and metrics\n- ESG initiatives and ratings\n- Dividend policy and capital returns\n- Growth strategy and outlook`,
    sources: ['Q3_2024_Earnings_Report.pdf'],
  };
}

export default function Chat() {
  const { messages, setMessages } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAIResponse(query);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        sources: response.sources,
        chart: response.showChart ? revenueData : undefined,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col lg:w-[60%]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4 animate-fade-in",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 shadow-glow-sm">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
              
              <div className={cn("max-w-[80%]", message.role === 'user' && "order-first")}>
                <div className={cn(
                  "chat-bubble",
                  message.role === 'user' ? "chat-bubble-user" : "chat-bubble-ai"
                )}>
                  <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className={cn(
                        "mb-2 last:mb-0",
                        line.startsWith('**') && "font-semibold"
                      )}>
                        {line.replace(/\*\*/g, '')}
                      </p>
                    ))}
                  </div>
                  
                  {message.chart && (
                    <div className="mt-4 p-4 bg-background/50 rounded-lg">
                      <p className="text-sm font-medium mb-3">Revenue Trend ($ Billions)</p>
                      <ResponsiveContainer width="100%" height={150}>
                        <LineChart data={message.chart}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="quarter" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
                
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.sources.map((source, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
                      >
                        <FileText className="w-3 h-3" />
                        {source}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 animate-fade-in">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-glow-sm">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="chat-bubble chat-bubble-ai">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Analyzing your query...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Queries */}
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {quickQueries.map((query) => (
              <Button
                key={query.label}
                variant="outline"
                size="sm"
                onClick={() => handleSend(query.label)}
                className="rounded-full"
              >
                <query.icon className="w-4 h-4 mr-1" />
                {query.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-6 border-t border-border bg-card/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about financials, ESG, dividends, or strategy..."
              className="flex-1 h-12"
              disabled={isTyping}
            />
            <Button type="submit" size="lg" disabled={isTyping || !input.trim()}>
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Context Panel - Desktop Only */}
      <div className="hidden lg:block w-[40%] border-l border-border bg-muted/30 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Company Overview */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {companyData.name}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ticker</span>
                <span className="font-medium">{companyData.ticker}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Market Cap</span>
                <span className="font-medium">${(companyData.marketCap / 1e9).toFixed(0)}B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">P/E Ratio</span>
                <span className="font-medium">{companyData.peRatio}x</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
            <h3 className="font-semibold mb-4">Q3 2024 Highlights</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">${(companyData.revenue / 1e9).toFixed(1)}B</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-success">+{companyData.revenueGrowth}%</p>
                <p className="text-xs text-muted-foreground">YoY Growth</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">${companyData.eps}</p>
                <p className="text-xs text-muted-foreground">EPS</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{companyData.grossMargin}%</p>
                <p className="text-xs text-muted-foreground">Margin</p>
              </div>
            </div>
          </div>

          {/* ESG Scores */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-success" />
              ESG Performance
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Environmental', score: companyData.esg.environmental, color: 'bg-success' },
                { label: 'Social', score: companyData.esg.social, color: 'bg-primary' },
                { label: 'Governance', score: companyData.esg.governance, color: 'bg-secondary' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.score}/100</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", item.color)}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
