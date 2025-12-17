import { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Download, 
  Loader2,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp, companyData, Report } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const reportTypes = [
  { value: 'quarterly', label: 'Quarterly Earnings', icon: BarChart3, description: 'Financial performance summary' },
  { value: 'esg', label: 'ESG Report', icon: Leaf, description: 'Environmental, Social, Governance' },
  { value: 'investor-update', label: 'Investor Update', icon: TrendingUp, description: 'Strategic highlights & outlook' },
];

const sections = [
  { id: 'executive', label: 'Executive Summary' },
  { id: 'financial', label: 'Financial Highlights' },
  { id: 'metrics', label: 'Key Metrics & KPIs' },
  { id: 'outlook', label: 'Forward Outlook' },
  { id: 'risks', label: 'Risk Factors' },
];

const quarterlyData = [
  { quarter: 'Q1 2024', revenue: 2.1, earnings: 0.58 },
  { quarter: 'Q2 2024', revenue: 2.25, earnings: 0.62 },
  { quarter: 'Q3 2024', revenue: 2.4, earnings: 0.67 },
];

const yoyData = [
  { metric: 'Revenue', current: 12, previous: 8 },
  { metric: 'Net Income', current: 15, previous: 10 },
  { metric: 'EPS', current: 14, previous: 9 },
  { metric: 'FCF', current: 18, previous: 12 },
];

export default function Reports() {
  const { reports, setReports } = useApp();
  const { toast } = useToast();
  const [reportType, setReportType] = useState('quarterly');
  const [dateRange, setDateRange] = useState({ start: '2024-07-01', end: '2024-09-30' });
  const [selectedSections, setSelectedSections] = useState(['executive', 'financial', 'metrics']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedReport, setGeneratedReport] = useState<Report | null>(null);

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((s) => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const generateReport = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedReport(null);

    // Simulate report generation with progress
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const newReport: Report = {
      id: Date.now().toString(),
      type: reportType as Report['type'],
      title: `${reportTypes.find((r) => r.value === reportType)?.label} - ${companyData.quarter}`,
      createdAt: new Date(),
      status: 'complete',
      content: generateReportContent(reportType),
    };

    setReports((prev) => [...prev, newReport]);
    setGeneratedReport(newReport);
    setIsGenerating(false);

    toast({
      title: 'Report Generated',
      description: 'Your report is ready for review and export.',
    });
  };

  const generateReportContent = (type: string) => {
    const typeLabel = reportTypes.find((r) => r.value === type)?.label;
    return `
# ${companyData.name}
## ${typeLabel} - ${companyData.quarter}

### Executive Summary

TechCorp Solutions delivered another strong quarter with revenue of $2.4 billion, representing 12% year-over-year growth. Our strategic investments in AI and cloud infrastructure continue to drive sustainable growth across all business segments.

### Financial Highlights

| Metric | Q3 2024 | Q3 2023 | Change |
|--------|---------|---------|--------|
| Revenue | $2.4B | $2.14B | +12% |
| Gross Margin | 28% | 26.5% | +150 bps |
| Operating Income | $420M | $365M | +15% |
| EPS | $3.45 | $3.02 | +14% |

### Key Performance Indicators

- **Cloud Services Revenue**: $1.08B (+25% YoY)
- **Enterprise Customers**: 2,500+ (+18% YoY)
- **Net Revenue Retention**: 125%
- **Free Cash Flow**: $380M

### Forward Outlook

Management reaffirms FY2024 guidance with expected revenue growth of 14-16% and continued margin expansion. Key initiatives for Q4 include:

1. Launch of next-gen AI platform
2. Expansion into APAC markets
3. Strategic partnership announcements

### Risk Factors

- Macroeconomic uncertainty
- Competitive pressures in cloud market
- Regulatory changes in key markets
    `;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Report Generator</h1>
        <p className="text-muted-foreground">
          Generate AI-powered reports with financial data, charts, and professional narratives.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Report Type */}
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h2 className="text-lg font-semibold mb-4">Report Type</h2>
            <div className="grid gap-3">
              {reportTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setReportType(type.value)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                    reportType === type.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    reportType === type.value ? "gradient-bg" : "bg-muted"
                  )}>
                    <type.icon className={cn(
                      "w-6 h-6",
                      reportType === type.value ? "text-primary-foreground" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium">{type.label}</p>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                  {reportType === type.value && (
                    <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h2 className="text-lg font-semibold mb-4">Date Range</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h2 className="text-lg font-semibold mb-4">Include Sections</h2>
            <div className="space-y-3">
              {sections.map((section) => (
                <label
                  key={section.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedSections.includes(section.id)}
                    onCheckedChange={() => handleSectionToggle(section.id)}
                  />
                  <span>{section.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateReport}
            disabled={isGenerating || selectedSections.length === 0}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Report... {progress}%
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Generate Report
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-bg transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {generatedReport ? (
            <>
              {/* Report Header */}
              <div className="bg-card rounded-xl p-6 border border-border/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{generatedReport.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      Generated {generatedReport.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Excel
                    </Button>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h3 className="font-semibold mb-4">Quarterly Revenue & Earnings</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={quarterlyData}>
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
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Revenue ($B)" />
                    <Bar dataKey="earnings" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Earnings ($B)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h3 className="font-semibold mb-4">Year-over-Year Growth (%)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={yoyData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="metric" type="category" className="text-xs" width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="current" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} name="Current Year" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Financial Table */}
              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h3 className="font-semibold mb-4">Financial Summary</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 font-medium">Metric</th>
                        <th className="text-right py-3 font-medium">Q3 2024</th>
                        <th className="text-right py-3 font-medium">Q3 2023</th>
                        <th className="text-right py-3 font-medium">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-3">Revenue</td>
                        <td className="text-right">$2.4B</td>
                        <td className="text-right">$2.14B</td>
                        <td className="text-right text-success">+12%</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3">Gross Margin</td>
                        <td className="text-right">28%</td>
                        <td className="text-right">26.5%</td>
                        <td className="text-right text-success">+150 bps</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3">Operating Income</td>
                        <td className="text-right">$420M</td>
                        <td className="text-right">$365M</td>
                        <td className="text-right text-success">+15%</td>
                      </tr>
                      <tr>
                        <td className="py-3">EPS</td>
                        <td className="text-right">$3.45</td>
                        <td className="text-right">$3.02</td>
                        <td className="text-right text-success">+14%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-xl p-12 border border-border/50 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Report Preview</h3>
              <p className="text-muted-foreground">
                Configure your report settings and click generate to see a preview.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
