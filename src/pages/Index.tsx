import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Shield, 
  Zap, 
  DollarSign,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Users,
  Clock,
  Globe,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { companyData } from '@/contexts/AppContext';

const stats = [
  { label: 'Faster Response', value: '96%', icon: Zap, color: 'text-primary' },
  { label: 'Annual Savings', value: '$500K', icon: DollarSign, color: 'text-success' },
  { label: 'Compliance Rate', value: '100%', icon: CheckCircle, color: 'text-secondary' },
];

const features = [
  {
    icon: MessageSquare,
    title: 'Smart Query Engine',
    description: 'AI-powered responses to investor queries with real-time data access and citation.',
    gradient: 'from-primary to-primary/60',
  },
  {
    icon: FileText,
    title: 'Auto Report Generation',
    description: 'Generate comprehensive quarterly reports, ESG summaries, and investor updates.',
    gradient: 'from-secondary to-secondary/60',
  },
  {
    icon: TrendingUp,
    title: 'Sentiment Monitoring',
    description: 'Real-time tracking of market sentiment, news mentions, and analyst ratings.',
    gradient: 'from-success to-success/60',
  },
  {
    icon: Shield,
    title: 'Compliance Checker',
    description: 'Automated screening for Reg FD, MNPI, and forward-looking statement compliance.',
    gradient: 'from-warning to-warning/60',
  },
];

const metrics = [
  { icon: BarChart3, label: 'Queries Handled', value: '10,000+' },
  { icon: Users, label: 'Active Investors', value: '2,500+' },
  { icon: Clock, label: 'Avg. Response Time', value: '<2 sec' },
  { icon: Globe, label: 'Global Coverage', value: '24/7' },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero text-primary-foreground">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-secondary/20 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8 animate-fade-in">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">EY Techathon 6.0 - AI-Powered Solution</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in stagger-1">
              Transform Investor Relations
              <span className="block mt-2 bg-gradient-to-r from-primary-foreground via-primary-foreground/80 to-primary-foreground bg-clip-text">
                From Reactive to Proactive
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-in stagger-2">
              Automate investor queries, generate compliant reports, and monitor sentiment in real-time 
              with our AI-powered IR platform built for {companyData.name}.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3">
              <Link to="/chat">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Start Demo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/documents">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in stagger-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="glass-dark rounded-2xl p-6 text-center backdrop-blur-xl"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Intelligent Features for Modern IR
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform automates and enhances every aspect of investor relations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative bg-card rounded-2xl p-8 shadow-md border border-border/50 card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by Leading IR Teams
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time performance metrics from our platform.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div
                key={metric.label}
                className="stat-card text-center"
              >
                <metric.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="gradient-bg rounded-3xl p-12 shadow-xl shadow-primary/20">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your IR Operations?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Experience the future of investor relations with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/chat">
                <Button size="xl" className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  Try AI Chat
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/reports">
                <Button size="xl" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Generate Reports
                  <FileText className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">Agentic AutoAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 TechCorp Solutions Inc. | EY Techathon 6.0
          </p>
        </div>
      </footer>
    </div>
  );
}
