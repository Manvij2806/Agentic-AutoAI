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

const sampleText = `Vehicle Safety Inspection Report

Vehicle: 2019 Honda Accord, VIN: 1HGCV1F34KA123456
Mileage: 75,432 miles
Date: December 17, 2024

Brakes: Front pads at 2mm - REQUIRES IMMEDIATE ATTENTION
Tires: Rear tires showing uneven wear, tread depth 3/32"
Lights: All functioning properly
Wipers: Front wipers streaking, recommend replacement
Fluid Levels: All fluids topped off
Battery: Testing at 11.8V - Below optimal (should be 12.4-12.7V)

Technician Notes: Customer was advised of brake condition but declined immediate service. Said they would "think about it" and come back next week.

Recommended Services:
- Brake pad replacement (front): $299
- Tire rotation and alignment: $89
- Wiper blade replacement: $45
- Battery replacement: $189`;

const complianceRules = [
  { id: 'safety', name: 'Safety Standards', description: 'DOT safety requirements' },
  { id: 'disclosure', name: 'Customer Disclosure', description: 'Required safety notifications' },
  { id: 'documentation', name: 'Documentation', description: 'Proper record keeping' },
  { id: 'liability', name: 'Liability Protection', description: 'Legal documentation' },
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
        description: 'Please enter or paste inspection report to check for compliance.',
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);
    setResult(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const issues: ComplianceIssue[] = [];
    const lowerText = text.toLowerCase();

    // Check for critical safety issues not properly documented
    if (lowerText.includes('2mm') || lowerText.includes('immediate attention')) {
      if (!lowerText.includes('signed') && !lowerText.includes('acknowledged')) {
        issues.push({
          severity: 'critical',
          type: 'Safety Acknowledgment Missing',
          description: 'Critical safety issue identified but customer acknowledgment not documented.',
          suggestion: 'Obtain written customer signature acknowledging they were informed of the safety concern and their decision to decline service. Use Form SA-101 for liability protection.',
          location: 'Brake inspection section',
        });
      }
    }

    // Check for declined critical services
    if (lowerText.includes('declined') && (lowerText.includes('brake') || lowerText.includes('critical'))) {
      issues.push({
        severity: 'critical',
        type: 'Declined Safety Service',
        description: 'Customer declined critical safety service without proper documentation.',
        suggestion: 'Document the specific conversation, have customer sign a "Service Declined" waiver (Form SD-201), and schedule a follow-up reminder call.',
      });
    }

    // Check for battery below threshold
    if (lowerText.includes('11.8v') || lowerText.includes('below optimal')) {
      issues.push({
        severity: 'warning',
        type: 'Battery Warning',
        description: 'Low battery voltage detected. Customer should be warned of potential failure.',
        suggestion: 'Provide written notice of battery condition. Recommend replacement or load testing within 30 days.',
      });
    }

    // Check for tire safety
    if (lowerText.includes('3/32') || lowerText.includes('uneven wear')) {
      issues.push({
        severity: 'warning',
        type: 'Tire Safety Notice',
        description: 'Tires approaching minimum safe tread depth (2/32").',
        suggestion: 'Document tire condition with photos. Provide written estimate for replacement. Most states require minimum 2/32" tread depth.',
      });
    }

    // Check for missing required fields
    if (!lowerText.includes('vin')) {
      issues.push({
        severity: 'info',
        type: 'VIN Documentation',
        description: 'VIN should be clearly documented on all service records.',
        suggestion: 'Always include full VIN for proper vehicle identification and service history tracking.',
      });
    }

    // Check for technician signature
    if (!lowerText.includes('signature') && !lowerText.includes('certified')) {
      issues.push({
        severity: 'info',
        type: 'Technician Certification',
        description: 'Report should include technician certification number and signature.',
        suggestion: 'Add technician ASE certification number and signature to validate inspection.',
      });
    }

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
        <h1 className="text-3xl font-bold mb-2">Safety Compliance Checker</h1>
        <p className="text-muted-foreground">
          AI-powered screening for DOT safety standards, documentation requirements, and liability protection.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Inspection Report</h2>
              <Button variant="ghost" size="sm" onClick={loadSample}>
                Load Sample
              </Button>
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your vehicle inspection report, service notes, or customer communication..."
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
                      {result.score >= 80 ? 'Compliant' : result.score >= 50 ? 'Needs Review' : 'High Risk'}
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
                    <p className="text-sm text-muted-foreground">Your documentation appears to be compliant.</p>
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
                Enter your inspection report and click "Check Compliance" to see the analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
