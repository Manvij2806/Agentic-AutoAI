import { useState } from 'react';
import { 
  Users, 
  Settings, 
  Shield, 
  Activity,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Check,
  X,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp, User } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const auditLogs = [
  { id: 1, user: 'Sarah Johnson', action: 'Generated Q3 Earnings Report', timestamp: new Date(), type: 'report' },
  { id: 2, user: 'Michael Chen', action: 'Ran compliance check on investor email', timestamp: new Date(Date.now() - 3600000), type: 'compliance' },
  { id: 3, user: 'System', action: 'Automated sentiment analysis completed', timestamp: new Date(Date.now() - 7200000), type: 'system' },
  { id: 4, user: 'Emily Rodriguez', action: 'Uploaded Q3_Financials.pdf', timestamp: new Date(Date.now() - 10800000), type: 'document' },
  { id: 5, user: 'System', action: 'Daily backup completed', timestamp: new Date(Date.now() - 86400000), type: 'system' },
];

const systemMetrics = [
  { label: 'API Uptime', value: '99.97%', status: 'healthy' },
  { label: 'Avg Response Time', value: '145ms', status: 'healthy' },
  { label: 'Active Sessions', value: '24', status: 'healthy' },
  { label: 'Error Rate', value: '0.02%', status: 'healthy' },
];

export default function Admin() {
  const { users, setUsers } = useApp();
  const { toast } = useToast();
  const [aiModel, setAiModel] = useState('claude-3-opus');
  const [autoCompliance, setAutoCompliance] = useState(true);
  const [notifyOnCritical, setNotifyOnCritical] = useState(true);
  const [retentionDays, setRetentionDays] = useState('90');

  const handleUserStatusToggle = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    toast({
      title: 'User status updated',
      description: 'The user status has been changed successfully.',
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: 'User removed',
      description: 'The user has been removed from the system.',
    });
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <Activity className="w-4 h-4 text-primary" />;
      case 'compliance':
        return <Shield className="w-4 h-4 text-warning" />;
      case 'document':
        return <Settings className="w-4 h-4 text-success" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, configure system settings, and monitor platform performance.
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Audit
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Monitor
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">User Management</h2>
              <Button variant="gradient" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">User</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Last Active</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium capitalize",
                          user.role === 'admin' && "bg-primary/10 text-primary",
                          user.role === 'analyst' && "bg-secondary/10 text-secondary",
                          user.role === 'viewer' && "bg-muted text-muted-foreground"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={cn(
                          "flex items-center gap-1.5",
                          user.status === 'active' ? "text-success" : "text-muted-foreground"
                        )}>
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            user.status === 'active' ? "bg-success" : "bg-muted-foreground"
                          )} />
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {user.lastActive.toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleUserStatusToggle(user.id)}>
                            {user.status === 'active' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* AI Configuration */}
            <div className="bg-card rounded-xl p-6 border border-border/50">
              <h2 className="text-lg font-semibold mb-6">AI Configuration</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="ai-model">AI Model</Label>
                  <Select value={aiModel} onValueChange={setAiModel}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude-3-opus">Claude 3 Opus (Most Capable)</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet (Balanced)</SelectItem>
                      <SelectItem value="gpt-4">GPT-4 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input id="temperature" type="number" defaultValue="0.7" min="0" max="1" step="0.1" className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Controls response creativity (0-1)</p>
                </div>
                <div>
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input id="max-tokens" type="number" defaultValue="4096" className="mt-2" />
                </div>
              </div>
            </div>

            {/* Compliance Settings */}
            <div className="bg-card rounded-xl p-6 border border-border/50">
              <h2 className="text-lg font-semibold mb-6">Compliance Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-Compliance Check</p>
                    <p className="text-sm text-muted-foreground">Automatically scan all outgoing communications</p>
                  </div>
                  <Switch checked={autoCompliance} onCheckedChange={setAutoCompliance} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Critical Alert Notifications</p>
                    <p className="text-sm text-muted-foreground">Email alerts for critical compliance issues</p>
                  </div>
                  <Switch checked={notifyOnCritical} onCheckedChange={setNotifyOnCritical} />
                </div>
                <div>
                  <Label htmlFor="retention">Data Retention (days)</Label>
                  <Select value={retentionDays} onValueChange={setRetentionDays}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select retention period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <Button variant="gradient" className="w-full sm:w-auto">
            Save Settings
          </Button>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h2 className="text-lg font-semibold mb-6">Audit Log</h2>
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 animate-fade-in"
                >
                  <div className="mt-1">
                    {getActionIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>{log.user}</span>
                      <span>•</span>
                      <span>{log.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemMetrics.map((metric) => (
              <div key={metric.label} className="bg-card rounded-xl p-6 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <span className="flex items-center gap-1 text-success text-xs">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    Healthy
                  </span>
                </div>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl p-6 border border-border/50">
            <h2 className="text-lg font-semibold mb-4">System Health</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-success/10">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success" />
                  <span>All systems operational</span>
                </div>
                <span className="text-sm text-muted-foreground">Last checked: Just now</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">Database</p>
                  <p className="font-medium text-success">Connected</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">AI Service</p>
                  <p className="font-medium text-success">Active</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">Cache</p>
                  <p className="font-medium text-success">Healthy</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
