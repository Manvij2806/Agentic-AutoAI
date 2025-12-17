import { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Loader2,
  Info,
  Lightbulb,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ComplianceResult, ComplianceIssue } from '@/contexts/AppContext';

const sampleText = `Dear Investors,

We are pleased to share that TechCorp is expecting record-breaking revenue growth in Q4 2024. Based on our internal projections, we anticipate revenue to exceed $3 billion, representing a 25% increase from the prior quarter.

Our CEO mentioned in a private meeting that we are in advanced discussions for a major acquisition that could double our market share. While we cannot disclose details yet, this deal is expected to close before year-end.

Looking forward, we project our stock price to reach $250 by mid-2025, making this an excellent time for investment.

Best regards,
IR Team`;

const complianceRules = [
  { id: 'reg-fd', name: 'Regulation FD', description: 'Fair disclosure requirements' },
  { id: 'mnpi', name: 'MNPI Detection', description: 'Material non-public information' },
  { id: 'forward', name: 'Forward-Looking Statements', description: 'Safe harbor language required' },
  { id: 'disclosure', name: 'Required Disclosures', description: 'Missing required disclaimers' },
];

export default function Compliance() {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<ComplianceResult | null>(null);

  const checkCompliance = async () => {
    if (!text.trim()) {
      toast({
        title: 'No text provided',
        description: 'Please enter or paste text to check for compliance.',
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);
    setResult(null);

    // Simulate compliance check
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const issues: ComplianceIssue[] = [];
    const lowerText = text.toLowerCase();

    // Check for forward-looking statements without safe harbor
    const forwardKeywords = ['expecting', 'anticipate', 'project', 'will', 'forecast', 'predict'];
    const hasForwardLooking = forwardKeywords.some((kw) => lowerText.includes(kw));
    const hasSafeHarbor = lowerText.includes('safe harbor') || lowerText.includes('forward-looking statements');

    if (hasForwardLooking && !hasSafeHarbor) {
      issues.push({
        severity: 'critical',
        type: 'Forward-Looking Statements',
        description: 'Document contains forward-looking statements without required safe harbor language.',
        suggestion: 'Add standard safe harbor disclaimer: "This communication contains forward-looking statements within the meaning of Section 27A of the Securities Act..."',
        location: 'Multiple occurrences',
      });
    }

    // Check for MNPI keywords
    const mnpiKeywords = ['private meeting', 'cannot disclose', 'confidential', 'insider', 'non-public'];
    mnpiKeywords.forEach((kw) => {
      if (lowerText.includes(kw)) {
        issues.push({
          severity: 'critical',
          type: 'MNPI Violation',
          description: `Potential material non-public information detected: "${kw}"`,
          suggestion: 'Remove or rephrase to avoid disclosure of material non-public information. Ensure all material information is publicly available before distribution.',
        });
      }
    });

    // Check for stock price projections
    if (lowerText.includes('stock price') && (lowerText.includes('will') || lowerText.includes('reach') || lowerText.includes('expect'))) {
      issues.push({
        severity: 'critical',
        type: 'Stock Price Projection',
        description: 'Projecting specific stock price targets is prohibited.',
        suggestion: 'Remove stock price projections. Instead, discuss business fundamentals and let investors draw their own conclusions.',
      });
    }

    // Check for acquisition discussions
    if (lowerText.includes('acquisition') && (lowerText.includes('discuss') || lowerText.includes('negotiation'))) {
      issues.push({
        severity: 'warning',
        type: 'Reg FD Concern',
        description: 'Discussion of ongoing M&A activity may require formal disclosure.',
        suggestion: 'Ensure any material M&A discussions are properly disclosed via Form 8-K or press release before investor communications.',
      });
    }

    // Check for missing disclaimers
    if (!lowerText.includes('not financial advice') && !lowerText.includes('consult')) {
      issues.push({
        severity: 'info',
        type: 'Missing Disclaimer',
        description: 'Communication lacks standard investment disclaimer.',
        suggestion: 'Add disclaimer: "This communication is for informational purposes only and does not constitute investment advice."',
      });
    }

    // Calculate score
    const criticalCount = issues.filter((i) => i.severity === 'critical').length;
    const warningCount = issues.filter((i) => i.severity === 'warning').length;
    const score = Math.max(0, 100 - criticalCount * 30 - warningCount * 10);

    setResult({ score, issues });
    setIsChecking(false);

    toast({
      title: score >= 70 ? 'Compliance Check Complete' : 'Issues Detected',
      description: `Found ${issues.length} issue(s) requiring attention.`,
      variant: score >= 70 ? 'default' : 'destructive',
    });
  };

  const loadSample = () => {
    setText(sampleText);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Compliance Checker</h1>
        <p className="text-muted-foreground">
          AI-powered screening for Regulation FD, MNPI, and forward-looking statement compliance.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Draft Communication</h2>
              <Button variant="ghost" size="sm" onClick={loadSample}>
                Load Sample
              </Button>
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your investor communication, press release, or email draft here..."
              className="min-h-[300px] resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                {text.length} characters
              </p>
              <Button
                onClick={checkCompliance}
                disabled={isChecking || !text.trim()}
                variant="gradient"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Check Compliance
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Compliance Rules */}
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h2 className="text-lg font-semibold mb-4">Active Compliance Rules</h2>
            <div className="space-y-3">
              {complianceRules.map((rule) => (
                <div key={rule.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{rule.name}</p>
                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Score Card */}
              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="text-lg font-semibold mb-4">Compliance Score</h2>
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32">
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
                        stroke={result.score >= 80 ? 'hsl(var(--success))' : result.score >= 50 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'}
                        strokeWidth="10"
                        strokeDasharray={`${result.score * 2.83} 283`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={cn("text-3xl font-bold", getScoreColor(result.score))}>
                        {result.score}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className={cn("text-2xl font-bold", getScoreColor(result.score))}>
                      {result.score >= 80 ? 'Good' : result.score >= 50 ? 'Needs Review' : 'High Risk'}
                    </p>
                    <p className="text-muted-foreground">
                      {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''} found
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-destructive">
                        {result.issues.filter((i) => i.severity === 'critical').length} critical
                      </span>
                      <span className="text-warning">
                        {result.issues.filter((i) => i.severity === 'warning').length} warnings
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues List */}
              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h2 className="text-lg font-semibold mb-4">Issues Detected</h2>
                {result.issues.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                    <p className="font-medium">No compliance issues detected</p>
                    <p className="text-sm text-muted-foreground">Your communication appears to be compliant.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {result.issues.map((issue, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-4 rounded-xl border animate-fade-in",
                          issue.severity === 'critical' && "bg-destructive/5 border-destructive/30",
                          issue.severity === 'warning' && "bg-warning/5 border-warning/30",
                          issue.severity === 'info' && "bg-primary/5 border-primary/30"
                        )}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(issue.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{issue.type}</span>
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full uppercase",
                                issue.severity === 'critical' && "bg-destructive/20 text-destructive",
                                issue.severity === 'warning' && "bg-warning/20 text-warning",
                                issue.severity === 'info' && "bg-primary/20 text-primary"
                              )}>
                                {issue.severity}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-background/50">
                              <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <p className="text-sm">{issue.suggestion}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-card rounded-xl p-12 border border-border/50 text-center">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Compliance Results</h3>
              <p className="text-muted-foreground">
                Enter your text and click "Check Compliance" to see the analysis results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
