import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Wrench, FileText, Car, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp, serviceData, Message } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const quickQueries = [
  { label: 'Engine Light On?', icon: AlertTriangle },
  { label: 'Oil Change Due', icon: Car },
  { label: 'Brake Inspection', icon: Wrench },
  { label: 'Service History', icon: Sparkles },
];

const serviceVolumeData = [
  { month: 'Sep', services: 980 },
  { month: 'Oct', services: 1120 },
  { month: 'Nov', services: 1050 },
  { month: 'Dec', services: 1180 },
];

// Simulated AI responses
const aiResponses: Record<string, { content: string; sources: string[]; showChart?: boolean }> = {
  'engine light': {
    content: `**Check Engine Light Diagnosis**\n\nBased on common diagnostic codes, here are the most likely causes:\n\n**Common Causes:**\n- **P0300-P0308**: Engine misfires - could be spark plugs, ignition coils, or fuel injectors\n- **P0171/P0174**: System too lean - check for vacuum leaks or MAF sensor issues\n- **P0420**: Catalytic converter efficiency below threshold\n- **P0440-P0457**: EVAP system issues - often a loose gas cap\n\n**Recommended Actions:**\n1. Connect OBD-II scanner to read specific codes\n2. Check gas cap is properly sealed\n3. Inspect for visible damage or loose connections\n4. Schedule diagnostic appointment for detailed analysis\n\n**Estimated Diagnostic Cost:** $75-150`,
    sources: ['Vehicle_Diagnostic_Codes.pdf', 'OBD_Reference_Guide.pdf'],
    showChart: false,
  },
  'oil change': {
    content: `**Oil Change Service Information**\n\nBased on typical maintenance schedules:\n\n**Conventional Oil:**\n- Change interval: Every 3,000-5,000 miles\n- Cost: $35-75\n- Duration: 30-45 minutes\n\n**Synthetic Oil:**\n- Change interval: Every 7,500-10,000 miles\n- Cost: $65-125\n- Duration: 30-45 minutes\n\n**What's Included:**\n- Drain old oil and replace with new\n- Replace oil filter\n- Check and top off fluids\n- Visual inspection of brakes, belts, hoses\n- Tire pressure check\n\n**Current Special:** 15% off synthetic oil changes this month!`,
    sources: ['Maintenance_Schedule_Guide.pdf'],
    showChart: true,
  },
  'brake': {
    content: `**Brake Inspection & Service**\n\nComprehensive brake assessment includes:\n\n**Inspection Points:**\n- Brake pad thickness (minimum 3mm recommended)\n- Rotor condition and thickness\n- Brake fluid level and condition\n- Brake lines and hoses\n- Caliper operation\n- Emergency brake function\n\n**Service Options:**\n\n| Service | Price Range | Duration |\n|---------|-------------|----------|\n| Inspection Only | $25-50 | 30 min |\n| Pad Replacement | $150-300/axle | 1-2 hrs |\n| Rotor Resurfacing | $50-100/rotor | 1 hr |\n| Full Brake Service | $300-600/axle | 2-3 hrs |\n\n**Warning Signs:**\n- Squealing or grinding noises\n- Vibration when braking\n- Car pulling to one side\n- Soft or spongy brake pedal`,
    sources: ['Service_History_Report_Dec2024.pdf', 'Brake_System_Guide.pdf'],
  },
  'service history': {
    content: `**Service Center Performance - December 2024**\n\n**Monthly Overview:**\n- Total services completed: 1,180\n- Revenue: $485,000 (+18% YoY)\n- Average ticket: $287\n- Customer satisfaction: 4.8/5 ⭐\n\n**Top Services This Month:**\n1. Oil Changes: 342 (29%)\n2. Tire Services: 215 (18%)\n3. Brake Services: 178 (15%)\n4. Diagnostics: 156 (13%)\n5. A/C Services: 89 (8%)\n\n**Technician Productivity:**\n- Active technicians: 8\n- Avg. services/tech: 147/month\n- Labor hours utilized: 1,680\n\n**Customer Retention:** 78% return customers`,
    sources: ['Service_History_Report_Dec2024.pdf'],
    showChart: true,
  },
};

function getAIResponse(query: string): { content: string; sources: string[]; showChart?: boolean } {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('engine') || lowerQuery.includes('light') || lowerQuery.includes('check')) {
    return aiResponses['engine light'];
  } else if (lowerQuery.includes('oil') || lowerQuery.includes('change')) {
    return aiResponses['oil change'];
  } else if (lowerQuery.includes('brake') || lowerQuery.includes('stop')) {
    return aiResponses['brake'];
  } else if (lowerQuery.includes('history') || lowerQuery.includes('service') || lowerQuery.includes('report')) {
    return aiResponses['service history'];
  }
  
  return {
    content: `I'd be happy to help you with vehicle service information. Based on our ${serviceData.name} data:\n\n- **Services Completed:** ${serviceData.servicesCompleted.toLocaleString()}\n- **Customer Rating:** ${serviceData.customerSatisfaction}/5 ⭐\n- **Avg. Service Ticket:** $${serviceData.avgTicket}\n- **Technicians Available:** ${serviceData.technicianCount}\n\nI can help you with:\n- Vehicle diagnostics and fault codes\n- Maintenance schedules and recommendations\n- Service estimates and pricing\n- Appointment scheduling\n\nWhat would you like to know more about?`,
    sources: ['Service_History_Report_Dec2024.pdf'],
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
        chart: response.showChart ? serviceVolumeData : undefined,
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
                      <p className="text-sm font-medium mb-3">Monthly Service Volume</p>
                      <ResponsiveContainer width="100%" height={150}>
                        <LineChart data={message.chart}>
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
                          <Line 
                            type="monotone" 
                            dataKey="services" 
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
              placeholder="Ask about diagnostics, maintenance, pricing, or scheduling..."
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
          {/* Service Center Overview */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              {serviceData.name}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="font-medium">{serviceData.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Service Bays</span>
                <span className="font-medium">{serviceData.baysAvailable}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Technicians</span>
                <span className="font-medium">{serviceData.technicianCount}</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
            <h3 className="font-semibold mb-4">December 2024 Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">${(serviceData.revenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-success">+{serviceData.revenueGrowth}%</p>
                <p className="text-xs text-muted-foreground">YoY Growth</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">${serviceData.avgTicket}</p>
                <p className="text-xs text-muted-foreground">Avg. Ticket</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{serviceData.customerSatisfaction}⭐</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
          </div>

          {/* Quality Scores */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-success" />
              Quality Ratings
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Service Quality', score: serviceData.ratings.quality, color: 'bg-success' },
                { label: 'Timeliness', score: serviceData.ratings.timeliness, color: 'bg-primary' },
                { label: 'Communication', score: serviceData.ratings.communication, color: 'bg-secondary' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.score}%</span>
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
