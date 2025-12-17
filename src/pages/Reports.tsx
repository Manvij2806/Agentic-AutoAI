import { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Download, 
  Loader2,
  CheckCircle,
  Wrench,
  Car,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp, serviceData, Report } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const reportTypes = [
  { value: 'service', label: 'Service Summary', icon: Wrench, description: 'Daily/weekly service overview' },
  { value: 'maintenance', label: 'Maintenance Report', icon: Car, description: 'Vehicle maintenance tracking' },
  { value: 'diagnostic', label: 'Diagnostic Report', icon: AlertTriangle, description: 'Fault codes and repairs' },
];

const sections = [
  { id: 'summary', label: 'Executive Summary' },
  { id: 'services', label: 'Services Completed' },
  { id: 'parts', label: 'Parts & Inventory' },
  { id: 'technicians', label: 'Technician Performance' },
  { id: 'customers', label: 'Customer Feedback' },
];

const serviceData2 = [
  { service: 'Oil Change', count: 342, revenue: 25650 },
  { service: 'Tire Service', count: 215, revenue: 32250 },
  { service: 'Brakes', count: 178, revenue: 53400 },
];

const techPerformance = [
  { name: 'Mike J.', jobs: 156, rating: 4.9 },
  { name: 'Sarah C.', jobs: 148, rating: 4.8 },
  { name: 'James R.', jobs: 142, rating: 4.7 },
  { name: 'Tom B.', jobs: 138, rating: 4.8 },
];

export default function Reports() {
  const { reports, setReports } = useApp();
  const { toast } = useToast();
  const [reportType, setReportType] = useState('service');
  const [dateRange, setDateRange] = useState({ start: '2024-12-01', end: '2024-12-17' });
  const [selectedSections, setSelectedSections] = useState(['summary', 'services', 'parts']);
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

    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const newReport: Report = {
      id: Date.now().toString(),
      type: reportType as Report['type'],
      title: `${reportTypes.find((r) => r.value === reportType)?.label} - ${serviceData.month}`,
      createdAt: new Date(),
      status: 'complete',
      content: generateReportContent(reportType),
    };

    setReports((prev) => [...prev, newReport]);
    setGeneratedReport(newReport);
    setIsGenerating(false);

    toast({
      title: 'Report Generated',
      description: 'Your service report is ready for review and export.',
    });
  };

  const generateReportContent = (type: string) => {
    const typeLabel = reportTypes.find((r) => r.value === type)?.label;
    return `
# ${serviceData.name}
## ${typeLabel} - ${serviceData.month}

### Executive Summary

AutoCare Pro delivered another strong month with 1,180 services completed, representing 18% year-over-year growth. Customer satisfaction remains high at 4.8/5 stars with a 78% return customer rate.

### Services Completed

| Service Type | Count | Revenue | Avg. Ticket |
|--------------|-------|---------|-------------|
| Oil Changes | 342 | $25,650 | $75 |
| Tire Services | 215 | $32,250 | $150 |
| Brake Services | 178 | $53,400 | $300 |
| Diagnostics | 156 | $15,600 | $100 |
| A/C Services | 89 | $17,800 | $200 |

### Key Performance Indicators

- **Total Revenue**: $485,000 (+18% YoY)
- **Services Completed**: 1,180
- **Average Ticket**: $287
- **Labor Hours**: 1,680 hours
- **Parts Used**: 3,420 units

### Technician Productivity

All 8 technicians maintained excellent performance levels with an average of 147 services per technician this month.

### Customer Feedback

- Return Rate: 78%
- Average Rating: 4.8/5 ⭐
- NPS Score: 72
    `;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Report Generator</h1>
        <p className="text-muted-foreground">
          Generate AI-powered service reports with performance data, charts, and insights.
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
                <h3 className="font-semibold mb-4">Services by Type</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={serviceData2}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="service" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h3 className="font-semibold mb-4">Technician Performance</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={techPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="name" type="category" className="text-xs" width={60} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="jobs" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} name="Jobs" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Service Table */}
              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h3 className="font-semibold mb-4">Service Summary</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 font-medium">Service</th>
                        <th className="text-right py-3 font-medium">Count</th>
                        <th className="text-right py-3 font-medium">Revenue</th>
                        <th className="text-right py-3 font-medium">Avg.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-3">Oil Changes</td>
                        <td className="text-right">342</td>
                        <td className="text-right">$25,650</td>
                        <td className="text-right text-success">$75</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3">Tire Services</td>
                        <td className="text-right">215</td>
                        <td className="text-right">$32,250</td>
                        <td className="text-right text-success">$150</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3">Brake Services</td>
                        <td className="text-right">178</td>
                        <td className="text-right">$53,400</td>
                        <td className="text-right text-success">$300</td>
                      </tr>
                      <tr>
                        <td className="py-3">Diagnostics</td>
                        <td className="text-right">156</td>
                        <td className="text-right">$15,600</td>
                        <td className="text-right text-success">$100</td>
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
